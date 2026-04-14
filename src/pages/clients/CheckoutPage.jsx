import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HiOutlineCheckCircle,
  HiOutlineChevronRight,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
} from 'react-icons/hi2';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { coupons as mockCoupons, userAddresses } from '../../data/mockData';
import CouponList from '../../components/CouponList';
import { apiService } from '../../services';
import { paymentApi } from '../../services/paymentApi';
import { orderApi } from '../../services/orderApi';
import { calculateOrderTotals } from '../../logic/priceCalculator';
import { useTranslation } from '../../context/LanguageContext';
import { formatVnd } from '../../utils/price';
import ToastNotification from '../../components/common/ToastNotification/ToastNotification';

// payment_method ENUM: cod, bank_transfer, vnpay, momo, stripe, paypal, other
const PAYMENT_METHODS = [
  { id: 'cod', nameKey: 'cash_on_delivery', descKey: 'pay_when_receive' },
  { id: 'vnpay', nameKey: 'vnpay', descKey: 'vnpay_desc' },
  { id: 'momo', nameKey: 'momo', descKey: 'momo_desc' },
  { id: 'bank_transfer', nameKey: 'bank_transfer', descKey: 'bank_transfer_desc' },
  { id: 'stripe', nameKey: 'credit_card', descKey: 'credit_card_desc' },
];

