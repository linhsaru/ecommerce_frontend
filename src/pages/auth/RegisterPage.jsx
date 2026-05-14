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
      navigate('/login', {
        replace: true,
        state: { registerSuccess: 'Đăng ký thành công. Vui lòng đăng nhập.' },
      });
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
