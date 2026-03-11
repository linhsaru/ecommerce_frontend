import { Link } from 'react-router-dom';
import {
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
  HiOutlineTag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import { useCartStore } from '../../store/cartStore';
import { QuantitySelector, ProductCard } from '../../components/shop';
import { products } from '../../data/mockData';
import { useState } from 'react';

const CartPage = () => {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const shipping = total >= 199 ? 0 : 9.99;
  const tax = total * 0.08;
  const discount = promoApplied ? total * 0.1 : 0;
  const grandTotal = total + shipping + tax - discount;

  const suggestedProducts = products.filter((p) => !items.find((i) => i.id === p.id)).slice(0, 4);

  const handleApplyPromo = () => {
    if (['BUILD15', 'FREESHIP', 'SAVE10'].includes(promoCode.toUpperCase())) {
      setPromoApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="container-custom py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <HiOutlineShoppingBag className="w-10 h-10 text-neutral-400" />
            </div>
            <h1 className="text-display-sm text-neutral-900 mb-3">Your cart is empty</h1>
            <p className="text-body-md text-neutral-500 mb-8">
              Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link to="/products" className="btn-primary btn-lg">
              Start Shopping
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Suggested Products */}
          {suggestedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-heading-lg text-neutral-900 mb-6">You might like these</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {suggestedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-caption text-neutral-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-neutral-800 font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display-sm text-neutral-900 mb-1">Shopping Cart</h1>
            <p className="text-body-md text-neutral-500">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
          </div>
          <button
            onClick={clearCart}
            className="btn-ghost text-danger-600 hover:text-danger-700 hover:bg-danger-50"
          >
            <HiOutlineTrash className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4 md:p-6 group">
                <div className="flex gap-4 md:gap-6">
                  {/* Image */}
                  <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-neutral-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-caption text-neutral-500 mb-0.5">{item.brand}</p>
                        <Link
                          to={`/products/${item.slug}`}
                          className="text-body-sm md:text-body-md font-semibold text-neutral-800 hover:text-primary-600 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        {item.selectedColor && (
                          <p className="text-caption text-neutral-500 mt-0.5">Color: {item.selectedColor}</p>
                        )}
                        {item.selectedSize && (
                          <p className="text-caption text-neutral-500">Size: {item.selectedSize}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-neutral-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-all duration-200"
                      >
                        <HiOutlineTrash className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <QuantitySelector
                        quantity={item.quantity}
                        onChange={(qty) => updateQuantity(item.id, qty)}
                        size="sm"
                      />
                      <div className="text-right">
                        <p className="text-heading-sm font-bold text-neutral-900">
                          ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                        </p>
                        {item.discountPrice && (
                          <p className="text-caption text-neutral-400 line-through">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link to="/products" className="btn-ghost text-primary-600 hover:text-primary-700">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-heading-md text-neutral-900 mb-6">Order Summary</h3>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="input pl-9 text-body-sm"
                      disabled={promoApplied}
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode || promoApplied}
                    className="btn-secondary btn-sm whitespace-nowrap disabled:opacity-50"
                  >
                    {promoApplied ? '✓ Applied' : 'Apply'}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-caption text-success-600 mt-1.5 font-medium">
                    Promo code applied! 10% discount
                  </p>
                )}
              </div>

              {/* Summary Lines */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-body-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="text-neutral-800 font-medium">${total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-body-sm">
                    <span className="text-success-600">Discount</span>
                    <span className="text-success-600 font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-body-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-success-600' : 'text-neutral-800'}`}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-neutral-500">Tax (est.)</span>
                  <span className="text-neutral-800 font-medium">${tax.toFixed(2)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-caption text-primary-600 bg-primary-50 rounded-lg px-3 py-2">
                    Add ${(99 - total).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="divider mb-4" />

              <div className="flex justify-between mb-6">
                <span className="text-heading-sm text-neutral-900">Total</span>
                <span className="text-heading-md text-neutral-900 font-bold">${grandTotal.toFixed(2)}</span>
              </div>

              <Link to="/checkout" className="btn-primary btn-lg w-full mb-4">
                Proceed to Checkout
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-neutral-100">
                {[
                  { icon: HiOutlineTruck, text: 'Free Ship $99+' },
                  { icon: HiOutlineShieldCheck, text: 'Secure' },
                  { icon: HiOutlineArrowPath, text: '30-Day Returns' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1 text-caption text-neutral-500">
                    <item.icon className="w-3.5 h-3.5" />
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

export default CartPage;
