import React, { useEffect, useMemo, useState } from 'react';
import { Search, Users, RefreshCw } from 'lucide-react';
import { apiService } from '../../../services';

const getStatusLabel = (status) => {
  const s = status == null ? null : Number(status);
  if (s === null || Number.isNaN(s)) return status ?? '—';
  if (s === 1) return 'Đang hoạt động';
  if (s === 0) return 'Bị khóa';
  return String(status);
};

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data: response } = await apiService.get('/users');
      const items = response?.data?.items ?? response?.items ?? [];
      setUsers(Array.isArray(items) ? items : []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Không thể tải danh sách người dùng.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return users;

    return users.filter((u) => {
      const fields = [
        u?.fullName,
        u?.username,
        u?.email,
        u?.phone,
        u?.roleName,
        u?.id,
      ];
      return fields.some((f) => (f ? String(f).toLowerCase().includes(keyword) : false));
    });
  }, [users, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Danh sách người dùng</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý tài khoản, vai trò và trạng thái người dùng.</p>
        </div>
        <button
          onClick={() => fetchUsers().catch(() => {})}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, username, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Đang tải danh sách người dùng...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có dữ liệu</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Không tìm thấy người dùng nào phù hợp với từ khóa hiện tại.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Người dùng</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Email / SĐT</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Vai trò</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Trạng thái</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Lần đăng nhập</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || u.username || 'User')}&background=4F46E5&color=fff`
                          }
                          alt={u.fullName || u.username || 'User'}
                          className="w-9 h-9 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{u.fullName || '—'}</p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{u.username || u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">{u.email || '—'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{u.phone || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700">{u.roleName || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {getStatusLabel(u.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString('vi-VN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
