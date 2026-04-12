import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa bản ghi này không? Hành động này không thể hoàn tác."
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose(); // Only close on success
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra. Hãy thử lại.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset error when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={isDeleting ? undefined : onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-md overflow-hidden z-50">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            </div>
          </div>

          <div className="pl-16">
            <p className="text-sm text-slate-600 mb-2">
              {message}
            </p>
            {error && (
              <div className="text-sm text-rose-600 mt-2 bg-rose-50 p-3 rounded-xl border border-rose-100">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Xóa
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
