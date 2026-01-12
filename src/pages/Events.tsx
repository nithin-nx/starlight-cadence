import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const upcomingEvents = [
  {
    id: 1,
    title: 'AeroQuest',
    date: '12th January 2026',
    time: '4:30 PM',
    location: 'GEC Barton Hill',
    category: 'Quiz',
    description: 'Challenge yourself with engaging aviation-themed quiz questions. Cash prize ₹300!',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    title: 'Workshop on SolidWorks',
    date: '10th January 2026',
    time: '9:30 AM - 4:30 PM',
    location: 'GEC Barton Hill',
    category: 'Workshop',
    description: 'Exclusive hands-on workshop on SolidWorks and AutoCAD in collaboration with INNOVEX.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 3,
    title: 'BotTech',
    date: '11th December 2025',
    time: 'Coming Soon',
    location: 'GEC Barton Hill',
    category: 'Workshop',
    description: 'A glimpse into the world of mechatronics. Build a real robot with no prior experience required.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 4,
    title: 'TechFest 2026',
    date: 'March 15-17, 2026',
    time: 'All Day',
    location: 'Main Auditorium',
    category: 'Festival',
    description: 'Annual technical festival featuring competitions, workshops, and exhibitions.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'
  }
];

const pastEvents = [
  {
    id: 1,
    title: 'Nikola Tesla Scholarship',
    date: '16th October 2025',
    description: 'Cash prize 10K exclusively for 1st years.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    title: 'Engineering with Steel',
    date: '15th October 2025',
    description: 'A talk session on Steel Structures and Industry by Keshav K.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 3,
    title: 'Flight School Visit',
    date: '21st September 2025',
    description: 'Connect with experts from the aviation industry with Flywyzz Aviation.',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 4,
    title: 'Pitch Perfect',
    date: '27th September 2025',
    description: 'Got an idea that can change the game? Pitch it and win cash prize of Rs.500!',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=60'
  }
];

interface EventCardProps {
  event: typeof upcomingEvents[0];
  variant?: 'upcoming' | 'past';
}

const EventCard: React.FC<EventCardProps> = ({ event, variant = 'upcoming' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);
  const imageX = useTransform(mouseXSpring, [-0.5, 0.5], ['3%', '-3%']);
  const imageY = useTransform(mouseYSpring, [-0.5, 0.5], ['3%', '-3%']);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ 
        y: -12,
        boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.25), 0 0 30px hsl(var(--primary) / 0.15)'
      }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden group cursor-pointer w-[280px] sm:w-[320px] md:w-[340px] flex-shrink-0 touch-manipulation"
    >
      <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden">
        <motion.img 
          src={event.image} 
          alt={event.title}
          style={{ x: imageX, y: imageY, scale: 1.1 }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        
        {'category' in event && (
          <motion.span 
            className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium uppercase tracking-wider bg-primary text-primary-foreground rounded-full"
            whileHover={{ scale: 1.05 }}
            style={{ boxShadow: '0 0 15px hsl(var(--primary) / 0.5)' }}
          >
            {event.category}
          </motion.span>
        )}
      </div>
      
      <div className="p-4 sm:p-5 md:p-6" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          {event.date}
        </div>
        
        <h3 className="font-orbitron text-base sm:text-lg md:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {event.description}
        </p>
        
        {variant === 'upcoming' && 'time' in event && (
          <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            <span>🕐 {event.time}</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              {event.location}
            </div>
          </div>
        )}
        
        <motion.div 
          className="flex items-center text-primary font-medium text-xs sm:text-sm"
          whileHover={{ x: 5 }}
        >
          {variant === 'upcoming' ? 'Register Now' : 'View Details'}
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2 transition-transform group-hover:translate-x-2" />
        </motion.div>
      </div>
    </motion.div>
  );
};

interface HorizontalScrollProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({ children, title, subtitle }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            {title} <span className="text-primary text-glow">{subtitle}</span>
          </h2>
        </div>
        
        <div className="hidden sm:flex gap-2">
          <motion.button
            onClick={() => scroll('left')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors touch-manipulation"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
          <motion.button
            onClick={() => scroll('right')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors touch-manipulation"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ 
          perspective: '1000px',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex gap-4 md:gap-6 pl-0">
          {children}
        </div>
      </div>
    </div>
  );
};

const EventsPage: React.FC = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block px-4 py-2 text-xs font-medium tracking-[0.3em] uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-4">
              Events
            </span>
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-foreground mb-4">
              Our <span className="text-primary text-glow">Events</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
              Discover our latest workshops, hackathons, and tech festivals that bring innovation to life.
            </p>
          </ScrollReveal>

          <section className="mb-20">
            <ScrollReveal>
              <HorizontalScroll title="Latest" subtitle="News">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} variant="upcoming" />
                ))}
              </HorizontalScroll>
            </ScrollReveal>
          </section>

          <section>
            <ScrollReveal>
              <HorizontalScroll title="Past" subtitle="Events">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event as any} variant="past" />
                ))}
              </HorizontalScroll>
            </ScrollReveal>
          </section>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/5 bg-card/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="font-orbitron font-bold text-primary text-sm">I</span>
              </div>
              <span className="font-orbitron font-medium text-sm text-foreground">
                ISTE <span className="text-primary">GECB</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 ISTE GEC Barton Hill. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventsPage;
