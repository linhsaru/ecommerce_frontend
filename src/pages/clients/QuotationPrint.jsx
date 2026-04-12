import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService, downloadQuotationExcel } from '../../services';
import logo from '../../assets/images/logo.png';
import ToastNotification from '../../components/common/ToastNotification/ToastNotification';
import './QuotationPrint.css';

const formatVnd = (value) => {
  const n = Math.round(Number(value) || 0);
  return new Intl.NumberFormat('vi-VN').format(n);
};

const formatDateVn = (isoOrDate) => {
  if (!isoOrDate) return '—';
  const s = String(isoOrDate);
  const d = s.length >= 10 ? new Date(s.slice(0, 10)) : new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
};

const QuotationPrint = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '', status: 'error' });

  const fetchQuotation = useCallback(async () => {
    const lines = location.state?.items;
    if (!Array.isArray(lines) || lines.length === 0) {
      setError('Không có danh sách linh kiện. Vui lòng quay lại trang Xây dựng PC và chọn linh kiện.');
      setLoading(false);
      return;
    }

    const payload = {
      items: lines.map((line) => ({
        productId: line.productId,
        variantId: line.variantId ?? null,
        quantity: Math.max(1, Number(line.quantity) || 1),
      })),
      shippingFee: 0,
      otherCosts: 0,
      discount: 0,
      customer: location.state?.customer ?? undefined,
    };

    setLoading(true);
    setError(null);
    try {
      const { data: envelope } = await apiService.post('/api/quotations/preview', payload);
      const q = envelope?.data;
      if (!q) {
        throw new Error(envelope?.message || 'Không lấy được báo giá.');
      }
      setData(q);
    } catch (e) {
      setError(e?.message || 'Lỗi khi tải báo giá.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    document.body.classList.add('quotation-print-route');
    return () => document.body.classList.remove('quotation-print-route');
  }, []);

  useEffect(() => {
    fetchQuotation();
  }, [fetchQuotation]);

  const handlePrint = () => window.print();

  const showToast = (message, status = 'error') => {
    setToastConfig({ isVisible: true, message, status });
  };

  const buildExportPayload = () => {
    const lines = location.state?.items;
    if (!Array.isArray(lines) || lines.length === 0) return null;
    const qd = data?.customer?.quotationDate;
    return {
      items: lines.map((line) => ({
        productId: line.productId,
        variantId: line.variantId ?? null,
        quantity: Math.max(1, Number(line.quantity) || 1),
      })),
      shippingFee: data?.summary?.shippingFee ?? 0,
      otherCosts: data?.summary?.otherCosts ?? 0,
      discount: data?.summary?.discount ?? 0,
      customer: location.state?.customer ?? undefined,
      quotationDate: qd != null ? String(qd).slice(0, 10) : undefined,
    };
  };

  const handleExportExcel = async () => {
    const payload = buildExportPayload();
    if (!payload) {
      showToast('Không có dữ liệu cấu hình để xuất.', 'warning');
      return;
    }
    setExportingExcel(true);
    try {
      await downloadQuotationExcel(payload);
    } catch (e) {
      showToast(e?.message || 'Xuất Excel thất bại.', 'error');
    } finally {
      setExportingExcel(false);
    }
  };

  if (loading && !error) {
    return (
      <div className="quotation-print-wrap">
        <p className="text-center text-slate-600 py-16">Đang tải báo giá…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quotation-print-wrap">
        <div className="quotation-error">{error}</div>
        <div className="quotation-print-toolbar no-print">
          <button type="button" className="secondary" onClick={() => navigate('/build-pc')}>
            Quay lại Xây dựng PC
          </button>
        </div>
      </div>
    );
  }

  const company = data?.company ?? {};
  const customer = data?.customer ?? {};
  const items = Array.isArray(data?.items) ? data.items : [];
  const summary = data?.summary ?? {};

  return (
    <div className="quotation-print-wrap">
      <div className="quotation-print-toolbar no-print">
        <button type="button" className="secondary" onClick={() => navigate('/build-pc')}>
          Quay lại
        </button>
        <button
          type="button"
          className="secondary"
          disabled={exportingExcel}
          onClick={handleExportExcel}
        >
          {exportingExcel ? 'Đang xuất file…' : 'Xuất Excel'}
        </button>
        <button type="button" onClick={handlePrint} disabled={exportingExcel}>
          In báo giá
        </button>
      </div>

      <article className="quotation-sheet">
        <header className="quotation-header">
          <div className="quotation-company-block">
            <h1 className="quotation-company-name">{company.companyName}</h1>
            <p className="quotation-company-meta">
              {company.addressLine1}
              <br />
              {company.addressLine2}
              <br />
              Hotline: {company.hotline} · Email: {company.email}
              <br />
              Website: {company.website}
            </p>
          </div>
          <div className="quotation-logo-wrap">
            <img src={logo} alt="" className="quotation-logo" />
          </div>
        </header>

        <div className="quotation-title-block">
          <h2 className="quotation-title">BÁO GIÁ CHI TIẾT</h2>
          <div className="quotation-meta-row" aria-label="Ngày báo giá và đơn vị tiền tệ">
            <span>
              <strong>Ngày báo giá:</strong> {formatDateVn(customer.quotationDate)}
            </span>
            <span>
              <strong>Đơn vị tiền tệ:</strong> VND
            </span>
          </div>
        </div>

        <section aria-label="Danh sách linh kiện">
          <div className="quotation-table-wrap">
            <table className="quotation-table">
              <thead>
                <tr>
                  <th style={{ width: '2.5rem' }}>STT</th>
                  <th>Tên sản phẩm</th>
                  <th style={{ width: '5.5rem' }}>Bảo hành</th>
                  <th style={{ width: '3rem' }}>SL</th>
                  <th style={{ width: '6.5rem' }}>Đơn giá (VND)</th>
                  <th style={{ width: '7rem' }}>Thành tiền (VND)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.lineNumber}>
                    <td className="center">{row.lineNumber}</td>
                    <td>{row.productName}</td>
                    <td className="center">{row.warranty}</td>
                    <td className="center">{row.quantity}</td>
                    <td className="num">{formatVnd(row.unitPrice)}</td>
                    <td className="num">{formatVnd(row.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-label="Tổng tiền">
          <table className="quotation-summary">
            <tbody>
              <tr>
                <td>Tạm tính</td>
                <td>{formatVnd(summary.subTotal)}</td>
              </tr>
              <tr>
                <td>Phí vận chuyển</td>
                <td>{formatVnd(summary.shippingFee)}</td>
              </tr>
              <tr>
                <td>Chi phí khác</td>
                <td>{formatVnd(summary.otherCosts)}</td>
              </tr>
              <tr>
                <td>Giảm giá</td>
                <td>{formatVnd(summary.discount)}</td>
              </tr>
              <tr>
                <td>Tổng tiền đơn hàng</td>
                <td>
                  <strong>{formatVnd(summary.orderTotal)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className="quotation-notes">
          <strong>Ghi chú:</strong> {data?.notes || 'Giá có thể thay đổi theo thời điểm đặt hàng.'}
        </div>
      </article>

      <ToastNotification
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        status={toastConfig.status}
        onClose={() => setToastConfig((p) => ({ ...p, isVisible: false }))}
      />
    </div>
  );
};

export default QuotationPrint;
