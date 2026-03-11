import React, { useState } from 'react';
import {
    HiOutlineCpuChip,
    HiOutlineComputerDesktop,
    HiOutlinePrinter,
    HiOutlineArrowDownTray,
    HiOutlineTrash,
    HiOutlinePlus,
    HiOutlineMinus,
    HiOutlineShoppingCart
} from 'react-icons/hi2';
import { AIBuilder } from '../../components/shop';
import { useTranslation } from '../../context/LanguageContext';

const categories = [
    { id: 'cpu', name: 'Vi xử lý (CPU)', icon: 'processor' },
    { id: 'mainboard', name: 'Bo mạch chủ', icon: 'motherboard' },
    { id: 'ram', name: 'RAM bộ nhớ trong', icon: 'memory' },
    { id: 'vga', name: 'VGA - Card màn hình', icon: 'graphics' },
    { id: 'ssd', name: 'Ổ cứng SSD', icon: 'ssd' },
    { id: 'hdd', name: 'Ổ cứng HDD', icon: 'hdd' },
    { id: 'psu', name: 'Nguồn máy tính', icon: 'power' },
    { id: 'case', name: 'Vỏ Case', icon: 'case' },
    { id: 'cooler', name: 'Tản nhiệt', icon: 'fan' },
    { id: 'monitor', name: 'Màn hình', icon: 'display' },
];

// Mock selected items for demonstration
const initialSelectedItems = {
    cpu: {
        id: 1,
        name: 'CPU Intel Core i9-14900K (Up To 6.0GHz, 24 Nhân 32 Luồng, 36MB Cache, Raptor Lake Refresh)',
        price: 15390000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=150&h=150&fit=crop&q=80',
        warranty: '36 Tháng',
    },
    vga: {
        id: 2,
        name: 'Card Màn Hình NVIDIA GeForce RTX 4090 24GB GDDR6X',
        price: 52990000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=150&h=150&fit=crop&q=80',
        warranty: '36 Tháng',
    }
};

const BuildPCPage = () => {
    const { t } = useTranslation();
    const [selectedItems, setSelectedItems] = useState(initialSelectedItems);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const calculateTotal = () => {
        return Object.values(selectedItems).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleUpdateQuantity = (categoryId, delta) => {
        setSelectedItems(prev => {
            const current = prev[categoryId];
            if (!current) return prev;

            const newQuantity = current.quantity + delta;
            if (newQuantity <= 0) return prev; // Don't delete on 0, use delete button

            return {
                ...prev,
                [categoryId]: {
                    ...current,
                    quantity: newQuantity
                }
            };
        });
    };

    const handleRemoveItem = (categoryId) => {
        setSelectedItems(prev => {
            const newState = { ...prev };
            delete newState[categoryId];
            return newState;
        });
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            {/* Header Banner */}
            <div className="bg-white border-b border-slate-200 sticky top-16 md:top-18 z-40 shadow-sm">
                <div className="container-custom py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                            <HiOutlineComputerDesktop className="text-blue-600 w-8 h-8" />
                            Xây Dựng Cấu Hình PC
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Chọn linh kiện để tự build một bộ máy tính hoàn hảo</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors whitespace-nowrap">
                            <HiOutlineArrowDownTray className="w-4 h-4" />
                            Tải cấu hình
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors whitespace-nowrap">
                            <HiOutlinePrinter className="w-4 h-4" />
                            In báo giá
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-red-600 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
                            onClick={() => setSelectedItems({})}
                        >
                            <HiOutlineTrash className="w-4 h-4" />
                            Làm mới
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8 space-y-8">
                {/* AI Builder Section */}
                <div>
                    <AIBuilder />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content - Parts List */}
                    <div className="lg:col-span-8 space-y-4">
                        {categories.map((cat, index) => {
                            const selectedPart = selectedItems[cat.id];

                            return (
                                <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Category Header */}
                                    <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                            {index + 1}
                                        </span>
                                        <h2 className="font-semibold text-slate-700 text-base">{cat.name}</h2>
                                    </div>

                                    {/* Part Content */}
                                    <div className="p-4 sm:p-5">
                                        {selectedPart ? (
                                            <div className="flex flex-col sm:flex-row gap-5">
                                                <div className="w-full sm:w-24 h-24 rounded-xl border border-slate-100 flex-shrink-0 overflow-hidden bg-white p-1 relative group">
                                                    <img src={selectedPart.image} alt={selectedPart.name} className="w-full h-full object-contain" />
                                                </div>

                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-medium text-slate-800 text-base leading-snug line-clamp-2 hover:text-blue-600 cursor-pointer">
                                                            {selectedPart.name}
                                                        </h3>
                                                        <div className="mt-1 text-sm text-slate-500">
                                                            Bảo hành: <span className="font-medium text-slate-700">{selectedPart.warranty}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                                        <div className="text-red-500 font-bold text-lg">
                                                            {formatCurrency(selectedPart.price)}
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            {/* Quantity Control */}
                                                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(cat.id, -1)}
                                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                                                                >
                                                                    <HiOutlineMinus className="w-3 h-3" />
                                                                </button>
                                                                <span className="w-8 text-center text-sm font-medium text-slate-700 bg-white h-8 flex items-center justify-center border-x border-slate-200">
                                                                    {selectedPart.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(cat.id, 1)}
                                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                                                                >
                                                                    <HiOutlinePlus className="w-3 h-3" />
                                                                </button>
                                                            </div>

                                                            <button
                                                                onClick={() => handleRemoveItem(cat.id)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                                title="Xóa linh kiện"
                                                            >
                                                                <HiOutlineTrash className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                                                <div className="flex items-center gap-4 text-slate-400">
                                                    <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                                                        <HiOutlineCpuChip className="w-6 h-6 opacity-50" />
                                                    </div>
                                                    <span className="text-sm">{t('please_select_component')}</span>
                                                </div>
                                                <button className="flex justify-center items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-medium transition-colors w-full sm:w-auto group">
                                                    <HiOutlinePlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                                    Chọn {cat.name.split(' ')[0]}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Sidebar - Summary (Desktop only, sticky) */}
                    <div className="hidden lg:block lg:col-span-4 relative">
                        <div className="sticky top-40 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-4 border-b border-slate-100">
                                Tóm tắt cấu hình
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Số lượng linh kiện:</span>
                                    <span className="font-semibold text-slate-800">{Object.keys(selectedItems).length}/{categories.length}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Công suất tiêu thụ ước tính:</span>
                                    <span className="font-semibold text-orange-500">
                                        {/* Fake wattage calculation */}
                                        {Object.keys(selectedItems).length > 0 ? Object.keys(selectedItems).length * 85 : 0}W
                                    </span>
                                </div>
                                <div className="h-px bg-slate-100"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-800 font-medium">Tổng tiền:</span>
                                    <span className="text-2xl font-bold text-red-500">{formatCurrency(calculateTotal())}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                    <HiOutlineShoppingCart className="w-5 h-5" />
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] p-4 pb-safe">
                <div className="container-custom flex items-center justify-between gap-4">
                    <div>
                        <div className="text-xs text-slate-500 mb-0.5">Tổng tiền ({Object.keys(selectedItems).length} SP):</div>
                        <div className="text-xl font-bold text-red-500 leading-none">{formatCurrency(calculateTotal())}</div>
                    </div>
                    <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 max-w-[200px]">
                        <HiOutlineShoppingCart className="w-5 h-5" />
                        Mua ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuildPCPage;
