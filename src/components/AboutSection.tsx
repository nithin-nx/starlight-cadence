import React from 'react';
import { motion } from 'framer-motion';
import { Code, Users, Calendar, Lightbulb, ChevronRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const features = [
  {
    icon: Code,
    title: 'Technical Workshops',
    description: 'Hands-on sessions on cutting-edge technologies, frameworks, and tools used in the industry.'
  },
  {
    icon: Users,
    title: 'Networking Events',
    description: 'Connect with industry professionals, alumni, and fellow tech enthusiasts.'
  },
  {
    icon: Calendar,
    title: 'Hackathons & Competitions',
    description: 'Participate in coding challenges, hackathons, and technical competitions.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation Projects',
    description: 'Work on real-world projects that make a difference in the community.'
  }
];

const stats = [
  { value: '500+', label: 'Active Members' },
  { value: '50+', label: 'Events Annually' },
  { value: '20+', label: 'Industry Partners' },
  { value: '10+', label: 'Years of Excellence' }
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 bg-background overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-2 text-xs font-medium tracking-[0.3em] uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-4">
            About Us
          </span>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-foreground mb-4">
            Shaping Tomorrow's <span className="text-primary text-glow">Innovators</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            ISTE GEC Barton Hill is a vibrant community of tech enthusiasts, innovators, and future leaders 
            dedicated to fostering excellence in technical education.
          </p>
        </ScrollReveal>

        {/* Stats Row */}
        <ScrollReveal delay={0.2} className="mb-20">
          <div className="glass-card p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-orbitron text-4xl md:text-5xl font-bold text-primary text-glow mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={0.1 * index}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-6 h-full group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-orbitron text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
