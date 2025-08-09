import type { ComposerTranslation, LocaleMessageValue, VueMessageType } from "#i18n";
import type { LocaleMessage, RemoveIndexSignature } from "@intlify/core-base";

export const interestsData = (t: ComposerTranslation<{ en: LocaleMessage<VueMessageType>; de: LocaleMessage<VueMessageType>; }, "en" | "de", RemoveIndexSignature<{ [x: string]: LocaleMessageValue<VueMessageType>; }>, never, string, string>) => ({
  technology: [t('interests.technology.programming'), t('interests.technology.ml'), t('interests.technology.ai'), t('interests.technology.additive_manufacturing'), t('interests.technology.cad'), t('interests.technology.video_games')],
  culture: [t('interests.culture.books'), t('interests.culture.music'), t('interests.culture.cuisine'), t('interests.culture.nature'), t('interests.culture.art'), t('interests.culture.design'), t('interests.culture.film')],
  health: [t('interests.health.running'), t('interests.health.fitness'), t('interests.health.mental'), t('interests.health.nutrition')],
  education: [t('interests.education.stem'), t('interests.education.psychology'), t('interests.education.history'), t('interests.education.politics'), t('interests.education.biology')]
});
