import { useState, useEffect, useCallback } from 'react';
import ToastNotification from '../../components/common/ToastNotification/ToastNotification';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services';
import { orderApi } from '../../api/orderApi';
import { formatVnd } from '../../utils/price';
import { useTranslation } from '../../context/LanguageContext';
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineCog6Tooth,
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronRight,
  HiOutlinePencil,
  HiOutlineCamera,
} from 'react-icons/hi2';

// OrderStatus enum: pending=0, confirmed=1, processing=2, shipping=3, completed=4, cancelled=5, refunded=6
const ORDER_STATUS = {
  0: { label: 'Chờ xác nhận', badge: 'accent' },   // pending
  1: { label: 'Đã xác nhận', badge: 'primary' },   // confirmed
  2: { label: 'Đang xử lý', badge: 'primary' },   // processing
  3: { label: 'Đang giao', badge: 'primary' },       // shipping
  4: { label: 'Hoàn thành', badge: 'success' },   // completed
  5: { label: 'Đã hủy', badge: 'danger' },    // cancelled
  6: { label: 'Đã hoàn tiền', badge: 'accent' },   // refunded
};

// PaymentStatus enum: unpaid=0, paid=1, failed=2, refunded=3, partially_refunded=4
const PAYMENT_STATUS = {
  0: { label: 'Chưa thanh toán', badge: 'accent' },  // unpaid
  1: { label: 'Đã thanh toán', badge: 'success' },  // paid
  2: { label: 'Thanh toán thất bại', badge: 'danger' },   // failed
  3: { label: 'Đã hoàn tiền', badge: 'accent' },  // refunded
  4: { label: 'Hoàn tiền một phần', badge: 'primary' },  // partially_refunded
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

const normalizeAddress = (address) => ({
  id: address?.id || Date.now(),
  label: address?.label || address?.type || 'Address',
  line1: address?.line1 || address?.addressLine1 || address?.address_line1 || '',
  line2: address?.line2 || address?.addressLine2 || address?.address_line2 || '',
  ward: address?.ward || '',
  province: address?.province || '',
  country: address?.country || 'Vietnam',
  postalCode: address?.postalCode || address?.postal_code || '',
  phone: address?.phone || '',
  recipient: address?.recipient || '',
  isDefault: Boolean(address?.isDefault || address?.is_default),
});

const normalizeOrder = (order) => {
  const statusNum = Number(order?.status ?? 0);
  const paymentNum = Number(order?.paymentStatus ?? 0);
  const statusMeta = ORDER_STATUS[statusNum] ?? { label: String(statusNum), badge: 'accent' };
  const paymentMeta = PAYMENT_STATUS[paymentNum] ?? { label: String(paymentNum), badge: 'accent' };

  const orderItems = toArray(order?.items).map((item) => ({
    id: item?.variantId || item?.productId || Math.random(),
    name: item?.name || 'Sản phẩm',
    variantName: item?.variantName || '',
    sku: item?.sku || '',
    quantity: Number(item?.quantity) || 1,
    unitPrice: Number(item?.unitPrice || 0),
    lineTotal: Number(item?.lineTotal || 0),
  }));

  return {
    id: order?.orderNo || order?.orderId || 'N/A',
    orderId: order?.orderId,
    date: new Date(order?.createdAt || Date.now()).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }),
    status: statusMeta.label,
    statusColor: statusMeta.badge,
    paymentStatus: paymentMeta.label,
    paymentStatusColor: paymentMeta.badge,
    total: Number(order?.totalAmount || 0),
    shipping: {
      recipient: order?.shipRecipient || '',
      phone: order?.shipPhone || '',
      address: [order?.shipLine1, order?.shipWard, order?.shipProvince]
        .filter(Boolean).join(', '),
    },
    items: orderItems,
  };
};

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { tab } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tabs = [
    { id: 'profile', nameKey: 'account_profile_tab', icon: HiOutlineUser },
    { id: 'orders', nameKey: 'account_orders_tab', icon: HiOutlineShoppingBag },
    { id: 'addresses', nameKey: 'account_addresses_tab', icon: HiOutlineMapPin },
    { id: 'payment', nameKey: 'account_payment_tab', icon: HiOutlineCreditCard },
    { id: 'settings', nameKey: 'account_settings_tab', icon: HiOutlineCog6Tooth },
  ];

  const { user: authUser, logout, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    bio: '',
  });
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    recipient: '',
    phone: '',
    line1: '',
    line2: '',
    ward: '',
    province: '',
    country: 'Vietnam',
  });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', status: 'info' });
  const showToast = useCallback((message, status = 'info') => {
    setToast({ visible: true, message, status });
  }, []);
  const validTabIds = tabs.map((item) => item.id);

  useEffect(() => {
    if (!tab) return;
    if (validTabIds.includes(tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser?.id) return;
      try {
        const { data: res } = await apiService.get(`/users/${authUser.id}`);
        const data = res?.data ?? res;
        const mappedAddresses = toArray(data?.addresses || data?.userAddresses).map(normalizeAddress);
        const fallbackAddress = data?.addressLine1 || data?.line1 || data?.address_line1
          ? [normalizeAddress({
            id: 'profile-default',
            label: 'Default',
            line1: data?.addressLine1 || data?.line1 || data?.address_line1,
            line2: data?.addressLine2 || data?.line2 || data?.address_line2,
            ward: data?.ward,
            province: data?.province,
            country: data?.country || 'Vietnam',
            postalCode: data?.postalCode || data?.postal_code,
            phone: data?.phone,
            recipient: data?.fullName || data?.username,
            isDefault: true,
          })]
          : [];
        const allAddresses = mappedAddresses.length ? mappedAddresses : fallbackAddress;
        const defaultAddress = allAddresses.find((a) => a.isDefault) || allAddresses[0];

        setProfile({
          raw: data,
          name: data.fullName || data.username,
          username: data.username,
          email: data.email,
          phone: data.phone,
          bio: data.bio || '',
          avatar: data.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.fullName || data.username || 'User'),
          memberSince: new Date(data.createdAt).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
        });
        setProfileForm({
          name: data.fullName || data.username || '',
          phone: data.phone || '',
          bio: data.bio || '',
        });
        setAddresses(allAddresses);
        setAddressForm({
          label: defaultAddress?.label || 'Home',
          recipient: defaultAddress?.recipient || data.fullName || data.username || '',
          phone: defaultAddress?.phone || data.phone || '',
          line1: defaultAddress?.line1 || '',
          line2: defaultAddress?.line2 || '',
          ward: defaultAddress?.ward || '',
          province: defaultAddress?.province || '',
          country: defaultAddress?.country || 'Vietnam',
        });
      } catch (error) {
        console.error('Failed to fetch profile', error);
        showToast('Không tải được thông tin tài khoản.', 'error');
      }
    };
    fetchProfile();
  }, [authUser]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!authUser?.id) return;
      setIsLoadingOrders(true);
      try {
        const response = await orderApi.getMyOrders();
        const payload = response?.data?.data ?? response?.data ?? response;
        const mappedOrders = toArray(payload).map(normalizeOrder);
        setOrders(mappedOrders);
      } catch (error) {
        console.error('Failed to fetch my orders', error);
        showToast('Không tải được danh sách đơn hàng.', 'error');
      } finally {
        setIsLoadingOrders(false);
      }
    };
    fetchMyOrders();
  }, [authUser?.id]);

  const buildUserPayload = (profileValues, addressValues) => {
    const raw = profile?.raw || {};
    return {
      username: raw.username,
      email: raw.email,
      fullName: profileValues.name?.trim() || raw.fullName || raw.username,
      phone: profileValues.phone?.trim() || raw.phone || '',
      bio: profileValues.bio || raw.bio || '',
      addressLine1: addressValues.line1 || raw.addressLine1 || raw.line1 || '',
      addressLine2: addressValues.line2 || raw.addressLine2 || raw.line2 || '',
      ward: addressValues.ward || raw.ward || '',
      province: addressValues.province || raw.province || '',
      country: addressValues.country || raw.country || 'Vietnam',
      addresses: [
        {
          label: addressValues.label || 'Home',
          recipient: addressValues.recipient || profileValues.name || raw.fullName || raw.username || '',
          phone: addressValues.phone || profileValues.phone || raw.phone || '',
          line1: addressValues.line1 || '',
          line2: addressValues.line2 || '',
          ward: addressValues.ward || '',
          province: addressValues.province || '',
          country: addressValues.country || 'Vietnam',
          isDefault: true,
        }
      ],
    };
  };

  const handleSaveProfile = async () => {
    if (!authUser?.id) return;
    setIsSavingProfile(true);

    try {
      const payload = buildUserPayload(profileForm, addressForm);
      const { data: res } = await apiService.put(`/users/${authUser.id}`, payload);
      const data = res?.data ?? res;
      setProfile((prev) => ({
        ...prev,
        raw: data || prev?.raw,
        name: profileForm.name,
        phone: profileForm.phone,
        bio: profileForm.bio,
      }));
      updateUser({ fullName: profileForm.name, phone: profileForm.phone });
      showToast('Cập nhật thông tin cá nhân thành công.', 'success');
    } catch (error) {
      console.error('Failed to update user profile', error);
      showToast('Cập nhật thông tin cá nhân thất bại.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!authUser?.id) return;
    setIsSavingAddress(true);

    try {
      const payload = buildUserPayload(profileForm, addressForm);
      const { data: res } = await apiService.put(`/users/${authUser.id}`, payload);
      const data = res?.data ?? res;
      const updatedAddress = normalizeAddress({
        id: addresses[0]?.id || 'default-address',
        ...addressForm,
        isDefault: true,
      });
      setAddresses([updatedAddress]);
      setProfile((prev) => ({ ...prev, raw: data || prev?.raw }));
      showToast('Cập nhật địa chỉ thành công.', 'success');
    } catch (error) {
      console.error('Failed to update user address', error);
      showToast('Cập nhật địa chỉ thất bại.', 'error');
    } finally {
      setIsSavingAddress(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <ToastNotification
        message={toast.message}
        status={toast.status}
        isVisible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-caption text-neutral-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">{t('home')}</Link>
            <span>/</span>
            <span className="text-neutral-800 font-medium">{t('account_my_account')}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="card p-5 mb-4 text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img
                  src={profile?.avatar || 'https://ui-avatars.com/api/?name=User'}
                  alt={profile?.name || 'User'}
                  className="w-full h-full rounded-full object-cover border-3 border-white shadow-soft-md"
                />
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-soft-sm hover:bg-primary-700 transition-colors">
                  <HiOutlineCamera className="w-3.5 h-3.5" />
                </button>
              </div>
              <h3 className="text-body-md font-semibold text-neutral-900">{profile?.name || 'Loading...'}</h3>
              <p className="text-caption text-neutral-500">{profile?.email || '...'}</p>
              <p className="text-caption text-neutral-400 mt-1">{t('account_member_since')} {profile?.memberSince || '...'}</p>
            </div>

            {/* Navigation */}
            <div className="card p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    navigate(`/account/${tab.id}`);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                    }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {t(tab.nameKey)}
                </button>
              ))}
              <div className="divider my-2" />
              <Link
                to="/wishlist"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 transition-all duration-200"
              >
                <HiOutlineHeart className="w-5 h-5" />
                {t('account_wishlist')}
              </Link>
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium text-danger-600 hover:bg-danger-50 transition-all duration-200">
                <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                {t('account_sign_out')}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-heading-lg text-neutral-900">{t('account_personal_info')}</h2>
                  <button className="btn-secondary btn-sm" type="button">
                    <HiOutlinePencil className="w-4 h-4" />
                    {t('account_edit_profile')}
                  </button>
                </div>


                <div className="card p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_full_name')}</label>
                      <input
                        type="text"
                        className="input"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_username')}</label>
                      <input type="text" className="input bg-neutral-50 text-neutral-500 cursor-not-allowed" value={profile?.username || ''} disabled />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_email')}</label>
                      <input type="email" className="input bg-neutral-50 text-neutral-500 cursor-not-allowed" value={profile?.email || ''} disabled />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_phone')}</label>
                      <input
                        type="tel"
                        className="input"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_bio')}</label>
                      <textarea
                        className="input min-h-[100px] resize-none"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button className="btn-primary" type="button" onClick={handleSaveProfile} disabled={isSavingProfile}>
                      {isSavingProfile ? t('account_saving') : t('account_save_changes')}
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { label: t('account_total_orders'), value: String(orders.length), icon: HiOutlineShoppingBag },
                    { label: t('account_wishlist_items'), value: '8', icon: HiOutlineHeart },
                    { label: t('account_addresses_count'), value: String(addresses.length || 1), icon: HiOutlineMapPin },
                  ].map((stat, i) => (
                    <div key={i} className="card p-4 text-center">
                      <stat.icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                      <p className="text-heading-md text-neutral-900">{stat.value}</p>
                      <p className="text-caption text-neutral-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-fade-in">
                <h2 className="text-heading-lg text-neutral-900 mb-6">{t('account_order_history')}</h2>
                <div className="space-y-4">
                  {isLoadingOrders && (
                    <div className="card p-6 text-center text-neutral-500">{t('account_loading_orders')}</div>
                  )}
                  {!isLoadingOrders && orders.length === 0 && (
                    <div className="card p-6 text-center text-neutral-500">{t('account_no_orders')}</div>
                  )}
                  {!isLoadingOrders && orders.map((order) => (
                    <div key={order.id} className="card p-5 md:p-6 hover:shadow-card-hover transition-all duration-300">
                      {/* Order header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 pb-4 border-b border-neutral-100">
                        <div>
                          <p className="text-body-sm font-semibold text-neutral-800 mb-0.5">{order.id}</p>
                          <p className="text-caption text-neutral-500">{order.date}</p>
                          {order.shipping?.recipient && (
                            <p className="text-caption text-neutral-400 mt-1">
                              {order.shipping.recipient} • {order.shipping.phone}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-heading-sm font-bold text-neutral-900">
                            {formatVnd(order.total)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`badge badge-${order.statusColor}`}>{order.status}</span>
                            <span className={`badge badge-${order.paymentStatusColor}`}>{order.paymentStatus}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                              <HiOutlineShoppingBag className="w-5 h-5 text-neutral-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-body-sm font-medium text-neutral-800 line-clamp-1">{item.name}</p>
                              {item.variantName && (
                                <p className="text-caption text-neutral-400">{item.variantName}</p>
                              )}
                              <p className="text-caption text-neutral-500">x{item.quantity}</p>
                            </div>
                            <p className="text-body-sm font-medium text-neutral-700 shrink-0">
                              {formatVnd(item.lineTotal)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order footer */}
                      <div className="flex items-center justify-end mt-4 pt-4 border-t border-neutral-100">
                        <button className="btn-ghost btn-sm text-primary-600">
                          {t('account_view_detail')} <HiOutlineChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-heading-lg text-neutral-900">{t('account_saved_addresses')}</h2>
                  <button className="btn-primary btn-sm" type="button" onClick={handleSaveAddress} disabled={isSavingAddress}>
                    {isSavingAddress ? t('account_saving') : t('account_save_address')}
                  </button>
                </div>

                <div className="card p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_address_label')}</label>
                      <input className="input" value={addressForm.label} onChange={(e) => setAddressForm((prev) => ({ ...prev, label: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_recipient')}</label>
                      <input className="input" value={addressForm.recipient} onChange={(e) => setAddressForm((prev) => ({ ...prev, recipient: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_phone')}</label>
                      <input className="input" value={addressForm.phone} onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_address_line1')}</label>
                      <input className="input" value={addressForm.line1} onChange={(e) => setAddressForm((prev) => ({ ...prev, line1: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_address_line2')}</label>
                      <input className="input" value={addressForm.line2} onChange={(e) => setAddressForm((prev) => ({ ...prev, line2: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_ward')}</label>
                      <input className="input" value={addressForm.ward} onChange={(e) => setAddressForm((prev) => ({ ...prev, ward: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_province')}</label>
                      <input className="input" value={addressForm.province} onChange={(e) => setAddressForm((prev) => ({ ...prev, province: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">{t('account_country')}</label>
                      <input className="input" value={addressForm.country} onChange={(e) => setAddressForm((prev) => ({ ...prev, country: e.target.value }))} />
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-heading-lg text-neutral-900">{t('account_payment_methods')}</h2>
                  <button className="btn-primary btn-sm">{t('account_add_card')}</button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
                    { type: 'Mastercard', last4: '8888', expiry: '06/26', isDefault: false },
                  ].map((card, i) => (
                    <div key={i} className={`card p-5 relative ${card.isDefault ? 'border-primary-200 bg-primary-50/30' : ''}`}>
                      {card.isDefault && (
                        <span className="badge-primary absolute top-3 right-3">{t('account_default')}</span>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-7 bg-neutral-100 rounded flex items-center justify-center">
                          <span className="text-[10px] font-bold text-neutral-500">{card.type}</span>
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-neutral-800">•••• {card.last4}</p>
                          <p className="text-caption text-neutral-500">{t('account_expires')} {card.expiry}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="text-body-sm text-primary-600 hover:text-primary-700 font-medium">{t('account_edit')}</button>
                        {!card.isDefault && (
                          <button className="text-body-sm text-danger-600 hover:text-danger-700 font-medium">{t('account_remove')}</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                <h2 className="text-heading-lg text-neutral-900 mb-6">{t('account_settings')}</h2>

                <div className="space-y-6">
                  <div className="card p-6">
                    <h3 className="text-heading-sm text-neutral-900 mb-4">{t('account_notifications')}</h3>
                    <div className="space-y-4">
                      {[
                        { label: t('account_notif_orders'), desc: t('account_notif_orders_desc'), checked: true },
                        { label: t('account_notif_promotions'), desc: t('account_notif_promotions_desc'), checked: true },
                        { label: t('account_notif_newsletter'), desc: t('account_notif_newsletter_desc'), checked: false },
                        { label: t('account_notif_price_drops'), desc: t('account_notif_price_drops_desc'), checked: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="text-body-sm font-medium text-neutral-800">{item.label}</p>
                            <p className="text-caption text-neutral-500">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                            <div className="w-11 h-6 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-heading-sm text-neutral-900 mb-4">{t('account_security')}</h3>
                    <div className="space-y-4">
                      <button className="btn-secondary w-full justify-between">
                        <span>{t('account_change_password')}</span>
                        <HiOutlineChevronRight className="w-4 h-4" />
                      </button>
                      <button className="btn-secondary w-full justify-between">
                        <span>{t('account_two_factor')}</span>
                        <HiOutlineChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="card p-6 border-danger-100">
                    <h3 className="text-heading-sm text-danger-600 mb-2">{t('account_danger_zone')}</h3>
                    <p className="text-body-sm text-neutral-500 mb-4">
                      {t('account_delete_warning')}
                    </p>
                    <button className="btn-danger btn-sm">{t('account_delete')}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
