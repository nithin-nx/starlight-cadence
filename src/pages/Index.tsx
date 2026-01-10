import Navbar from '@/components/Navbar';
import { FuturisticAlienHero } from '@/components/ui/futuristic-alien-hero';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const Index = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="home">
        <FuturisticAlienHero 
          title="ISTE"
          subtitle="GEC Barton Hill"
          ctaText="Join Chapter"
          ctaHref="/events"
        />
      </main>
    </div>
  );
};

export default Index;
