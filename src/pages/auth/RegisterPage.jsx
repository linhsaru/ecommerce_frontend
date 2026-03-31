import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineUser,
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import ToastNotification from '../../components/common/ToastNotification/ToastNotification';
import logo from '../../assets/images/logo.png';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '', status: 'info' });
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'userName') {
      setFormData((prev) => ({ ...prev, userName: value.trim() }));
    }
  };

  const showToast = (message, status = 'info') => {
    setToastConfig({ isVisible: true, message, status });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastConfig((prev) => ({ ...prev, isVisible: false }));
    const payload = {
      fullName: formData.fullName.trim(),
      userName: formData.userName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    if (!payload.fullName) {
      showToast('Vui lòng nhập họ và tên.', 'warning');
      return;
    }

    if (!payload.userName) {
      showToast('Vui lòng nhập username.', 'warning');
      return;
    }

    if (!/^[a-zA-Z0-9._]{3,30}$/.test(payload.userName)) {
      showToast('Username phải từ 3-30 ký tự và chỉ gồm chữ, số, dấu chấm, dấu gạch dưới.', 'warning');
      return;
    }

    if (!/^(0|\+84)\d{9}$/.test(payload.phoneNumber)) {
      showToast('Số điện thoại không hợp lệ.', 'warning');
      return;
    }

    if (payload.password.length < 8) {
      showToast('Mật khẩu phải có ít nhất 8 ký tự.', 'warning');
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      showToast(t('passwords_dont_match'), 'warning');
      return;
    }

    try {
      await register(payload);
      navigate('/');
    } catch (err) {
      console.error(err);
      showToast('Đăng ký thất bại: ' + (err?.message || err), 'error');
    }
  };

  // Password strength
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, textKey: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { level: 0, textKey: '', color: '' },
      { level: 1, textKey: 'weak', color: 'bg-danger-500' },
      { level: 2, textKey: 'fair', color: 'bg-accent-500' },
      { level: 3, textKey: 'good', color: 'bg-primary-500' },
      { level: 4, textKey: 'strong', color: 'bg-success-500' },
    ];
    return levels[score];
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
          <h1 className="text-display-sm text-neutral-900 mb-2">{t('create_an_account')}</h1>
          <p className="text-body-md text-neutral-500">{t('join_and_shop')}</p>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <ToastNotification
            message={toastConfig.message}
            status={toastConfig.status}
            isVisible={toastConfig.isVisible}
            onClose={() => setToastConfig((prev) => ({ ...prev, isVisible: false }))}
          />
          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button className="btn-secondary w-full justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t('sign_up_with_google')}
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-caption">
              <span className="bg-white px-3 text-neutral-500">{t('or_sign_up_with_email')}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_full_name')}</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Nguyen Dinh Linh"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_username')}</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="input pl-10"
                  placeholder="linhdeptrai"
                  required
                />
              </div>
            </div>

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
              <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_phone')}</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  pattern="^(0|\+84)\d{9}$"
                  className="input pl-10"
                  placeholder="0912892178"
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
                  placeholder="Min. 8 characters"
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
              {/* Password strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${level <= passwordStrength.level ? passwordStrength.color : 'bg-neutral-200'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-caption text-neutral-500">{passwordStrength.textKey ? t(passwordStrength.textKey) : ''}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('confirm_password')}</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-caption text-danger-500 mt-1">{t('passwords_dont_match')}</p>
              )}
            </div>

            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 mt-0.5"
              />
              <span className="text-body-sm text-neutral-600">
                {t('agree_terms')}{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">{t('terms_of_service')}</Link>
                {' '}{t('and')}{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">{t('privacy_policy')}</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreeTerms || isLoading}
              className="btn-primary btn-lg w-full mt-2 disabled:opacity-50"
            >
              {isLoading ? 'Wait...' : t('create_account_button')}
            </button>
          </form>
        </div>

        {/* Sign in link */}
        <p className="text-center text-body-sm text-neutral-500 mt-6">
          {t('already_have_account')}{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            {t('sign_in')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
