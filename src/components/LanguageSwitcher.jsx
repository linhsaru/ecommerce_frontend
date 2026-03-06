import { useTranslation } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { lang, setLang } = useTranslation();

  const options = [
    { code: 'en', label: 'EN' },
    { code: 'vi', label: 'VI' },
  ];

  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => setLang(opt.code)}
          className={`relative px-3 py-2 text-sm font-medium transition-colors
            ${lang === opt.code ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {opt.label}
          {lang === opt.code && (
            <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
