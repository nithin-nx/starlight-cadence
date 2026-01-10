import React from 'react';
import { motion } from 'framer-motion';
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <ScrollReveal key={event.id} delay={0.1 * index}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="glass-card overflow-hidden group cursor-pointer"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
                    {event.category}
                  </span>
                </div>
                
                {/* Event Content */}
                <div className="p-6">
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
                  
                  <div className="flex items-center text-primary font-medium text-sm group-hover:underline">
                    View Details <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* View All Button */}
        <ScrollReveal delay={0.4} className="text-center mt-12">
          <a href="#all-events" className="btn-glow inline-block">
            View All Events
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default EventsSection;
