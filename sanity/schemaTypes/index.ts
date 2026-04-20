import type { SchemaTypeDefinition } from "sanity";
import aftercarePage from "./aftercarePage";
import flashPiece from "./flashPiece";
import portfolioPiece from "./portfolioPiece";
import tourStop from "./tourStop";

export const schemaTypes: SchemaTypeDefinition[] = [
  portfolioPiece,
  flashPiece,
  tourStop,
  aftercarePage,
];
