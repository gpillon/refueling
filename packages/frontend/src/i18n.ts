import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import itTranslations from './locales/it.json';
import rmTranslations from './locales/rm.json';
import naTranslations from './locales/na.json';

const getStoredLanguage = () => {
  return localStorage.getItem('preferredLanguage') || 'en';
};

const setStoredLanguage = (lang: string) => {
  localStorage.setItem('preferredLanguage', lang);
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      rm: { translation: rmTranslations },
      na: { translation: naTranslations },
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      it: { translation: itTranslations },
    },
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  setStoredLanguage(lng);
});

export default i18n;