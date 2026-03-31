import { Link } from 'react-router-dom';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
} from 'react-icons/hi2';
import { useTranslation } from '../../context/LanguageContext';
import logo from '../../assets/images/logo.png';

const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = {
    shop: [
      { nameKey: 'footer_all_products', path: '/products' },
      { nameKey: 'footer_new_arrivals', path: '/products?filter=new' },
      { nameKey: 'footer_best_sellers', path: '/products?filter=bestseller' },
      { nameKey: 'footer_deals', path: '/products?filter=deals' },
      { nameKey: 'footer_gift_cards', path: '/gift-cards' },
    ],
    support: [
      { nameKey: 'footer_help_center', path: '/' },
      { nameKey: 'footer_shipping_info', path: '/' },
      { nameKey: 'footer_returns', path: '/' },
      { nameKey: 'footer_order_tracking', path: '/order-lookup' },
      { nameKey: 'footer_contact', path: '/' },
    ],
    company: [
      { nameKey: 'footer_about', path: '/' },
      { nameKey: 'footer_careers', path: '/' },
      { nameKey: 'footer_press', path: '/' },
      { nameKey: 'footer_blog', path: '/' },
      { nameKey: 'footer_sustainability', path: '/' },
    ],
    legal: [
      { nameKey: 'footer_privacy', path: '/' },
      { nameKey: 'footer_terms', path: '/' },
      { nameKey: 'footer_cookie', path: '/' },
    ],
  };

  return (
    <footer className="bg-white border-t border-neutral-100">
      {/* Newsletter section */}
      <div className="border-b border-neutral-100">
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-display-sm text-neutral-900 mb-2">{t('footer_stay_in_loop')}</h3>
            <p className="text-body-md text-neutral-500 mb-6">
              {t('footer_newsletter_desc')}
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('footer_email_placeholder')}
                className="input flex-1"
              />
              <button className="btn-primary whitespace-nowrap">
                {t('footer_subscribe')}
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
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-soft-sm bg-white overflow-hidden p-0.5">
                <img src={logo} alt="LH Computer Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-heading-md text-neutral-900 tracking-tight">
                LH Computer<span className="text-primary-600">.</span>
              </span>
            </Link>
            <p className="text-body-sm text-neutral-500 mb-4">
              {t('footer_tagline')}
            </p>
            <div className="space-y-2">
              <a href="mailto:hello@lhcomputer.vn" className="flex items-center gap-2 text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                <HiOutlineEnvelope className="w-4 h-4" />
                lhcomputer.work@gmail.com
              </a>
              <a href="tel:+84981372813" className="flex items-center gap-2 text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                <HiOutlinePhone className="w-4 h-4" />
                +84 981 372 813
              </a>
              <p className="flex items-center gap-2 text-body-sm text-neutral-500">
                <HiOutlineMapPin className="w-4 h-4" />
                Xóm Châu Nhân 2, Xã Lam Thành, Tỉnh Nghệ An
              </p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-body-sm font-semibold text-neutral-900 mb-4">{t('footer_shop')}</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.nameKey}>
                  <Link to={link.path} className="text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-body-sm font-semibold text-neutral-900 mb-4">{t('footer_support')}</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.nameKey}>
                  <Link to={link.path} className="text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-body-sm font-semibold text-neutral-900 mb-4">{t('footer_company')}</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.nameKey}>
                  <Link to={link.path} className="text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-body-sm font-semibold text-neutral-900 mb-4">{t('footer_legal')}</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.nameKey}>
                  <Link to={link.path} className="text-body-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {t(link.nameKey)}
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
            {t('footer_copyright')}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-caption text-neutral-400">
              <span>{t('footer_we_accept')}</span>
              <div className="flex items-center gap-1.5">
                {['Visa', 'MC', 'Amex', 'VNPay'].map((method) => (
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
