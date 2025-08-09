import type { ComposerTranslation, LocaleMessageValue, VueMessageType } from "#i18n";
import type { LocaleMessage, RemoveIndexSignature } from "@intlify/core-base";

export const softSkillsData = (t: ComposerTranslation<{ en: LocaleMessage<VueMessageType>; de: LocaleMessage<VueMessageType>; }, "en" | "de", RemoveIndexSignature<{ [x: string]: LocaleMessageValue<VueMessageType>; }>, never, string, string>) => [
  t('softskills.leadership'),
  t('softskills.teamwork'),
  t('softskills.problem_solving'),
  t('softskills.communication'),
  t('softskills.adaptability'),
  t('softskills.time_management'),
  t('softskills.critical_thinking'),
  t('softskills.creativity'),
  t('softskills.attention_to_detail')
];
