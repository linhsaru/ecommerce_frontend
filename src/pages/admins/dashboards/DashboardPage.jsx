import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { ArrowDownRight, ArrowUpRight, DollarSign, ShoppingCart, Users, Package, XCircle } from 'lucide-react';
import { apiService } from '../../../services';

const MONTH_LABELS_VN = ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'];

const Card = ({ title, subtitle, right, children }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
    <div className="p-6">{children}</div>
  </section>
);

const formatCurrencyVnd = (value) => {
  const num = Number(value ?? 0);
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(num);
};

const formatMonthShortLabel = (year, monthIndex) => `${MONTH_LABELS_VN[monthIndex]} ${String(year).slice(-2)}`;

const toYearMonthParam = (year, monthIndex) => {
  const mm = String(monthIndex + 1).padStart(2, '0');
  return `${year}-${mm}`;
};
const toYearParam = (year) => String(year);

const absMonthToYearMonth = (absMonth) => {
  const year = Math.floor(absMonth / 12);
  const monthIndex = ((absMonth % 12) + 12) % 12;
  return { year, monthIndex };
};

const parseYYYYMM = (value) => {
  const [y, m] = value.split('-').map((x) => Number(x));
  return { year: y, monthIndex: (m ?? 1) - 1 };
};

/** So sánh người dùng mới tháng này vs tháng trước — tránh chia cho 0 khi tháng trước = 0 */
const compareNewUsersMoM = (current, prev) => {
  const c = Number(current ?? 0);
  const p = Number(prev ?? 0);
  if (p === 0 && c === 0) return { kind: 'flat' };
  if (p === 0 && c > 0) return { kind: 'fromZero', added: c };
  const pct = ((c - p) / p) * 100;
  return { kind: 'percent', value: pct };
};

const formatPct = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const v = Number(value);
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
};

const fetchDashboardStats = async (periodType, dateParam) => {
  const { data: response } = await apiService.get('/admin/dashboard/stats', {
    params: { PeriodType: periodType, Date: dateParam },
  });

  if (response?.success === false) {
    throw new Error(response?.message || 'Failed to fetch dashboard stats');
  }
  return response?.data ?? {};
};

