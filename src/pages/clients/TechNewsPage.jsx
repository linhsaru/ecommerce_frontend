import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const newsData = [
    {
        id: 1,
        title: "NVIDIA ra mắt card đồ họa RTX 5090 với hiệu năng khủng",
        excerpt: "Dòng card mới hứa hẹn mang lại sức mạnh vượt trội cho game thủ và các nhà làm AI với băng thông cực cao.",
        category: "Hardware",
        date: "11/03/2026",
        thumbnail: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=250"
    },
    {
        id: 2,
        title: "Microsoft phát hành bản cập nhật .NET 10 Preview 1",
        excerpt: "Bản cập nhật mới tập trung cải thiện hiệu năng và hỗ trợ tốt hơn cho các ứng dụng cloud-native đa nền tảng.",
        category: "Software",
        date: "10/03/2026",
        thumbnail: "https://images.unsplash.com/photo-1662035978187-db6485863c0c?auto=format&fit=crop&q=80&w=400&h=250"
    },
    {
        id: 3,
        title: "React 19 chính thức ra mắt với nhiều tính năng đột phá",
        excerpt: "Compiler mới giúp loại bỏ hoàn toàn memo và useMemo, tối ưu hóa quá trình render tự động mà không cần can thiệp.",
        category: "Framework",
        date: "09/03/2026",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400&h=250"
    },
    {
        id: 4,
        title: "OpenAI giới thiệu mô hình ngôn ngữ thế hệ tiếp theo",
        excerpt: "Mô hình mới có khả năng suy luận logic vượt bậc và hỗ trợ tạo video trực tiếp với độ trễ tối thiểu.",
        category: "AI",
        date: "08/03/2026",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400&h=250"
    },
    {
        id: 5,
        title: "AMD trình làng chip Ryzen thế hệ 9000",
        excerpt: "Sự cạnh tranh khốc liệt trên thị trường CPU khi AMD tiếp tục vượt mặt đối thủ về hiệu năng tiêu thụ điện.",
        category: "Hardware",
        date: "07/03/2026",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=250"
    },
    {
        id: 6,
        title: "Công cụ lập trình AI mới thống trị thị trường",
        excerpt: "Assistant AI mới có thể tự động viết toàn bộ tính năng và debug lỗi phức tạp chỉ trong vài giây.",
        category: "AI",
        date: "06/03/2026",
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400&h=250"
    }
];

const categories = ["Tất cả", "Hardware", "Software", "Framework", "AI"];

const TechNewsPage = () => {
    const [activeCategory, setActiveCategory] = useState("Tất cả");

    const filteredNews = activeCategory === "Tất cả"
        ? newsData
        : newsData.filter(item => item.category === activeCategory);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-slate-800">Tin Tức Công Nghệ</h2>

                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveCategory(category)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredNews.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-100 cursor-pointer flex flex-col h-full"
                    >
                        {/* Thumbnail */}
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                    {item.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center text-slate-500 text-sm mb-3">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{item.date}</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {item.title}
                            </h3>

                            <p className="text-slate-600 text-sm line-clamp-3 mb-5 flex-grow">
                                {item.excerpt}
                            </p>

                            <div className="mt-auto pt-4 border-t border-slate-50">
                                <span className="text-blue-600 font-semibold text-sm hover:underline inline-flex items-center group-hover:translate-x-1 transition-transform">
                                    Đọc tiếp
                                    <span className="ml-1">→</span>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredNews.length === 0 && (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 text-lg">Không tìm thấy bài viết nào trong danh mục này.</p>
                </div>
            )}
        </div>
    );
};

export default TechNewsPage;
