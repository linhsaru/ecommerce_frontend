# E-commerce Frontend

Ứng dụng frontend cho cửa hàng bán linh kiện PC & công nghệ, được xây dựng bằng React + Vite.

---

## Cấu trúc thư mục dự án

```
ecommerce_frontend/
├── public/                 # Tài nguyên tĩnh
├── src/
│   ├── api/               # Cấu hình API, axios
│   │   ├── axiosConfig.js
│   │   └── demo.js
│   ├── assets/            # Hình ảnh, SVG, styles
│   ├── components/        # Các component tái sử dụng
│   │   ├── common/        # Button, Input, Select, Loader, Modal
│   │   ├── data-displays/ # Table, Filter, Pagination
│   │   ├── form/          # TextField, SelectField, CheckboxField
│   │   ├── layout/        # Navbar, Footer, Header
│   │   ├── layouts/       # MainLayout
│   │   ├── loading/       # LoadingSpinner, LoadingOverlay
│   │   ├── shop/          # ProductCard, PriceDisplay, StarRating, QuantitySelector, Sidebar, AIBuilder
│   │   ├── ui/            # Button, Input, Modal, Pagination, Popup, Tooltip
│   │   ├── widgets/       # Tooltip
│   │   ├── CouponList.jsx
│   │   ├── LanguageSwitcher.jsx
│   │   └── SEO.jsx
│   ├── configs/           # Cấu hình table, filter
│   ├── context/           # LanguageContext (đa ngôn ngữ)
│   ├── forms/             # Form rules (validation)
│   ├── hooks/             # useClickOutside, useApi
│   ├── i18n/              # Cấu hình i18next, locales (en.js, vi.js)
│   ├── logic/             # priceCalculator
│   ├── navigation/
│   │   ├── context/       # NavigationContext
│   │   └── routes/        # AppRoutes, PublicRoutes, PrivateRoutes, PublicRoute, PrivateRoute
│   ├── pages/
│   │   ├── admins/        # Dashboard, UserManagement
│   │   ├── auth/          # Login, Register
│   │   ├── clients/       # Home, ProductListing, ProductDetail, Cart, Checkout, Wishlist, Account
│   │   └── errors/        # NotFound, Unauthorized, ServerError
│   ├── providers/         # QueryProvider, providers index
│   ├── services/          # api, errorHandler, tokenManager
│   ├── store/             # Zustand stores (auth, cart, wishlist, ui)
│   ├── tests/             # Các test UI mẫu
│   ├── utils/             # authUtils, validation, price, dateTime, image, seo
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .env, .env.development
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

---

## Các thành phần (Components)

### Layout
- **Navbar** – Thanh điều hướng chính, tìm kiếm, giỏ hàng, wishlist, chuyển ngôn ngữ
- **Footer** – Chân trang
- **MainLayout** – Bố cục chính (Navbar + Outlet + Footer)

### Shop (components/shop)
- **ProductCard** – Thẻ sản phẩm (ảnh, tên, giá, đánh giá, nút thêm vào giỏ/wishlist)
- **PriceDisplay** – Hiển thị giá gốc, giá khuyến mãi
- **StarRating** – Đánh giá sao
- **QuantitySelector** – Chọn số lượng sản phẩm
- **Sidebar** – Lọc theo danh mục, thương hiệu, mục đích sử dụng, khoảng giá
- **AIBuilder** – Trợ lý AI gợi ý cấu hình PC theo ngân sách và nhu cầu
- **CouponList** – Chọn mã giảm giá khi thanh toán (components/)

### Form & Data Display
- **TextField, SelectField, CheckboxField** – Các trường form
- **Table, TableAdditional** – Bảng dữ liệu (sắp xếp, tìm kiếm, phân trang)
- **Filter, Pagination** – Lọc và phân trang

### UI chung
- **Button, Input, Modal, Popup, Tooltip** – Thành phần giao diện cơ bản
- **LoadingSpinner, LoadingOverlay** – Trạng thái tải
- **LanguageSwitcher** – Chuyển đổi ngôn ngữ (vi/en)
- **SEO** – Cấu hình meta cho SEO

### Routes (navigation/routes)
- **PublicRoute** – Trang công khai
- **PrivateRoute** – Trang yêu cầu đăng nhập/phân quyền

---

## Các chức năng

### Khách hàng
- **Trang chủ** – Hero slider, sản phẩm nổi bật, sản phẩm mới, khuyến mãi
- **Danh sách sản phẩm** – Grid sản phẩm, lọc (danh mục, thương hiệu, giá, mục đích sử dụng)
- **Chi tiết sản phẩm** – Thông tin sản phẩm, chọn số lượng, thêm giỏ/wishlist
- **Giỏ hàng** – Xem, sửa số lượng, xóa sản phẩm
- **Thanh toán** – Tổng tiền, áp dụng coupon, phí vận chuyển
- **Wishlist** – Danh sách yêu thích
- **Tài khoản** – Thông tin cá nhân (account tabs)

### Xác thực
- **Đăng nhập** – Email, mật khẩu
- **Đăng ký** – Tạo tài khoản mới

### Admin
- **Dashboard** – Bảng điều khiển tổng quan
- **Quản lý người dùng** – UserManagementPage

### Khác
- **Đa ngôn ngữ** – Tiếng Việt (mặc định) và Tiếng Anh
- **AI PC Builder** – Gợi ý cấu hình PC theo ngân sách và nhu cầu
- **Coupon** – Áp dụng mã giảm giá (giảm %, giảm cố định, min order value)

---

## Kỹ thuật sử dụng

| Công nghệ | Mục đích |
|-----------|----------|
| **React 18** | UI framework |
| **Vite 5** | Build tool, dev server |
| **React Router v6** | Điều hướng SPA |
| **Zustand** | State management (auth, cart, wishlist, ui) |
| **Tailwind CSS** | Styling |
| **Lucide React, React Icons** | Icons |
| **React Hook Form** | Quản lý form |
| **Axios** | Gọi API HTTP |
| **JWT Decode** | Xử lý JWT |
| **Lodash Debounce** | Debounce input/search |
| **env-cmd** | Quản lý biến môi trường |

---

## Chức năng nổi bật

1. **Đa ngôn ngữ (i18n)**  
   Hỗ trợ Tiếng Việt và Tiếng Anh, lưu lựa chọn vào `localStorage`.

2. **AI PC Builder**  
   Chatbot gợi ý linh kiện PC theo ngân sách và nhu cầu (gaming, AI, đồ họa).

3. **Hệ thống coupon**  
   Mã giảm % hoặc cố định, giới hạn sử dụng, giá đơn hàng tối thiểu.

4. **Tính giá tự động**  
   `priceCalculator.js` tính subtotal, discount, shipping, total (hỗ trợ VND).

5. **State lưu trữ**  
   Giỏ hàng và wishlist được lưu vào `localStorage` qua Zustand persist.

6. **Phân quyền**  
   Private routes với kiểm tra vai trò (ADMIN, USER).

7. **Responsive**  
   Thiết kế responsive cho mobile, tablet, desktop.

8. **Lazy loading**  
   Sử dụng `React.lazy` và `Suspense` cho các trang và route.

---

## Hướng dẫn sử dụng

### Yêu cầu
- Node.js 18+
- npm hoặc yarn

### Cài đặt
```bash
# Clone và vào thư mục dự án
cd ecommerce_frontend

