import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

const NAV_LINKS = [
  { path: '/compress', label: 'Compress' },
  { path: '/decompress', label: 'Decompress' },
  { path: '/compare', label: 'Compare' },
  { path: '/how-it-works', label: 'How It Works' },
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

  // Close drawer on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <>
      {/* Top navbar — sticky on every device */}
      <nav className="nav-bar sticky top-0 w-full z-50">
        <div className="container-app flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="material-symbols-outlined text-primary fill" style={{ fontSize: '24px', color: '#2563eb' }}>
              folder_zip
            </span>
            <span className="text-lg font-black tracking-tight text-on-bg">HuffZip</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors cursor-pointer border-none bg-transparent text-on-surface-v min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none outline-none focus:ring-0"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>


            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg border-none cursor-pointer bg-transparent text-on-surface-v hover:bg-slate-100 dark:hover:bg-slate-800 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open menu"
              aria-expanded={isOpen}
            >
              <span className="material-symbols-outlined">
                {isOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-out drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              style={{ top: '64px' }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-16 right-0 bottom-0 w-[80%] max-w-[320px] bg-white dark:bg-slate-900 z-50 md:hidden shadow-2xl overflow-y-auto"
            >
              <div className="flex flex-col p-4 gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-4 rounded-lg text-base font-medium no-underline transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-primary'
                        : 'text-on-bg hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
                  </Link>
                ))}

                <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-4 rounded-lg text-base font-medium no-underline text-on-bg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span className="material-symbols-outlined">code</span>
                  Source Code
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav md:hidden">
        {MOBILE_NAV.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={isActive(item.path) ? 'active' : ''}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
