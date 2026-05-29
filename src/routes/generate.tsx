import { createFileRoute } from "@tanstack/react-router";
import { Generate } from "../pages/Generate";

export const Route = createFileRoute("/generate")({
  component: Generate,
});