const DashboardPage = () => {
  const requestIdRef = useRef(0);
  const { t } = useTranslation();

  const [periodMode, setPeriodMode] = useState('month'); // 'month' | 'year'
  const [monthValue, setMonthValue] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
  });
  const [yearValue, setYearValue] = useState(() => new Date().getFullYear());

  const [monthlyStatsFetched, setMonthlyStatsFetched] = useState([]);
  const [yearStats, setYearStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const displayMonthCount = periodMode === 'month' ? 6 : 12;

  const { fetchMonths, displayMonths, selectedMonth } = useMemo(() => {
    if (periodMode === 'month') {
      const { year, monthIndex } = parseYYYYMM(monthValue);
      const endAbsMonth = year * 12 + monthIndex;
      const startAbsForDisplay = endAbsMonth - (displayMonthCount - 1);
      const startAbsForFetch = startAbsForDisplay - 1; // extra month to compute % vs previous month

      const fetched = [];
      for (let abs = startAbsForFetch; abs <= endAbsMonth; abs += 1) {
        const ym = absMonthToYearMonth(abs);
        fetched.push({
          year: ym.year,
          monthIndex: ym.monthIndex,
          label: formatMonthShortLabel(ym.year, ym.monthIndex),
          dateParam: toYearMonthParam(ym.year, ym.monthIndex),
        });
      }

      const display = fetched.slice(1); // remove extra month
      const sel = fetched[fetched.length - 1];
      return { fetchMonths: fetched, displayMonths: display, selectedMonth: sel };
    }

    // year mode
    const year = Number(yearValue);
    const startAbsForDisplay = year * 12; // Jan of selected year
    const startAbsForFetch = startAbsForDisplay - 1; // prev Dec for % calculations
    const endAbsMonth = year * 12 + 11; // Dec

    const fetched = [];
    for (let abs = startAbsForFetch; abs <= endAbsMonth; abs += 1) {
      const ym = absMonthToYearMonth(abs);
      fetched.push({
        year: ym.year,
        monthIndex: ym.monthIndex,
        label: formatMonthShortLabel(ym.year, ym.monthIndex),
        dateParam: toYearMonthParam(ym.year, ym.monthIndex),
      });
    }

    const display = fetched.slice(1); // Jan..Dec
    const sel = null; // selected month not used in year top-product section
    return { fetchMonths: fetched, displayMonths: display, selectedMonth: sel };
  }, [periodMode, monthValue, yearValue, displayMonthCount]);

  const selectedPeriodStats = useMemo(() => {
    if (periodMode === 'month') {
      return monthlyStatsFetched[monthlyStatsFetched.length - 1] ?? null;
    }
    return yearStats;
  }, [periodMode, monthlyStatsFetched, yearStats]);

  useEffect(() => {
    let mounted = true;
    const requestId = ++requestIdRef.current;

    const run = async () => {
      setLoading(true);
      setError('');
      setMonthlyStatsFetched([]);
      setYearStats(null);

      try {
        const monthResults = await Promise.all(
          fetchMonths.map((m) => fetchDashboardStats('MONTH', m.dateParam)),
        );

        if (!mounted || requestId !== requestIdRef.current) return;
        setMonthlyStatsFetched(monthResults);

        if (periodMode === 'year') {
          const yearParam = toYearParam(Number(yearValue));
          const yStats = await fetchDashboardStats('YEAR', yearParam);
          if (!mounted || requestId !== requestIdRef.current) return;
          setYearStats(yStats);
        }
      } catch (e) {
        if (!mounted || requestId !== requestIdRef.current) return;
        setError(e?.message || 'Không thể tải dữ liệu dashboard.');
      } finally {
        if (!mounted || requestId !== requestIdRef.current) return;
        setLoading(false);
      }
    };

    run().catch(() => { });
    return () => {
      mounted = false;
    };
  }, [fetchMonths, periodMode, yearValue]);

  const revenueChartData = useMemo(() => {
    // show revenue for display months only
    const displayStartIndex = monthlyStatsFetched.length - displayMonthCount; // because we fetched +1 month for % calc
    const slice = monthlyStatsFetched.slice(Math.max(0, displayStartIndex));
    return slice.map((s, idx) => ({
      name: displayMonths[idx]?.label ?? `M${idx + 1}`,
      revenue: Number(s?.revenue ?? 0),
    }));
  }, [monthlyStatsFetched, displayMonthCount, displayMonths]);

  const ordersChartData = useMemo(() => {
    const displayStartIndex = monthlyStatsFetched.length - displayMonthCount;
    const slice = monthlyStatsFetched.slice(Math.max(0, displayStartIndex));
    return slice.map((s, idx) => ({
      name: displayMonths[idx]?.label ?? `M${idx + 1}`,
      totalOrders: Number(s?.totalOrders ?? 0),
    }));
  }, [monthlyStatsFetched, displayMonthCount, displayMonths]);

  const cancellationSummary = useMemo(() => {
    const s = selectedPeriodStats ?? {};
    const cancelledOrders = Number(s?.cancelledOrders ?? 0);
    const totalOrders = Number(s?.totalOrders ?? 0);
    const cancelledRatePercent = Number(s?.cancelledRatePercent ?? 0);
    const computedRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;
    const rateToShow = Number.isFinite(cancelledRatePercent) && cancelledRatePercent !== 0 ? cancelledRatePercent : computedRate;

    return { cancelledOrders, cancelledRatePercent: rateToShow };
  }, [selectedPeriodStats]);

  const topProductSummary = useMemo(() => {
    const s = selectedPeriodStats ?? {};
    const topProduct = s?.topProduct ?? {};
    const productName = topProduct?.productName ?? '—';
    const quantitySold = Number(topProduct?.quantitySold ?? 0);
    const totalOrders = Number(s?.totalOrders ?? 0);
    const percentOfOrders = totalOrders > 0 ? (quantitySold / totalOrders) * 100 : 0;
    return { productName, quantitySold, percentOfOrders };
  }, [selectedPeriodStats]);

  const newUsersRows = useMemo(() => {
    if (!monthlyStatsFetched?.length) return [];

    // monthlyStatsFetched = displayMonths + 1 extra previous month
    // current = fetched[i+1], prev = fetched[i]
    const start = monthlyStatsFetched.length - displayMonthCount - 1;
    const fetchedForCalc = monthlyStatsFetched.slice(Math.max(0, start));

    return Array.from({ length: displayMonthCount }).map((_, idx) => {
      const current = fetchedForCalc[idx + 1] ?? {};
      const prev = fetchedForCalc[idx] ?? {};
      const users = Number(current?.newUsers ?? 0);
      const mom = compareNewUsersMoM(users, Number(prev?.newUsers ?? 0));
      return {
        label: displayMonths[idx]?.label ?? `M${idx + 1}`,
        newUsers: users,
        mom,
      };
    });
  }, [monthlyStatsFetched, displayMonthCount, displayMonths]);

  const headerSubtitle =
    periodMode === 'month'
      ? `Thống kê 6 tháng gần nhất (kết thúc vào ${monthValue}).`
      : `Thống kê theo từng tháng trong năm ${yearValue}.`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">{headerSubtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setPeriodMode('month')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${periodMode === 'month' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50'
                }`}
            >
              Tháng
            </button>
            <button
              type="button"
              onClick={() => setPeriodMode('year')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${periodMode === 'year' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50'
                }`}
            >
              Năm
            </button>
          </div>

          {periodMode === 'month' ? (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="text-sm font-semibold text-slate-700">Chọn tháng</span>
              <input
                type="month"
                value={monthValue}
                onChange={(e) => setMonthValue(e.target.value)}
                className="text-sm bg-transparent outline-none text-slate-800"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="text-sm font-semibold text-slate-700">Chọn năm</span>
              <input
                type="number"
                value={yearValue}
                min={2000}
                max={2100}
                onChange={(e) => setYearValue(Number(e.target.value))}
                className="w-28 text-sm bg-transparent outline-none text-slate-800"
              />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-slate-500">Đang tải dữ liệu dashboard...</div>
      ) : (
        <>
          {/* Revenue + Cancelled */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card
              title="Biểu đồ doanh thu"
              subtitle="Doanh thu theo tháng (đơn vị: triệu VNĐ)"
              right={
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <DollarSign className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold">{t('revenue')}</span>
                </div>
              }
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`} />
                    <Tooltip
                      formatter={(value) => `${formatCurrencyVnd(Number(value) / 1_000_000)} triệu`}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="lg:col-span-1">
              <Card
                title="Số đơn hàng bị huỷ"
                subtitle="Tổng số đơn huỷ trong kỳ đang chọn"
                right={
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span className="font-semibold">Cancelled</span>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Cancelled Orders</div>
                      <div className="text-3xl font-bold text-slate-900 mt-1">{cancellationSummary.cancelledOrders}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-500">Tỷ lệ huỷ</div>
                      <div className="text-2xl font-bold text-rose-600 mt-1">
                        {cancellationSummary.cancelledRatePercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <ShoppingCart className="w-4 h-4 text-slate-500" />
                      <span>Chỉ số hiển thị theo kỳ</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {periodMode === 'month' ? `Tháng ${monthValue}` : `Năm ${yearValue}`}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Orders + Top product */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card
                title="Biểu đồ so sánh đơn hàng"
                subtitle="Số lượng đơn hàng theo từng tháng trong kỳ hiển thị"
                right={
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShoppingCart className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold">Orders</span>
                  </div>
                }
              >
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Bar dataKey="totalOrders" fill="#22c55e" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card
                title="Sản phẩm đã bán nhiều nhất"
                subtitle={periodMode === 'month' ? `Trong tháng ${monthValue}` : `Trong năm ${yearValue}`}
                right={
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Package className="w-4 h-4 text-sky-600" />
                    <span className="font-semibold">Top Product</span>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="text-sm text-slate-500">Product</div>
                  <div className="text-lg font-bold text-slate-900">{topProductSummary.productName}</div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-3">
                      <div className="text-xs font-semibold text-slate-500">Quantity Sold</div>
                      <div className="text-xl font-bold text-slate-900 mt-1">{topProductSummary.quantitySold}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-3">
                      <div className="text-xs font-semibold text-slate-500">Tỷ lệ theo số đơn</div>
                      <div className="text-xl font-bold text-indigo-600 mt-1">{topProductSummary.percentOfOrders.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    Tỷ lệ được ước tính theo: <span className="font-semibold">quantitySold / totalOrders</span>.
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* New users */}
          <Card
            title="Danh sách người dùng mới"
            subtitle="So với tháng trước: % thay đổi, hoặc “mốc đầu” khi tháng trước chưa có người mới"
            right={
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold">New Users</span>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tháng</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Người dùng mới</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">So với tháng trước</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {newUsersRows.map((row, idx) => {
                    const { mom } = row;
                    return (
                      <tr key={`${row.label}-${idx}`} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">{row.label}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">{row.newUsers}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-right">
                          {mom.kind === 'flat' ? (
                            <span className="text-slate-400">—</span>
                          ) : mom.kind === 'fromZero' ? (
                            <span
                              className="inline-flex flex-col items-end gap-0.5 text-emerald-600"
                              title="Tháng trước: 0 người mới — không thể tính % tăng. Đây là số người đăng ký mới trong tháng."
                            >
                              <span className="inline-flex items-center justify-end gap-1">
                                <ArrowUpRight className="w-3 h-3 shrink-0" />
                                <span>
                                  +{mom.added} <span className="text-slate-500 font-medium text-xs">(mốc đầu)</span>
                                </span>
                              </span>
                            </span>
                          ) : mom.kind === 'percent' ? (
                            <span
                              className={`inline-flex items-center justify-end gap-1 ${mom.value >= 0 ? 'text-emerald-600' : 'text-rose-600'
                                }`}
                            >
                              {mom.value >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {formatPct(mom.value)}
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
