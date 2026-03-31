import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import ChatBot from '../common/ChatBot';

const MainLayout = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const fetchCart = useCartStore(state => state.fetchCart);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default MainLayout;
