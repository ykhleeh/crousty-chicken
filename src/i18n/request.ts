import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

import fr from "../../messages/fr.json";
import nl from "../../messages/nl.json";
import en from "../../messages/en.json";

const messages = { fr, nl, en } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "fr" | "nl" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale as keyof typeof messages],
  };
});
