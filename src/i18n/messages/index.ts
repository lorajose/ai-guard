import { en } from "./en";
import { es } from "./es";

export const messages = {
  en,
  es,
};

export type Locale = keyof typeof messages;
