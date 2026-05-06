import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { StarsBackground } from './components/ui/stars';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import CompressPage from './pages/CompressPage';
import CompressImagePage from './pages/CompressImagePage';
import CompressTextPage from './pages/CompressTextPage';
import CompressAudioPage from './pages/CompressAudioPage';
import DecompressPage from './pages/DecompressPage';
import ComparePage from './pages/ComparePage';
import HowItWorksPage from './pages/HowItWorksPage';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div className="bg-[#fcf9f5] dark:bg-[#0a0a0a] text-[#1c1c19] dark:text-[#e5e5e5] flex flex-col min-h-screen antialiased font-['Inter'] relative">
      {/* Stars Background — only in dark mode */}
      {isDark && (
        <StarsBackground
          className="!fixed inset-0 z-0 pointer-events-none"
          speed={80}
          starColor="rgba(122, 212, 226, 0.6)"
          factor={0.03}
        />
      )}

      {/* All content on top of stars */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 has-bottom-nav">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/compress" element={<CompressPage />} />
            <Route path="/compress/image" element={<CompressImagePage />} />
            <Route path="/compress/text" element={<CompressTextPage />} />
            <Route path="/compress/audio" element={<CompressAudioPage />} />
            <Route path="/decompress" element={<DecompressPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
          </Routes>
        </main>
        
        {/* Bulletproof Global Bottom Spacer (2% of screen height) */}
        <div className="h-[2vh] w-full shrink-0 pointer-events-none" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
