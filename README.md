# ECommerce Frontend Base

A comprehensive React-based ecommerce frontend with all essential base components, utilities, and infrastructure for building modern web applications.

## 🚀 Features

### ✅ Base API
- **Axios-based API service** with automatic JWT token attachment
- **Request/Response interceptors** for authentication and error handling
- **Token management** with automatic refresh capabilities
- **Error handling** with user-friendly messages

### ✅ Data Fetching & Caching
- **React Query (TanStack Query)** for server state management
- **Automatic caching** and background refetching
- **Optimistic updates** and error recovery
- **Custom hooks** for API operations (GET, POST, PUT, DELETE, UPLOAD)

### ✅ State Management
- **Zustand stores** for global state management
- **Auth Store**: User authentication, login/logout, token management
- **Cart Store**: Shopping cart functionality with persistence
- **UI Store**: Modals, notifications, loading states, theme management

### ✅ UI Components
- **Button**: Configurable button with loading states and variants
- **Input**: Form input with validation and error display
- **Modal**: Accessible modal dialogs with overlay
- **Loading**: Spinner component with customizable sizes
- **Pagination**: Navigation component for paginated content
- **Header**: Responsive navigation header with cart and user menu

### ✅ Business Logic Utilities
- **Price & Currency**: Formatting, discounts, tax calculations
- **Validation**: Form validation with custom rules
- **Image Optimization**: URL generation, lazy loading, compression
- **Date & Time**: Formatting, relative time, business days

### ✅ SEO & Metadata
- **Dynamic meta tags** with react-helmet-async
- **Open Graph** and Twitter Card support
- **Structured data** (JSON-LD) for products and articles
- **SEO utilities** for generating metadata from content

### ✅ Error Handling & Logging
- **React Error Boundary** for component-level error catching
- **Global error handlers** for unhandled errors and rejections
- **Error logging** with context and user information
- **User-friendly error messages** and recovery options

## 🛠 Tech Stack

- **React 19** - UI library with modern features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **React Helmet Async** - Document head management
- **Date-fns** - Modern date utility library
- **clsx** - Conditional CSS classes utility

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   ├── layout/          # Layout components
│   └── ErrorBoundary.jsx
├── hooks/               # Custom React hooks
├── pages/               # Page components (to be implemented)
├── providers/           # Context providers
├── store/               # Zustand state stores
├── utils/               # Utility functions
├── App.jsx
├── main.jsx
└── index.css
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### API Configuration

Update the base URL and other API settings in `src/services/api.js`.

### Styling

The project uses Tailwind CSS. Customize the theme in `tailwind.config.js`.

## 📖 Usage Examples

### Using the API Service

```javascript
import { apiService } from '../services';

// GET request
const products = await apiService.get('/products');

// POST request with auth
const newProduct = await apiService.post('/products', productData);

// Using React Query hooks
import { useApiQuery, useApiMutation } from '../hooks/useApi';

const { data: products, isLoading } = useApiQuery('products', '/products');
const createProduct = useApiMutation('/products');
```

### State Management

```javascript
import { useAuthStore, useCartStore } from '../store';

function MyComponent() {
  const { user, login } = useAuthStore();
  const { items, addItem } = useCartStore();

  // Use the stores...
}
```

### UI Components

```jsx
import { Button, Input, Modal } from '../components/ui';

function MyForm() {
  return (
    <form>
      <Input
        label="Email"
        type="email"
        error={errors.email}
        required
      />
      <Button type="submit" loading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
```

### Business Logic Utilities

```javascript
import { priceUtils, validationUtils, dateTimeUtils } from '../utils';

// Format price
const formattedPrice = priceUtils.formatPrice(99.99); // "$99.99"

// Validate form
const validation = validationUtils.validateForm(formData, rules);

// Format date
const relativeTime = dateTimeUtils.getRelativeTime(date); // "2 hours ago"
```

### SEO Management

```jsx
import SEO from '../components/SEO';

function ProductPage({ product }) {
  return (
    <>
      <SEO
        title={`${product.name} - Buy Online`}
        description={product.description}
        image={product.image}
        type="product"
      />
      {/* Page content */}
    </>
  );
}
```

## 🔒 Security Features

- **JWT token management** with automatic refresh
- **Secure token storage** in localStorage with expiration checks
- **Request sanitization** and error boundary protection
- **XSS protection** through React's built-in sanitization

## 🎯 Performance Optimizations

- **Code splitting** with React.lazy (ready for implementation)
- **Image optimization** utilities for responsive images
- **Caching strategies** with React Query
- **Lazy loading** for images and components
- **Bundle optimization** with Vite

## 🔄 Next Steps

With this solid foundation, you can now:

1. **Implement pages**: Create product listing, detail, cart, checkout pages
2. **Add routing**: Set up React Router with protected routes
3. **Integrate backend**: Connect to your actual API endpoints
4. **Add authentication**: Implement login/register flows
5. **Enhance UI**: Add more components as needed
6. **Add testing**: Set up unit and integration tests
7. **Deploy**: Configure CI/CD and deployment pipeline

## 📝 Contributing

1. Follow the existing code structure and naming conventions
2. Add proper TypeScript types (when migrating to TS)
3. Write comprehensive tests for new features
4. Update documentation for new components and utilities
5. Follow the established patterns for state management and API calls

## 📄 License

This project is licensed under the MIT License.