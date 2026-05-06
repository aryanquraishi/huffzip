import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { label: 'Documentation', href: '/how-it-works' },
  { label: 'GitHub', href: 'https://github.com', external: true },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#F3F0EC] dark:bg-[#0a0a0a] text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest w-full border-t border-gray-200 dark:border-gray-800 mt-auto font-['Inter']">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 py-12 gap-6 w-full">
        <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
          <span className="font-bold text-gray-900 dark:text-white text-sm normal-case tracking-normal">HuffZip</span>
          <span className="text-teal-700 dark:text-teal-500 normal-case tracking-normal ml-2">
            © 2024 HuffZip Utility. Optimized for technical precision.
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          {FOOTER_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-teal-700 dark:hover:text-teal-300 transition-colors no-underline focus:ring-2 focus:ring-teal-500/20 rounded outline-none p-1"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label} to={link.href}
                className="text-gray-400 dark:text-gray-500 hover:text-teal-700 dark:hover:text-teal-300 transition-colors no-underline focus:ring-2 focus:ring-teal-500/20 rounded outline-none p-1"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </footer>
  );
}
