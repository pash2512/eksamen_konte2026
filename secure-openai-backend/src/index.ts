import { fromHono } from "chanfana";
import { Hono } from "hono";
import { JobAnalysis } from "./endpoints/jobAnalysis";

type Env = {
	OPENAI_API_KEY: string;
}

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register Analysis endpoint
openapi.post("/api/analyze", JobAnalysis);

// Export the Hono app
export default app;
