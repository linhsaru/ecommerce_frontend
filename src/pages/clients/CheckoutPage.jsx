import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineCreditCard,
  HiOutlineBanknotes,
  HiOutlineDevicePhoneMobile,
  HiOutlineCheckCircle,
  HiOutlineChevronRight,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
  HiCheck,
} from 'react-icons/hi2';
import { useCartStore } from '../../store/cartStore';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const shipping = total >= 99 ? 0 : 9.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  const steps = [
    { id: 1, name: 'Shipping', icon: HiOutlineTruck },
    { id: 2, name: 'Payment', icon: HiOutlineCreditCard },
    { id: 3, name: 'Review', icon: HiOutlineCheckCircle },
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: HiOutlineCreditCard, desc: 'Visa, Mastercard, Amex' },
    { id: 'paypal', name: 'PayPal', icon: HiOutlineBanknotes, desc: 'Pay with PayPal' },
    { id: 'mobile', name: 'Mobile Pay', icon: HiOutlineDevicePhoneMobile, desc: 'Apple Pay, Google Pay' },
  ];

  const handleShippingChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="animate-fade-in min-h-[80vh] flex items-center justify-center">
        <div className="container-custom py-20 text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 bg-success-100 rounded-full flex items-center justify-center animate-scale-in">
            <HiOutlineCheckCircle className="w-10 h-10 text-success-600" />
          </div>
          <h1 className="text-display-md text-neutral-900 mb-3">Order Placed!</h1>
          <p className="text-body-lg text-neutral-500 mb-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <p className="text-body-sm text-neutral-400 mb-8">
            Order #ORD-2024-{Math.floor(Math.random() * 9000 + 1000)}
          </p>

          <div className="card p-6 mb-8 text-left">
            <h3 className="text-body-sm font-semibold text-neutral-800 mb-4">What&apos;s next?</h3>
            <div className="space-y-4">
              {[
                { step: '1', text: 'You\'ll receive an order confirmation email shortly' },
                { step: '2', text: 'We\'ll notify you when your order ships' },
                { step: '3', text: 'Track your delivery in real-time' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-caption font-bold text-primary-600">{item.step}</span>
                  </div>
                  <p className="text-body-sm text-neutral-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link to="/account/orders" className="btn-secondary">
              View Orders
            </Link>
            <Link to="/products" className="btn-primary">
              Continue Shopping
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [items.length, orderPlaced, navigate]);

  if (items.length === 0 && !orderPlaced) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-caption text-neutral-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-primary-600 transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-neutral-800 font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {/* Steps */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep > step.id
                      ? 'bg-success-500 text-white'
                      : currentStep === step.id
                        ? 'bg-primary-600 text-white shadow-button'
                        : 'bg-neutral-100 text-neutral-400'
                  }`}>
                    {currentStep > step.id ? (
                      <HiCheck className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-body-sm font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-neutral-800' : 'text-neutral-400'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-3 rounded-full transition-colors duration-300 ${
                    currentStep > step.id ? 'bg-success-500' : 'bg-neutral-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <div className="card p-6 md:p-8 animate-fade-in">
                <h2 className="text-heading-lg text-neutral-900 mb-6">Shipping Address</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingData.firstName}
                      onChange={handleShippingChange}
                      className="input"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingData.lastName}
                      onChange={handleShippingChange}
                      className="input"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingData.email}
                      onChange={handleShippingChange}
                      className="input"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                      className="input"
                      placeholder="+1 (234) 567-890"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      className="input"
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      className="input"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingData.state}
                      onChange={handleShippingChange}
                      className="input"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingData.zipCode}
                      onChange={handleShippingChange}
                      className="input"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Country</label>
                    <select
                      name="country"
                      value={shippingData.country}
                      onChange={handleShippingChange}
                      className="input"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button onClick={() => setCurrentStep(2)} className="btn-primary btn-lg">
                    Continue to Payment
                    <HiOutlineChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="card p-6 md:p-8 animate-fade-in">
                <h2 className="text-heading-lg text-neutral-900 mb-6">Payment Method</h2>

                {/* Payment method selection */}
                <div className="grid md:grid-cols-3 gap-3 mb-8">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        paymentMethod === method.id
                          ? 'border-primary-500 bg-primary-50 shadow-soft-sm'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <method.icon className={`w-6 h-6 mb-2 ${paymentMethod === method.id ? 'text-primary-600' : 'text-neutral-500'}`} />
                      <p className={`text-body-sm font-semibold ${paymentMethod === method.id ? 'text-primary-700' : 'text-neutral-800'}`}>
                        {method.name}
                      </p>
                      <p className="text-caption text-neutral-500">{method.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Card form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Card Number</label>
                      <input
                        type="text"
                        name="number"
                        value={cardData.number}
                        onChange={handleCardChange}
                        className="input"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Cardholder Name</label>
                      <input
                        type="text"
                        name="name"
                        value={cardData.name}
                        onChange={handleCardChange}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Expiry Date</label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardData.expiry}
                          onChange={handleCardChange}
                          className="input"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          className="input"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="text-center py-8 bg-neutral-50 rounded-2xl">
                    <p className="text-body-md text-neutral-600 mb-4">You will be redirected to PayPal to complete your payment.</p>
                    <div className="w-32 h-10 bg-neutral-200 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-body-sm font-bold text-neutral-500">PayPal</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile' && (
                  <div className="text-center py-8 bg-neutral-50 rounded-2xl">
                    <p className="text-body-md text-neutral-600 mb-4">Use your device&apos;s mobile payment to complete checkout.</p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="px-4 py-2 bg-neutral-200 rounded-lg">
                        <span className="text-body-sm font-bold text-neutral-500">Apple Pay</span>
                      </div>
                      <div className="px-4 py-2 bg-neutral-200 rounded-lg">
                        <span className="text-body-sm font-bold text-neutral-500">Google Pay</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-6 text-caption text-neutral-500">
                  <HiOutlineLockClosed className="w-4 h-4" />
                  <span>Your payment information is encrypted and secure</span>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={() => setCurrentStep(1)} className="btn-ghost">
                    ← Back to Shipping
                  </button>
                  <button onClick={() => setCurrentStep(3)} className="btn-primary btn-lg">
                    Review Order
                    <HiOutlineChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                {/* Shipping Summary */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-heading-sm text-neutral-900">Shipping Address</h3>
                    <button onClick={() => setCurrentStep(1)} className="text-body-sm text-primary-600 hover:text-primary-700 font-medium">
                      Edit
                    </button>
                  </div>
                  <p className="text-body-sm text-neutral-600">
                    {shippingData.firstName || 'John'} {shippingData.lastName || 'Doe'}<br />
                    {shippingData.address || '123 Main Street'}<br />
                    {shippingData.city || 'New York'}, {shippingData.state || 'NY'} {shippingData.zipCode || '10001'}<br />
                    {shippingData.country}
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-heading-sm text-neutral-900">Payment Method</h3>
                    <button onClick={() => setCurrentStep(2)} className="text-body-sm text-primary-600 hover:text-primary-700 font-medium">
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <HiOutlineCreditCard className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-body-sm font-medium text-neutral-800">
                        {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                      </p>
                      {paymentMethod === 'card' && cardData.number && (
                        <p className="text-caption text-neutral-500">
                          •••• •••• •••• {cardData.number.slice(-4) || '3456'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="card p-6">
                  <h3 className="text-heading-sm text-neutral-900 mb-4">Order Items ({items.length})</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-medium text-neutral-800 line-clamp-1">{item.name}</p>
                          <p className="text-caption text-neutral-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-body-sm font-semibold text-neutral-800">
                          ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setCurrentStep(2)} className="btn-ghost">
                    ← Back to Payment
                  </button>
                  <button onClick={handlePlaceOrder} className="btn-primary btn-lg">
                    <HiOutlineLockClosed className="w-5 h-5" />
                    Place Order — ${grandTotal.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-heading-md text-neutral-900 mb-4">Order Summary</h3>

              {/* Items preview */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-caption font-medium text-neutral-700 line-clamp-1">{item.name}</p>
                    </div>
                    <p className="text-caption font-semibold text-neutral-800">
                      ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="divider mb-4" />

              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between text-body-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="text-neutral-800">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-success-600 font-medium' : 'text-neutral-800'}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-neutral-500">Tax</span>
                  <span className="text-neutral-800">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="divider mb-4" />

              <div className="flex justify-between mb-6">
                <span className="text-heading-sm text-neutral-900">Total</span>
                <span className="text-heading-md text-neutral-900 font-bold">${grandTotal.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                {[
                  { icon: HiOutlineShieldCheck, text: 'Secure checkout' },
                  { icon: HiOutlineTruck, text: shipping === 0 ? 'Free shipping' : 'Standard shipping' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-caption text-neutral-500">
                    <item.icon className="w-3.5 h-3.5 text-success-500" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
