import { Link } from 'react-router-dom';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
} from 'react-icons/hi2';

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: 'All Products', path: '/products' },
      { name: 'New Arrivals', path: '/products?filter=new' },
      { name: 'Best Sellers', path: '/products?filter=bestseller' },
      { name: 'Deals & Offers', path: '/products?filter=deals' },
      { name: 'Gift Cards', path: '/gift-cards' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Shipping Info', path: '/shipping' },
      { name: 'Returns & Exchanges', path: '/returns' },
      { name: 'Order Tracking', path: '/tracking' },
      { name: 'Contact Us', path: '/contact' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Blog', path: '/blog' },
      { name: 'Sustainability', path: '/sustainability' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
    ],
  };

  return (
    <footer className="bg-white border-t border-neutral-100">
      {/* Newsletter section */}
      <div className="border-b border-neutral-100">
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-display-sm text-neutral-900 mb-2">Stay in the loop</h3>
            <p className="text-body-md text-neutral-500 mb-6">
              Subscribe to our newsletter for exclusive deals, new arrivals, and style inspiration.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input flex-1"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-body-sm">S</span>
              </div>
              <span className="text-heading-md text-neutral-900 tracking-tight">
                Store<span className="text-primary-600">.</span>
              </span>
            </Link>
            <p className="text-body-sm text-neutral-500 mb-4">
              Premium products, exceptional quality. Your one-stop destination for modern living.
            </p>
            <div className="space-y-2">
              <a href="mailto:hello@store.com" className="flex items-center gap-2 text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                <HiOutlineEnvelope className="w-4 h-4" />
                hello@store.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                <HiOutlinePhone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
              <p className="flex items-center gap-2 text-body-sm text-neutral-500">
                <HiOutlineMapPin className="w-4 h-4" />
                New York, NY 10001
              </p>
            </div>
          </div>

          {/* Shop - PC Components */}
          <div>
            <h4 className="text-body-sm font-semibold text-neutral-900 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-body-sm font-semibold text-neutral-900 mb-4">Support</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-body-sm font-semibold text-neutral-900 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-body-sm font-semibold text-neutral-900 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-100">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-caption text-neutral-400">
            © 2024 Store. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-caption text-neutral-400">
              <span>We accept:</span>
              <div className="flex items-center gap-1.5">
                {['Visa', 'MC', 'Amex', 'PayPal'].map((method) => (
                  <span key={method} className="px-2 py-0.5 bg-neutral-100 rounded text-[10px] font-medium text-neutral-500">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
