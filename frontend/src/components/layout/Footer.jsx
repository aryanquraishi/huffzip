import { AnimatedFooter } from '../ui/animated-footer';
import { Code, FolderArchive } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    {
      icon: <Code className="w-6 h-6" />,
      href: "https://github.com",
      label: "GitHub",
    }
  ];

  const navLinks = [
    { label: "Compress", href: "/compress" },
    { label: "Decompress", href: "/decompress" },
    { label: "Compare", href: "/compare" },
    { label: "How It Works", href: "/how-it-works" },
  ];

  return (
    <AnimatedFooter
      brandName="HuffZip"
      brandDescription="Academic-grade file compression built on Huffman algorithms. Analyze, reduce, and understand your data — instantly."
      socialLinks={socialLinks}
      navLinks={navLinks}
      creatorName="Developer"
      creatorUrl="https://github.com"
      brandIcon={<FolderArchive className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-background drop-shadow-lg" />}
    />
  );
}
