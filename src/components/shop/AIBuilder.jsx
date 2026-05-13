import { useState } from 'react';
import { Bot, Zap } from 'lucide-react';
import { apiService } from '../../services';
import ToastNotification from '../common/ToastNotification/ToastNotification';
import { useTranslation } from '../../context/LanguageContext';

const BUDGET_OPTIONS = [
  { id: 'under-15', labelKey: 'ai_budget_under_15' },
  { id: '15-25', labelKey: 'ai_budget_15_25' },
  { id: '25-40', labelKey: 'ai_budget_25_40' },
  { id: '40-plus', labelKey: 'ai_budget_40_plus' },
];

const USAGE_OPTIONS = [
  { id: 'office', labelKey: 'ai_usage_office' },
  { id: 'gaming', labelKey: 'ai_usage_gaming' },
  { id: 'creator', labelKey: 'ai_usage_creator' },
  { id: 'ai-dev', labelKey: 'ai_usage_ai_dev' },
];

const PERFORMANCE_OPTIONS = [
  { id: 'fps', labelKey: 'ai_perf_fps' },
  { id: 'multitask', labelKey: 'ai_perf_multitask' },
  { id: 'silent', labelKey: 'ai_perf_silent' },
  { id: 'efficiency', labelKey: 'ai_perf_efficiency' },
];

const BRAND_OPTIONS = [
  { id: 'intel-nvidia', labelKey: 'ai_brand_intel_nvidia' },
  { id: 'amd', labelKey: 'ai_brand_amd' },
  { id: 'mixed', labelKey: 'ai_brand_mixed' },
];

const AIBuilder = ({ onApplySuggestion }) => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      isWelcome: true,
    },
  ]);

  const [budget, setBudget] = useState('');
  const [usage, setUsage] = useState('');
  const [performance, setPerformance] = useState([]);
  const [brand, setBrand] = useState('no-pref');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', status: 'info' });

  const togglePerformance = (id) => {
    setPerformance((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getLabel = (list, id) => {
    const item = list.find((item) => item.id === id);
    return item ? t(item.labelKey) : undefined;
  };

  const handleRecommend = async () => {
    if (!budget || !usage) return;

    const budgetLabel = getLabel(BUDGET_OPTIONS, budget);
    const usageLabel = getLabel(USAGE_OPTIONS, usage);
    const perfLabels = performance.map((id) => getLabel(PERFORMANCE_OPTIONS, id)).filter(Boolean);
    const brandLabel = brand === 'no-pref' ? '' : getLabel(BRAND_OPTIONS, brand);
    setIsLoading(true);

    try {
      const payload = {
        budget: budgetLabel || null,
        usage: usageLabel || null,
        performanceTags: perfLabels,
        brandPreference: brandLabel || null,
      };

      const response = await apiService.post('/api/pc-build/gemini-suggestions', payload, {
        timeout: 120000,
      });
      const root = response?.data ?? response;

      if (root?.success === false) {
        const hasNoBuildError = root?.errors?.some(e => e.code === 'NO_BUILD');
        if (hasNoBuildError) {
          setToast({ visible: true, message: t('ai_error_no_build'), status: 'error' });
        } else {
          setToast({ visible: true, message: root?.message || t('ai_error_general'), status: 'error' });
        }
        return;
      }

      const suggestion = root?.data ?? root;

      if (typeof onApplySuggestion === 'function') {
        onApplySuggestion(suggestion);
      }

    } catch (error) {
      console.error('Failed to get AI suggestion', error);
      const root = error.response?.data;
      if (root?.errors?.some(e => e.code === 'NO_BUILD')) {
        setToast({ visible: true, message: t('ai_error_no_build'), status: 'error' });
      } else {
        setToast({ visible: true, message: t('ai_error_general'), status: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="ai-builder"
      className="relative rounded-3xl border-2 border-indigo-200/60 bg-white/80 backdrop-blur-sm p-6 md:p-8 shadow-[0_0_40px_rgba(99,102,241,0.08)]"
    >
      <ToastNotification
        isVisible={toast.visible}
        message={toast.message}
        status={toast.status}
        onClose={() => setToast({ ...toast, visible: false })}
      />
      {/* Soft glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-transparent pointer-events-none" />
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-indigo-400/10 to-transparent blur-xl -z-10" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-[0_4px_14px_rgba(99,102,241,0.4)]">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{t('ai_title')}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              {t('ai_subtitle')}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-800 border border-slate-200/80'
                  }`}
              >
                {msg.isWelcome ? (
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {t('ai_welcome_text_1')}
                    <br /><br />
                    <span className="font-semibold text-amber-600">{t('ai_note')}:</span> {t('ai_welcome_text_2')}
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-4 space-y-5">
          {/* Required group */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-600">
                  {t('ai_budget_label')} <span className="text-red-500">*</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBudget(opt.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${budget === opt.id
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-600">
                  {t('ai_usage_label')} <span className="text-red-500">*</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {USAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setUsage(opt.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${usage === opt.id
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Performance group */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-600">
                {t('ai_perf_label')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PERFORMANCE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => togglePerformance(opt.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${performance.includes(opt.id)
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                    }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Brand preference */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-600">
                {t('ai_brand_label')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {BRAND_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBrand(opt.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${brand === opt.id
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-600'
                    }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-slate-400">
              {t('ai_requirement_note')} <span className="font-medium text-slate-500">{t('ai_budget_label')}</span> {t('ai_and')}{' '}
              <span className="font-medium text-slate-500">{t('ai_usage_label')}</span> {t('ai_to_suggest')}
            </p>
            <button
              type="button"
              onClick={handleRecommend}
              disabled={!budget || !usage || isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              {isLoading ? t('ai_suggesting') : t('ai_suggest_btn')}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-3 text-center">
          {t('ai_reference_note')}
        </p>
      </div>
    </section>
  );
};

export default AIBuilder;
