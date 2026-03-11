import { useTranslation } from '../../../context/LanguageContext';

const DashboardPage = () => {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-slate-800">{t('dashboard')}</h1>
      <p className="text-slate-500 mt-2">{t('orders')} | {t('revenue')} | {t('users')} | {t('inventory')} | {t('ai_builder')} | {t('compatibility')}</p>
    </div>
  );
};

export default DashboardPage;
