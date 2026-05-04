import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CompressPage from './pages/CompressPage';
import CompressImagePage from './pages/CompressImagePage';
import CompressTextPage from './pages/CompressTextPage';
import CompressAudioPage from './pages/CompressAudioPage';
import DecompressPage from './pages/DecompressPage';
import ComparePage from './pages/ComparePage';
import HowItWorksPage from './pages/HowItWorksPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
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
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
