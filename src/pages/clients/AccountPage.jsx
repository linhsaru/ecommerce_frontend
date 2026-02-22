import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { orders } from '../../data/mockData';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: HiOutlineUser },
    { id: 'orders', name: 'Orders', icon: HiOutlineShoppingBag },
    { id: 'addresses', name: 'Addresses', icon: HiOutlineMapPin },
    { id: 'payment', name: 'Payment', icon: HiOutlineCreditCard },
    { id: 'settings', name: 'Settings', icon: HiOutlineCog6Tooth },
  ];

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (234) 567-890',
    avatar: 'https://picsum.photos/seed/user1/200/200',
    memberSince: 'January 2024',
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-caption text-neutral-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-neutral-800 font-medium">My Account</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            {/* User card */}
            <div className="card p-5 mb-4 text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover border-3 border-white shadow-soft-md"
                />
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-soft-sm hover:bg-primary-700 transition-colors">
                  <HiOutlineCamera className="w-3.5 h-3.5" />
                </button>
              </div>
              <h3 className="text-body-md font-semibold text-neutral-900">{user.name}</h3>
              <p className="text-caption text-neutral-500">{user.email}</p>
              <p className="text-caption text-neutral-400 mt-1">Member since {user.memberSince}</p>
            </div>

            {/* Navigation */}
            <div className="card p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
              <div className="divider my-2" />
              <Link
                to="/wishlist"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 transition-all duration-200"
              >
                <HiOutlineHeart className="w-5 h-5" />
                Wishlist
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium text-danger-600 hover:bg-danger-50 transition-all duration-200">
                <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-heading-lg text-neutral-900">Personal Information</h2>
                  <button className="btn-secondary btn-sm">
                    <HiOutlinePencil className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                <div className="card p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">First Name</label>
                      <input type="text" className="input" defaultValue="John" />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Last Name</label>
                      <input type="text" className="input" defaultValue="Doe" />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Email</label>
                      <input type="email" className="input" defaultValue="john.doe@example.com" />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Phone</label>
                      <input type="tel" className="input" defaultValue="+1 (234) 567-890" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Bio</label>
                      <textarea
                        className="input min-h-[100px] resize-none"
                        defaultValue="Passionate about quality products and modern design."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button className="btn-primary">Save Changes</button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { label: 'Total Orders', value: '12', icon: HiOutlineShoppingBag },
                    { label: 'Wishlist Items', value: '8', icon: HiOutlineHeart },
                    { label: 'Addresses', value: '2', icon: HiOutlineMapPin },
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
                <h2 className="text-heading-lg text-neutral-900 mb-6">Order History</h2>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="card p-5 md:p-6 hover:shadow-card-hover transition-all duration-300">
                      {/* Order header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-neutral-100">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-body-sm font-semibold text-neutral-800">{order.id}</p>
                            <p className="text-caption text-neutral-500">{order.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`badge badge-${order.statusColor}`}>
                            {order.status}
                          </span>
                          <span className="text-heading-sm font-bold text-neutral-900">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-body-sm font-medium text-neutral-800 line-clamp-1">{item.name}</p>
                              <p className="text-caption text-neutral-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-body-sm font-medium text-neutral-700">
                              ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order footer */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                        <div className="text-caption text-neutral-500">
                          {order.trackingNumber && (
                            <span>Tracking: {order.trackingNumber}</span>
                          )}
                        </div>
                        <button className="btn-ghost btn-sm text-primary-600">
                          View Details <HiOutlineChevronRight className="w-4 h-4" />
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
                  <h2 className="text-heading-lg text-neutral-900">Saved Addresses</h2>
                  <button className="btn-primary btn-sm">+ Add Address</button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: 'Home', address: '123 Main Street, Apt 4B', city: 'New York, NY 10001', isDefault: true },
                    { label: 'Office', address: '456 Oak Avenue, Suite 200', city: 'Los Angeles, CA 90001', isDefault: false },
                  ].map((addr, i) => (
                    <div key={i} className={`card p-5 relative ${addr.isDefault ? 'border-primary-200 bg-primary-50/30' : ''}`}>
                      {addr.isDefault && (
                        <span className="badge-primary absolute top-3 right-3">Default</span>
                      )}
                      <h4 className="text-body-sm font-semibold text-neutral-800 mb-2">{addr.label}</h4>
                      <p className="text-body-sm text-neutral-600">{addr.address}</p>
                      <p className="text-body-sm text-neutral-600">{addr.city}</p>
                      <div className="flex gap-3 mt-4">
                        <button className="text-body-sm text-primary-600 hover:text-primary-700 font-medium">Edit</button>
                        {!addr.isDefault && (
                          <button className="text-body-sm text-danger-600 hover:text-danger-700 font-medium">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-heading-lg text-neutral-900">Payment Methods</h2>
                  <button className="btn-primary btn-sm">+ Add Card</button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
                    { type: 'Mastercard', last4: '8888', expiry: '06/26', isDefault: false },
                  ].map((card, i) => (
                    <div key={i} className={`card p-5 relative ${card.isDefault ? 'border-primary-200 bg-primary-50/30' : ''}`}>
                      {card.isDefault && (
                        <span className="badge-primary absolute top-3 right-3">Default</span>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-7 bg-neutral-100 rounded flex items-center justify-center">
                          <span className="text-[10px] font-bold text-neutral-500">{card.type}</span>
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-neutral-800">•••• {card.last4}</p>
                          <p className="text-caption text-neutral-500">Expires {card.expiry}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="text-body-sm text-primary-600 hover:text-primary-700 font-medium">Edit</button>
                        {!card.isDefault && (
                          <button className="text-body-sm text-danger-600 hover:text-danger-700 font-medium">Remove</button>
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
                <h2 className="text-heading-lg text-neutral-900 mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div className="card p-6">
                    <h3 className="text-heading-sm text-neutral-900 mb-4">Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Order updates', desc: 'Get notified about your order status', checked: true },
                        { label: 'Promotions', desc: 'Receive deals and promotional offers', checked: true },
                        { label: 'Newsletter', desc: 'Weekly newsletter with new arrivals', checked: false },
                        { label: 'Price drops', desc: 'Alerts when wishlist items go on sale', checked: true },
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
                    <h3 className="text-heading-sm text-neutral-900 mb-4">Security</h3>
                    <div className="space-y-4">
                      <button className="btn-secondary w-full justify-between">
                        <span>Change Password</span>
                        <HiOutlineChevronRight className="w-4 h-4" />
                      </button>
                      <button className="btn-secondary w-full justify-between">
                        <span>Two-Factor Authentication</span>
                        <HiOutlineChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="card p-6 border-danger-100">
                    <h3 className="text-heading-sm text-danger-600 mb-2">Danger Zone</h3>
                    <p className="text-body-sm text-neutral-500 mb-4">
                      Once you delete your account, there is no going back.
                    </p>
                    <button className="btn-danger btn-sm">Delete Account</button>
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
