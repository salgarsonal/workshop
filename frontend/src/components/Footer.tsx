import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoginModal from './AdminLoginModal';

function Footer() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = (password: string) => {
    // Store password in sessionStorage for admin requests
    sessionStorage.setItem('adminPassword', password);
    setShowLoginModal(false);
    navigate('/admin');
  };

  return (
    <>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">AppDirect India AI Workshop</h3>
              <p className="text-gray-400">Connecting minds, building the future</p>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2 border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              Admin Login
            </button>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 AppDirect India. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showLoginModal && (
          <AdminLoginModal
            onClose={() => setShowLoginModal(false)}
            onLogin={handleAdminLogin}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Footer;

