import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { fromHono } from "chanfana";

// Start a Hono app
const app = new Hono().basePath("/api/");

// Setup OpenAPI registry
const openapi = fromHono(app, {
  base: "/api",
  docs_url: "/",
  openapi_url: "/openapi.json",
});

// Register OpenAPI endpoints
openapi.get("/tasks", TaskList);
openapi.post("/tasks", TaskCreate);
openapi.get("/tasks/:taskSlug", TaskFetch);
openapi.delete("/tasks/:taskSlug", TaskDelete);

// Export the Hono app
export default app;
