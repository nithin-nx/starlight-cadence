import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Mail } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const teamMembers = [
  {
    name: 'Alex Johnson',
    role: 'Chairperson',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Sarah Chen',
    role: 'Vice Chairperson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Michael Park',
    role: 'Technical Lead',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Emily Davis',
    role: 'Events Head',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60',
    linkedin: '#',
    github: '#'
  }
];

export const TeamSection: React.FC = () => {
  return (
    <section id="team" className="relative py-24 bg-background overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-primary/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-2 text-xs font-medium tracking-[0.3em] uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-4">
            Our Team
          </span>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet the <span className="text-primary text-glow">Visionaries</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            The passionate individuals driving innovation and excellence at ISTE GECB.
          </p>
        </ScrollReveal>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <ScrollReveal key={index} delay={0.1 * index}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-6 text-center group"
              >
                {/* Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-full h-full object-cover rounded-full border-2 border-white/10 group-hover:border-primary/50 transition-colors"
                  />
                </div>
                
                {/* Info */}
                <h3 className="font-orbitron text-lg font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary text-sm font-medium mb-4">
                  {member.role}
                </p>
                
                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  <motion.a
                    href={member.linkedin}
                    whileHover={{ scale: 1.1 }}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    href={member.github}
                    whileHover={{ scale: 1.1 }}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@istegecb.in`}
                    whileHover={{ scale: 1.1 }}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