# Cài đặt dependencies
npm install
```

### Biến môi trường
Tạo file `.env` hoặc `.env.development` (xem `.env.example` nếu có) và cấu hình các biến cần thiết (API URL, keys, …).

### Chạy ứng dụng
```bash
# Chạy development (dùng .env.development)
npm run dev

# Chạy với .env mặc định
npm start

# Build production
npm run build

# Preview build
npm run preview
```

### Scripts khác
```bash
# Lint code
npm run lint

# Format & fix
npm run format:fix
```

### Routes chính
| Path | Mô tả |
|------|-------|
| `/` | Trang chủ |
| `/products` | Danh sách sản phẩm |
| `/products/:slug` | Chi tiết sản phẩm |
| `/cart` | Giỏ hàng |
| `/checkout` | Thanh toán |
| `/wishlist` | Danh sách yêu thích |
| `/account` | Tài khoản |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/app` | Admin Dashboard (cần ADMIN) |
| `/users` | Quản lý người dùng (cần ADMIN/USER) |

---

## Cấu hình Tailwind

Dự án dùng bộ màu tùy chỉnh: `primary`, `accent`, `neutral`, `success`, `danger`. Font chính: **Inter**. Có sẵn animation như `fade-in`, `fade-in-up`, `shimmer`, `float` trong `tailwind.config.js`.

---

*README được tạo cho dự án E-commerce Frontend - Học kỳ 8*
