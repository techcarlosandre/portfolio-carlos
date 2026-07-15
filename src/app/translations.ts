import { pt } from "./translations/pt";
import { en } from "./translations/en";

export type TranslationSchema = typeof pt;

export const translations = { pt, en } as const;

export type Lang = keyof typeof translations;
export type TranslationType = TranslationSchema;
