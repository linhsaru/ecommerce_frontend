import { useState } from 'react';
import { Bot, Zap } from 'lucide-react';
import { apiService } from '../../services';

const BUDGET_OPTIONS = [
  { id: 'under-15', label: 'Dưới 15 triệu' },
  { id: '15-25', label: '15 - 25 triệu' },
  { id: '25-40', label: '25 - 40 triệu' },
  { id: '40-plus', label: 'Trên 40 triệu' },
];

const USAGE_OPTIONS = [
  { id: 'office', label: 'Văn phòng / học tập' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'creator', label: 'Design / Edit video' },
  { id: 'ai-dev', label: 'AI / Lập trình' },
];

const PERFORMANCE_OPTIONS = [
  { id: 'fps', label: 'Ưu tiên FPS cao' },
  { id: 'multitask', label: 'Ưu tiên đa nhiệm' },
  { id: 'silent', label: 'Ưu tiên êm / mát' },
  { id: 'efficiency', label: 'Ưu tiên tiết kiệm điện' },
];

const BRAND_OPTIONS = [
  { id: 'intel-nvidia', label: 'Intel + NVIDIA' },
  { id: 'amd', label: 'Full AMD' },
  { id: 'mixed', label: 'Pha trộn tối ưu giá' },
];

const AIBuilder = ({ onApplySuggestion }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: (
        <>
          Chào bạn! Hãy chọn ngân sách, mục đích sử dụng, hiệu năng mong muốn và thương hiệu ưu tiên. Mình sẽ gợi ý cấu hình phù hợp.
          <br /><br />
          <span className="font-semibold text-amber-600">Lưu ý:</span> Các thành phần AI gợi ý chưa bao gồm các thiết bị ngoại vi như màn hình, bàn phím, chuột, tai nghe, webcam, loa, v.v...
        </>
      ),
    },
  ]);

  const [budget, setBudget] = useState('');
  const [usage, setUsage] = useState('');
  const [performance, setPerformance] = useState([]);
  const [brand, setBrand] = useState('no-pref');
  const [isLoading, setIsLoading] = useState(false);

  const togglePerformance = (id) => {
    setPerformance((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getLabel = (list, id) => list.find((item) => item.id === id)?.label;

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
      const suggestion = root?.data ?? root;

      if (typeof onApplySuggestion === 'function') {
        onApplySuggestion(suggestion);
      }

    } catch (error) {
      console.error('Failed to get AI suggestion', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="ai-builder"
      className="relative rounded-3xl border-2 border-indigo-200/60 bg-white/80 backdrop-blur-sm p-6 md:p-8 shadow-[0_0_40px_rgba(99,102,241,0.08)]"
    >
      {/* Soft glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-transparent pointer-events-none" />
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-indigo-400/10 to-transparent blur-xl -z-10" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-[0_4px_14px_rgba(99,102,241,0.4)]">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">AI PC Builder</h2>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Powered by AI — Gợi ý cấu hình theo nhu cầu
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
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
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
                  Ngân sách <span className="text-red-500">*</span>
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
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-600">
                  Mục đích sử dụng <span className="text-red-500">*</span>
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
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Performance group */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-600">
                Nhóm hiệu năng (không bắt buộc)
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
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand preference */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-600">
                Sở thích thương hiệu (không bắt buộc)
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
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-slate-400">
              Vui lòng chọn đủ <span className="font-medium text-slate-500">Ngân sách</span> và{' '}
              <span className="font-medium text-slate-500">Mục đích sử dụng</span> để AI gợi ý.
            </p>
            <button
              type="button"
              onClick={handleRecommend}
              disabled={!budget || !usage || isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              {isLoading ? 'Đang gợi ý...' : 'Gợi ý cấu hình'}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-3 text-center">
          Gợi ý chỉ mang tính tham khảo. Vui lòng kiểm tra lại khả năng tương thích trước khi mua.
        </p>
      </div>
    </section>
  );
};

export default AIBuilder;
