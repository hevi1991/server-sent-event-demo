// Import the framework and instantiate it
import Fastify from "fastify";
import fastifyView from "@fastify/view";
import ejs from "ejs";
import { FastifySSEPlugin } from "fastify-sse-v2";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyView, {
  engine: {
    ejs: ejs,
  },
});

fastify.register(FastifySSEPlugin);

// Declare a route
fastify.get("/", async function handler(request, reply) {
  return reply.view("templates/index.ejs");
});

fastify.get("/sse", async function handler(request, reply) {
  reply.headers({
    "Content-Type": "text/event-stream",
  });

  reply.sse(
    (async function* source() {
      while (true) {
        await delay(Math.random() * 10);
        const data = Math.random() > 0.5 ? "1" : "0";
        yield { data };
      }
    })()
  );
});

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
