import Navbar from '@/components/Navbar';
import { FuturisticAlienHero } from '@/components/ui/futuristic-alien-hero';
import AboutSection from '@/components/AboutSection';
import EventsSection from '@/components/EventsSection';
import TeamSection from '@/components/TeamSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="home">
        <FuturisticAlienHero 
          title="ISTE"
          subtitle="GEC Barton Hill"
          ctaText="Join Chapter"
          ctaHref="#join"
        />
        <AboutSection />
        <EventsSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