const FREE_SHIPPING_THRESHOLD = 199;
const SHIPPING_FEE = 9.99;
const PAYMENT_METHOD_TO_ENUM = {
  cod: 0,
  vnpay: 1,
  momo: 2,
  bank_transfer: 3,
  stripe: 4,
};

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartStoreItems, total: cartStoreTotal, clearCart } = useCartStore();

  const buyNowItem = location.state?.buyNowItem;
  const items = buyNowItem ? [buyNowItem] : cartStoreItems;
  const cartTotal = buyNowItem
    ? (buyNowItem.discountPrice ?? buyNowItem.price) * buyNowItem.quantity
    : cartStoreTotal;
  const { user, isAuthenticated } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const orderPlacedRef = useRef(false);

  const defaultAddress = isAuthenticated && user
    ? (userAddresses.find((a) => a.user_id === user.id && a.is_default) || userAddresses.find((a) => a.user_id === user.id))
    : null;

  const [shippingData, setShippingData] = useState({
    ship_recipient: '',
    ship_email: '',
    ship_phone: '',
    ship_line1: '',
    ship_line2: '',
    ship_ward: '',
    ship_district: '',
    ship_province: '',
    ship_country: 'Vietnam',
    ship_postal_code: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [activeCoupons, setActiveCoupons] = useState(mockCoupons || []);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '', status: 'info' });

  const showToast = (message, status = 'info') => {
    setToastConfig({ isVisible: true, message, status });
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchLiveCoupons = async () => {
        try {
          const { data } = await apiService.get('/coupons', { params: { pageSize: 100 } });
          const items = data?.data?.items || data?.items || [];
          if (items.length > 0) {
            setActiveCoupons(items.filter(c => c.status === 1));
          }
        } catch (error) {
          console.error('Failed to fetch live coupons:', error);
        }
      };
      fetchLiveCoupons();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && defaultAddress) {
      setShippingData({
        ship_recipient: defaultAddress.recipient,
        ship_email: user?.email || '',
        ship_phone: defaultAddress.phone,
        ship_line1: defaultAddress.line1,
        ship_line2: defaultAddress.line2 ?? '',
        ship_ward: defaultAddress.ward ?? '',
        ship_district: defaultAddress.district ?? '',
        ship_province: defaultAddress.province ?? '',
        ship_country: defaultAddress.country,
        ship_postal_code: defaultAddress.postal_code ?? '',
      });
      setSelectedAddressId(defaultAddress.id);
    }
  }, [isAuthenticated, defaultAddress?.id]);

  useEffect(() => {
    if (isAuthenticated && selectedAddressId) {
      const addr = userAddresses.find((a) => a.id === selectedAddressId);
      if (addr) {
        setShippingData({
          ship_recipient: addr.recipient,
          ship_email: user?.email || '',
          ship_phone: addr.phone,
          ship_line1: addr.line1,
          ship_line2: addr.line2 ?? '',
          ship_ward: addr.ward ?? '',
          ship_district: addr.district ?? '',
          ship_province: addr.province ?? '',
          ship_country: addr.country,
          ship_postal_code: addr.postal_code ?? '',
        });
      }
    }
  }, [selectedAddressId, isAuthenticated]);

  const totals = calculateOrderTotals({
    subtotalAmount: cartTotal,
    coupon: selectedCoupon,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    shippingFee: SHIPPING_FEE,
    currency: 'VND',
  });

  const handleShippingChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    const orderPayload = buildOrderPayload();

    try {
      const orderResponse = await orderApi.createOrder(orderPayload);
      const createdOrderId =
        orderResponse?.data?.orderId ||
        orderResponse?.orderId ||
        orderResponse?.data?.id ||
        orderResponse?.id;

      const createdOrderNo =
        orderResponse?.data?.orderNo ||
        createdOrderId;

      if (!createdOrderId) {
        console.error('Không nhận được createdOrderId từ backend:', orderResponse);
        showToast(t('order_placed_error'), 'error');
        setIsSubmitting(false);
        return;
      }

      if (paymentMethod === 'vnpay') {
        const clientReturnUrl = `${window.location.origin}/payments/vnpay/return`;
        const payload = {
          orderId: createdOrderId,
          orderDescription: `Thanh toan don hang ${createdOrderId}`,
          returnUrl: clientReturnUrl,
          clientReturnUrl,
        };
        const response = await paymentApi.createVNPayUrl(payload);

        const paymentUrl = response?.data?.paymentUrl || response?.paymentUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl;
          return;
        } else {
          console.error("VNPay Error - No paymentUrl in response:", response);
          showToast(t('order_placed_error'), 'error');
        }
      } else {
        showToast(t('order_placed_success'), 'success');
        orderPlacedRef.current = true;
        await new Promise((r) => setTimeout(r, 1200));
        setOrderNo(createdOrderNo);
        setOrderPlaced(true);
        if (!buyNowItem) {
          clearCart();
        }
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      showToast(t('order_placed_error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildOrderPayload = () => {
    return {
      userId: user?.id,
      recipientEmail: shippingData.ship_email,
      recipientName: shippingData.ship_recipient,
      shippingAddress: shippingData.ship_line1,
      phoneNumber: shippingData.ship_phone,
      ward: shippingData.ship_ward || '',
      province: shippingData.ship_province || '',
      paymentMethod: PAYMENT_METHOD_TO_ENUM[paymentMethod] ?? 0,
      items: items.map((item) => ({
        productVariantId: item.variantId || item.variant_id,
        quantity: item.quantity,
      })),
    };
  };

  useEffect(() => {
    if (items.length === 0 && !orderPlaced && !orderPlacedRef.current) navigate('/cart');
  }, [items.length, orderPlaced, navigate]);

  if (orderPlaced) {
    return (
      <div className="animate-fade-in min-h-[80vh] flex flex-col items-center justify-center relative">
        <div className="container-custom py-20 text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <HiOutlineCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">{t('order_placed')}</h1>
          <p className="text-slate-600 mb-8">{t('email_sent_noti')}</p>
          <div className="flex items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/account/orders" className="btn-secondary">{t('view_orders')}</Link>
            ) : (
              <Link to={`/order-lookup/${orderNo}`} className="btn-secondary">{t('lookup_order')}</Link>
            )}
            <Link to="/products" className="btn-primary">
              {t('continue_shopping')} <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <ToastNotification
          isVisible={toastConfig.isVisible}
          message={toastConfig.message}
          status={toastConfig.status}
          onClose={() => setToastConfig((prev) => ({ ...prev, isVisible: false }))}
        />
      </div>
    );
  }



  if (items.length === 0 && !orderPlaced && !orderPlacedRef.current) return null;

  return (
    <div className="animate-fade-in">
      <div className="bg-white border-b border-slate-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-blue-600">{t('home')}</Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-blue-600">{t('cart')}</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">{t('checkout')}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {!isAuthenticated && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex items-center justify-between">
                <p className="text-sm text-slate-700">{t('login_to_use_coupons')}</p>
                <Link to="/login?redirect=/checkout" className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600">
                  {t('login')}
                </Link>
              </div>
            )}

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <HiOutlineTruck className="w-5 h-5 text-blue-500" />
                {t('shipping_information')}
              </h2>
              {isAuthenticated && userAddresses.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('saved_addresses')}</label>
                  <div className="space-y-2">
                    {userAddresses.filter((a) => a.user_id === user?.id).map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${selectedAddressId === addr.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <p className="font-medium text-slate-800">{addr.recipient}</p>
                        <p className="text-sm text-slate-500">{addr.line1}, {addr.district}, {addr.province}</p>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{t('or_edit_below')}</p>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('recipient')}</label>
                  <input
                    name="ship_recipient"
                    value={shippingData.ship_recipient}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('phone')}</label>
                  <input
                    name="ship_phone"
                    value={shippingData.ship_phone}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0912345678"
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('email_address') || 'Email'}</label>
                  <input
                    type="email"
                    name="ship_email"
                    value={shippingData.ship_email}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('address_line_1')}</label>
                  <input
                    name="ship_line1"
                    value={shippingData.ship_line1}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Street address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('ward')}</label>
                  <input
                    name="ship_ward"
                    value={shippingData.ship_ward}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('province')}</label>
                  <input
                    name="ship_province"
                    value={shippingData.ship_province}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">{t('payment_method')}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === m.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <p className="font-medium text-slate-800">{t(m.nameKey)}</p>
                    <p className="text-xs text-slate-500">{t(m.descKey)}</p>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                <HiOutlineLockClosed className="w-4 h-4" />
                <span>{t('secure_payment')}</span>
              </div>
            </div>

            {isAuthenticated && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">{t('coupon')}</h2>
                <CouponList
                  coupons={activeCoupons}
                  subtotalAmount={cartTotal}
                  selectedCoupon={selectedCoupon}
                  onSelect={setSelectedCoupon}
                />
              </div>
            )}
          </div>

          {/* Right: Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('order_summary')}</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={item.image || (item.images && item.images[0])} alt="" className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-slate-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {(item.selectedColor || item.selectedSize) && (
                          <span className="mr-1">{item.selectedColor} {item.selectedColor && item.selectedSize ? '/' : ''} {item.selectedSize} &bull;</span>
                        )}
                        <span>SL: {item.quantity}</span>
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {formatVnd(((item.discountPrice ?? item.price) || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-slate-800">{formatVnd(totals.subtotal_amount)}</span>
                </div>
                {totals.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{t('discount')}</span>
                    <span>{formatVnd(totals.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('shipping')}</span>
                  <span className={totals.shipping_amount === 0 ? 'text-green-600 font-medium' : 'text-slate-800'}>
                    {totals.shipping_amount === 0 ? t('free') : formatVnd(totals.shipping_amount)}
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-center">
                <span className="font-semibold text-slate-800">{t('total')}</span>
                <span className="text-xl font-bold text-slate-900">{formatVnd(totals.total_amount)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || !shippingData.ship_recipient || !shippingData.ship_phone || !shippingData.ship_email || !shippingData.ship_line1}
                className="w-full mt-6 py-3.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    <HiOutlineLockClosed className="w-5 h-5" />
                    {t('place_order')} — {formatVnd(totals.total_amount)}
                  </>
                )}
              </button>
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />
                <span>{t('secure_checkout')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastNotification
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        status={toastConfig.status}
        onClose={() => setToastConfig((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default CheckoutPage;
