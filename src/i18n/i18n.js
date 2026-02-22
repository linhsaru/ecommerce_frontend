import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enTextTranslation from './locales/en/translateText.json';

i18n
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: 'kr',
    fallbackLng: 'kr',
    debug: true,
    resources: {
      en: {
        translation: enTextTranslation,
      },
    },
    backend: {
      backendOptions: [],
      cacheHitMode: 'refreshAndUpdateStore',
    },
    detection: {
      order: ['cookie', 'navigator'],
      caches: ['cookie'],
      cookieName: 'i18n',
      cookieSecure: false,
      cookieMaxAge: 365 * 24 * 60 * 60 * 1000,
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      bindI18nStore: 'added', // this way, when the HttpBackend delivers new translations (thanks to refreshAndUpdateStore), the UI gets updated
    },
  });

export default i18n;
