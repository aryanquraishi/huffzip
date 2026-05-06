import { Hero } from '../components/ui/animated-hero';
import ToolsGrid from '../components/home/ToolsGrid';
import StatsBar from '../components/home/StatsBar';
import RealWorldSection from '../components/home/RealWorldSection';

export default function HomePage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-start w-full px-6 pb-0 pt-0 gap-16 md:gap-24">
      <Hero />
      <StatsBar />
      <ToolsGrid />
      <RealWorldSection />
    </main>
  );
}
