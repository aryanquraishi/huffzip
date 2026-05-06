import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

const NAV_LINKS = [
  { path: '/compress', label: 'Compress' },
  { path: '/decompress', label: 'Decompress' },
  { path: '/compare', label: 'Compare' },
  { path: '/how-it-works', label: 'Learn' },
];

const MOBILE_NAV = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/compress', label: 'Compress', icon: 'compress' },
  { path: '/decompress', label: 'Decompress', icon: 'unarchive' },
  { path: '/compare', label: 'Compare', icon: 'compare_arrows' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => { setIsOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <>
      <header className="bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md sticky top-0 w-full flex justify-center z-50 border-b border-gray-200 dark:border-gray-800 font-['Inter'] text-sm font-medium tracking-tight">
        <div className="flex justify-between items-center w-full max-w-[1200px] mx-auto px-6 h-16">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black text-teal-700 dark:text-teal-400 tracking-tighter no-underline hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 active:scale-[0.98] p-2 rounded">
              HuffZip
            </Link>
            <nav className="hidden md:flex gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`no-underline transition-all duration-200 active:scale-[0.98] ${
                    isActive(link.path)
                      ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 pb-1'
                      : 'text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Only dark/light toggle + mobile hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300 transition-all duration-200 active:scale-[0.98] p-2 rounded-full bg-transparent border-none cursor-pointer"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg border-none cursor-pointer bg-transparent text-gray-500 dark:text-gray-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden" style={{ top: '64px' }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-16 right-0 bottom-0 w-[80%] max-w-[320px] bg-white dark:bg-[#111111] z-50 md:hidden shadow-2xl overflow-y-auto"
            >
              <div className="flex flex-col p-4 gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-4 rounded-lg text-base font-medium no-underline transition-colors ${
                      isActive(link.path)
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
                        : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav md:hidden">
        {MOBILE_NAV.map((item) => (
          <Link key={item.path} to={item.path} className={isActive(item.path) ? 'active' : ''}>
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
