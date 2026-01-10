import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const events = [
  {
    id: 1,
    title: 'TechFest 2026',
    date: 'March 15-17, 2026',
    location: 'Main Auditorium',
    category: 'Festival',
    description: 'Annual technical festival featuring competitions, workshops, and exhibitions.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    title: 'AI/ML Workshop',
    date: 'February 20, 2026',
    location: 'CS Lab 201',
    category: 'Workshop',
    description: 'Hands-on workshop on machine learning fundamentals and applications.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 3,
    title: 'Hackathon: Code for Change',
    date: 'February 28, 2026',
    location: 'Innovation Hub',
    category: 'Hackathon',
    description: '24-hour hackathon focused on building solutions for social good.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60'
  }
];

interface EventCardProps {
  event: typeof events[0];
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);
  
  // Image parallax effect
  const imageX = useTransform(mouseXSpring, [-0.5, 0.5], ['5%', '-5%']);
  const imageY = useTransform(mouseYSpring, [-0.5, 0.5], ['5%', '-5%']);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
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
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ 
        y: -12,
        boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.25), 0 0 30px hsl(var(--primary) / 0.15)'
      }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden group cursor-pointer relative"
    >
      {/* Glow Border Effect */}
      <motion.div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3) 0%, transparent 50%, hsl(var(--secondary) / 0.3) 100%)',
          padding: '1px',
        }}
      />
      
      {/* Event Image with Parallax */}
      <div className="relative h-48 overflow-hidden">
        <motion.img 
          src={event.image} 
          alt={event.title}
          style={{ 
            x: imageX, 
            y: imageY,
            scale: 1.1,
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        
        {/* Glowing Category Badge */}
        <motion.span 
          className="absolute top-4 left-4 px-3 py-1 text-xs font-medium uppercase tracking-wider bg-primary text-primary-foreground rounded-full"
          whileHover={{ scale: 1.05 }}
          style={{
            boxShadow: '0 0 15px hsl(var(--primary) / 0.5)'
          }}
        >
          {event.category}
        </motion.span>
      </div>
      
      {/* Event Content */}
      <div className="p-6 relative" style={{ transform: 'translateZ(30px)' }}>
        <h3 className="font-orbitron text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {event.date}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            {event.location}
          </div>
        </div>
        
        <motion.div 
          className="flex items-center text-primary font-medium text-sm"
          whileHover={{ x: 5 }}
        >
          View Details 
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="relative py-24 bg-card/30 overflow-hidden">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-2 text-xs font-medium tracking-[0.3em] uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-4">
            Events
          </span>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upcoming <span className="text-primary text-glow">Events</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Join us for exciting events that will expand your knowledge and connect you with like-minded individuals.
          </p>
        </ScrollReveal>

        {/* Events Grid */}
        <div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: '1000px' }}
        >
          {events.map((event, index) => (
            <ScrollReveal key={event.id} delay={0.1 * index}>
              <EventCard event={event} />
            </ScrollReveal>
          ))}
        </div>

        {/* View All Button */}
        <ScrollReveal delay={0.4} className="text-center mt-12">
          <motion.a 
            href="#all-events" 
            className="btn-glow inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Events
          </motion.a>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default EventsSection;
