import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineBars3,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../context/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const cartItemCount = useCartStore((state) => state.itemCount);
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { nameKey: 'home', path: '/' },
    { nameKey: 'shop', path: '/products' },
    { nameKey: 'news', path: '/news' }
  ];

  return (
    <>

      {/* Main navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-soft-md border-b border-neutral-100/50'
        : 'bg-white border-b border-neutral-100'
        }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Left: Mobile menu + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <HiOutlineXMark className="w-6 h-6" />
                ) : (
                  <HiOutlineBars3 className="w-6 h-6" />
                )}
              </button>

              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-soft-sm">
                  <span className="text-white font-bold text-body-sm">S</span>
                </div>
                <span className="text-heading-md text-neutral-900 tracking-tight hidden sm:block">
                  Store<span className="text-primary-600">.</span>
                </span>
              </Link>
            </div>

            {/* Center: Nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.nameKey}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-body-sm font-medium transition-all duration-200
                    ${location.pathname === link.path
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                    }`}
                >
                  {t(link.nameKey)}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-xl text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 transition-all duration-200"
              >
                <HiOutlineMagnifyingGlass className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-xl text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 transition-all duration-200"
              >
                <HiOutlineHeart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 transition-all duration-200"
              >
                <HiOutlineShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-scale-in">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <Link
                to={user ? '/account' : '/login'}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 transition-all duration-200"
              >
                <HiOutlineUser className="w-5 h-5" />
                <span className="hidden sm:inline text-body-sm font-medium">
                  {user ? `Hello ${user.username || user.fullName || user.firstName || user.email?.split('@')[0] || ''}` : t('login')}
                </span>
              </Link>

              {/* Language Switcher */}
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className={`overflow-hidden transition-all duration-300 ease-out ${isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="container-custom pb-4">
            <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                className="input pl-12 pr-4 py-3 bg-neutral-50 border-neutral-200 rounded-2xl"
                autoFocus={isSearchOpen}
              />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="container-custom pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.nameKey}
                to={link.path}
                className={`block px-4 py-3 rounded-xl text-body-sm font-medium transition-all duration-200
                  ${location.pathname === link.path
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                  }`}
              >
                {t(link.nameKey)}
              </Link>
            ))}
            <div className="divider my-2" />
            {user ? (
              <Link to="/account" className="block px-4 py-3 rounded-xl text-body-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50">
                Hello {user.username || user.fullName || user.firstName || user.email?.split('@')[0] || t('profile')}
              </Link>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-3 rounded-xl text-body-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50">
                  {t('login')}
                </Link>
                <Link to="/register" className="block px-4 py-3 rounded-xl text-body-sm font-medium text-primary-600 hover:bg-primary-50">
                  {t('create_account')}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
