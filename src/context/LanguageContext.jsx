import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../i18n/locales/en';
import vi from '../i18n/locales/vi';

const STORAGE_KEY = 'app_language';
const DEFAULT_LANG = 'vi';

const dictionaries = { en, vi };

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === 'en' || stored === 'vi')) return stored;
    } catch (_) {}
    return DEFAULT_LANG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
  }, [lang]);

  const setLang = useCallback((newLang) => {
    if (newLang === 'en' || newLang === 'vi') setLangState(newLang);
  }, []);

  const t = useCallback((key) => {
    const dict = dictionaries[lang] || dictionaries.vi;
    return dict[key] ?? key;
  }, [lang]);

  const value = { lang, setLang, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return ctx;
};
