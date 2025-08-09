import type { ComposerTranslation, LocaleMessageValue, VueMessageType } from "#i18n";
import type { LocaleMessage, RemoveIndexSignature } from "@intlify/core-base";

export const languagesData = (t: ComposerTranslation<{ en: LocaleMessage<VueMessageType>; de: LocaleMessage<VueMessageType>; }, "en" | "de", RemoveIndexSignature<{ [x: string]: LocaleMessageValue<VueMessageType>; }>, never, string, string>) => [
  { name: t('languages.german'), level: t('languages.native') },
  { name: t('languages.english'), level: 'C1' }
];
