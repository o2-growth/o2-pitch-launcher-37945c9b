import { createFileRoute } from "@tanstack/react-router";
import { Versions } from "../pages/Versions";

export const Route = createFileRoute("/versions")({
  component: Versions,
});
