import type {
  ComposerTranslation,
  LocaleMessageValue,
  VueMessageType,
} from "#i18n";
import type { LocaleMessage, RemoveIndexSignature } from "@intlify/core-base";

export const softSkillsData = (
  t: ComposerTranslation<
    { en: LocaleMessage<VueMessageType>; de: LocaleMessage<VueMessageType> },
    "en" | "de",
    RemoveIndexSignature<{ [x: string]: LocaleMessageValue<VueMessageType> }>,
    never,
    string,
    string
  >,
) => [
  { name: t("softskills.leadership"), score: 85 },
  { name: t("softskills.teamwork"), score: 95 },
  { name: t("softskills.problem_solving"), score: 90 },
  { name: t("softskills.communication"), score: 88 },
  { name: t("softskills.adaptability"), score: 92 },
  { name: t("softskills.time_management"), score: 85 },
  { name: t("softskills.critical_thinking"), score: 90 },
  { name: t("softskills.creativity"), score: 80 },
  { name: t("softskills.attention_to_detail"), score: 88 },
];
