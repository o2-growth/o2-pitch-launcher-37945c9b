import { createFileRoute } from "@tanstack/react-router";
import { Storytelling } from "../pages/Storytelling";

export const Route = createFileRoute("/storytelling")({
  component: Storytelling,
});
