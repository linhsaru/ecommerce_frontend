import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import ToastNotification from '../../components/common/ToastNotification/ToastNotification';
import logo from '../../assets/images/logo.png';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Nếu đã đăng nhập thì không cho vào trang login, tự redirect về home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setShowToast(false);
    try {
      const payload = await login({ email: formData.email, password: formData.password });

      const role = payload?.role || '';
      if (role === 'RoleAdmin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please try again.');
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-soft-sm bg-white overflow-hidden p-0.5">
              <img src={logo} alt="LH Computer Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-heading-lg text-neutral-900 tracking-tight">
              LH Computer<span className="text-primary-600">.</span>
            </span>
          </Link>
          <h1 className="text-display-sm text-neutral-900 mb-2">{t('welcome_back')}</h1>
          <p className="text-body-md text-neutral-500">{t('sign_in_to_continue')}</p>
        </div>

        {/* Sign In Form Card */}
        <div className="card p-8 relative">
          <ToastNotification
            message={loginError}
            status="error"
            isVisible={showToast}
            onClose={() => setShowToast(false)}
          />



          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('email')}</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('password')}</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <HiOutlineEyeSlash className="w-4.5 h-4.5" /> : <HiOutlineEye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-body-sm text-neutral-600">{t('remember_me')}</span>
              </label>
              <Link to="/forgot-password" className="text-body-sm text-primary-600 hover:text-primary-700 font-medium">
                {t('forgot_password')}
              </Link>
            </div>

            <button type="submit" className="btn-primary btn-lg w-full mt-2" disabled={isLoading}>
              {isLoading ? 'Wait...' : t('sign_in_button')}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <p className="text-center text-body-sm text-neutral-500 mt-6">
          {t('dont_have_account')}{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
            {t('create_one')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
