import { createFileRoute } from "@tanstack/react-router";
import { DeckConfigPage } from "../pages/DeckConfigPage";

export const Route = createFileRoute("/deck-config")({
  component: DeckConfigPage,
});
