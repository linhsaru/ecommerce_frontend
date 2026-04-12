const getBaseUrl = () => import.meta.env.VITE_API_URL || 'https://localhost:7086';

export async function downloadQuotationExcel(payload) {
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null;

  const res = await fetch(`${baseUrl}/api/quotations/export-excel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const blob = await res.blob();

  if (!res.ok) {
    let message = res.statusText || 'Không xuất được file.';
    try {
      const text = await blob.text();
      const json = JSON.parse(text);
      message = json?.message || json?.errors?.[0]?.message || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const text = await blob.text();
    const json = JSON.parse(text);
    throw new Error(json?.message || 'Không xuất được file.');
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Bao_Gia_PC.xlsx';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
