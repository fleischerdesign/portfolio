import type { ComposerTranslation, LocaleMessageValue, VueMessageType } from "#i18n";
import type { LocaleMessage, RemoveIndexSignature } from "@intlify/core-base";

export const personalData = (t: ComposerTranslation<{ en: LocaleMessage<VueMessageType>; de: LocaleMessage<VueMessageType>; }, "en" | "de", RemoveIndexSignature<{ [x: string]: LocaleMessageValue<VueMessageType>; }>, never, string, string>) => ({
  name: "Philipp Fleischer",
  subtitle: t("home.hero.summary"),
  location: t("resume.personal.location"),
  internshipStatus: t("resume.personal.internshipStatus"),
  birth: {
    date: "16.12.1995",
    location: "Demmin"
  },
  maritalStatus: t('resume.details.marital_status'),
  driversLicense: t('resume.details.drivers_license'),
  address: {
    country: "Deutschland",
    county: "Mecklenburg-Vorpommern",
    postalCode: 17036,
    city: "Neubrandenburg",
    street: "Hufelandstraße 55"
  }
});
