import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const revenueData = [
  { name: 'T1', revenue: 120 },
  { name: 'T2', revenue: 180 },
  { name: 'T3', revenue: 150 },
  { name: 'T4', revenue: 220 },
  { name: 'T5', revenue: 260 },
  { name: 'T6', revenue: 310 },
];

const topConfigsData = [
  { name: 'Gaming High-end', count: 32 },
  { name: 'Office Basic', count: 45 },
  { name: 'Creator 4K', count: 18 },
  { name: 'AI Dev', count: 12 },
];

const AnalyticsDashboardPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500">
          Thống kê doanh thu, linh kiện bán chạy và cấu hình AI Build nhiều nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue line chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Doanh thu theo tháng (triệu VNĐ)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top AI configs bar chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Cấu hình AI Build nhiều nhất
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topConfigsData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;

