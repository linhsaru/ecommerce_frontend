import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../context/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const cartItemCount = useCartStore((state) => state.itemCount);
  const wishlistItems = useWishlistStore((state) => state.items);

  const displayName =
    user?.username || '';

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
    { nameKey: 'buildpc', path: '/build-pc' },
    { nameKey: 'about', path: '/about' },
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
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-soft-sm bg-white overflow-hidden p-0.5">
                  <img src={logo} alt="LH Computer Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-heading-md text-neutral-900 tracking-tight hidden sm:block">
                  LH Computer<span className="text-primary-600">.</span>
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
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 px-2 py-2 rounded-xl text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-white border-2 border-primary-200 flex items-center justify-center overflow-hidden shadow-sm ring-2 ring-transparent hover:ring-primary-100 transition-all">
                      <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || displayName || 'User')}&background=eff6ff&color=2563eb&bold=true`} className="w-full h-full object-cover" alt="avatar" />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-neutral-100 py-2 z-50 animate-fade-in-up origin-top-right">
                      <div className="px-4 py-3 border-b border-neutral-100 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-white border-2 border-primary-200 shadow-sm flex flex-shrink-0 items-center justify-center overflow-hidden">
                            <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || displayName || 'User')}&background=eff6ff&color=2563eb&bold=true`} className="w-full h-full object-cover" alt="avatar" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold text-neutral-900 truncate">{user.fullName || displayName}</span>
                            {user.email && <span className="text-xs text-neutral-500 truncate">{user.email}</span>}
                          </div>
                        </div>
                      </div>

                      <Link to="/account/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        <HiOutlineShoppingBag className="w-5 h-5" />
                        {t('my_orders')}
                      </Link>

                      <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        <div className="relative">
                          <HiOutlineHeart className="w-5 h-5" />
                          {wishlistItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-danger-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                              {wishlistItems.length}
                            </span>
                          )}
                        </div>
                        {t('wishlist_title')}
                      </Link>

                      <div className="border-t border-neutral-100 my-2"></div>

                      <button onClick={() => { setIsProfileDropdownOpen(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors">
                        <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                        {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 transition-all duration-200"
                >
                  <HiOutlineUser className="w-5 h-5" />
                  <span className="hidden sm:inline text-body-sm font-medium">
                    {t('login')}
                  </span>
                </Link>
              )}

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
              <>
                <div className="px-4 py-3 mb-2 flex items-center gap-3 bg-neutral-50 rounded-xl">
                  <div className="w-11 h-11 rounded-full bg-white border-2 border-primary-200 shadow-sm flex flex-shrink-0 items-center justify-center overflow-hidden">
                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || displayName || 'User')}&background=eff6ff&color=2563eb&bold=true`} className="w-full h-full object-cover" alt="avatar" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-neutral-900 truncate">{user.fullName || displayName}</span>
                    {user.email && <span className="text-xs text-neutral-500 truncate">{user.email}</span>}
                  </div>
                </div>
                <Link
                  to="/account/orders"
                  className="block px-4 py-3 rounded-xl text-body-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <HiOutlineShoppingBag className="w-5 h-5" />
                    {t('my_orders')}
                  </div>
                </Link>
                <Link
                  to="/wishlist"
                  className="block px-4 py-3 rounded-xl text-body-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <HiOutlineHeart className="w-5 h-5" />
                      {wishlistItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-danger-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                          {wishlistItems.length}
                        </span>
                      )}
                    </div>
                    {t('wishlist_title')}
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                  className="mt-1 w-full text-left px-4 py-3 rounded-xl text-body-sm font-medium text-danger-600 hover:bg-danger-50 flex items-center gap-3"
                >
                  <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                  {t('logout')}
                </button>
              </>
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

export default Header;
