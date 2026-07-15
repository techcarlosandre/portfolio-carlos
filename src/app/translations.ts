import { pt } from "./translations/pt";
import { en } from "./translations/en";

export const translations = { pt, en } as const;

export type Lang = keyof typeof translations;
