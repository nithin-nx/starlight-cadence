import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Github, X, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

interface TeamMember {
  name: string;
  role: string;
  department?: string;
  image: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  phone?: string;
  whatsapp?: string;
  bio: string;
  skills: string[];
}

const executiveTeam: TeamMember[] = [
  {
    name: 'Alex Johnson',
    role: 'Chairperson',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    bio: 'Passionate about building inclusive tech communities. Leading ISTE GECB with a vision to empower the next generation of innovators.',
    skills: ['Leadership', 'Event Management', 'Public Speaking']
  },
  {
    name: 'Sarah Chen',
    role: 'Vice Chairperson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    website: 'https://sarahchen.dev',
    bio: 'Full-stack developer with a keen interest in AI/ML. Focused on bridging the gap between theory and practice.',
    skills: ['Full-Stack Development', 'AI/ML', 'Workshop Design']
  },
  {
    name: 'Michael Park',
    role: 'Technical Lead',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    bio: 'Open source enthusiast and competitive programmer. Organizing hackathons and coding competitions.',
    skills: ['System Design', 'Competitive Programming', 'DevOps']
  },
  {
    name: 'Emily Davis',
    role: 'Events Head',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    bio: 'Creative event strategist with experience in organizing large-scale tech festivals.',
    skills: ['Event Planning', 'Marketing', 'Community Building']
  }
];

const departmentReps: TeamMember[] = [
  {
    name: 'Jyothish Kumar JS',
    role: 'Dept. Representative',
    department: 'ECE',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=60',
    whatsapp: '+919876543210',
    phone: '+919876543210',
    bio: 'ECE Department representative passionate about electronics and communication.',
    skills: ['Electronics', 'Communication Systems']
  },
  {
    name: 'Gowri A S',
    role: 'Dept. Representative',
    department: 'CE',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60',
    whatsapp: '+919876543211',
    phone: '+919876543211',
    bio: 'Civil Engineering representative focused on sustainable infrastructure.',
    skills: ['Civil Engineering', 'Project Management']
  },
  {
    name: 'Sneha S R',
    role: 'Dept. Representative',
    department: 'EEE',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60',
    whatsapp: '+919876543212',
    phone: '+919876543212',
    bio: 'Electrical Engineering enthusiast with expertise in power systems.',
    skills: ['Electrical Engineering', 'Power Systems']
  },
  {
    name: 'Gokul Krishna G',
    role: 'Dept. Representative',
    department: 'EEE',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=60',
    whatsapp: '+919876543213',
    phone: '+919876543213',
    bio: 'EEE representative with focus on renewable energy solutions.',
    skills: ['Renewable Energy', 'Circuit Design']
  },
  {
    name: 'B J Thejas',
    role: 'Dept. Representative',
    department: 'ME',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60',
    whatsapp: '+919876543214',
    phone: '+919876543214',
    bio: 'Mechanical Engineering rep passionate about robotics and automation.',
    skills: ['Mechanical Engineering', 'Robotics']
  },
  {
    name: 'Arjun Menon',
    role: 'Dept. Representative',
    department: 'CSE',
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&auto=format&fit=crop&q=60',
    whatsapp: '+919876543215',
    phone: '+919876543215',
    bio: 'Computer Science rep with expertise in web development and AI.',
    skills: ['Web Development', 'Artificial Intelligence']
  }
];

interface TeamModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ member, isOpen, onClose }) => {
  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-card max-w-lg w-full p-0 overflow-hidden pointer-events-auto border border-primary/20">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.3)_0%,_transparent_70%)]" />
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary blur-xl opacity-50" />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative w-32 h-32 rounded-full object-cover border-4 border-card"
                    />
                  </div>
                </motion.div>
              </div>
              
              <div className="pt-20 pb-8 px-8 text-center">
                <h3 className="font-orbitron text-2xl font-bold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-1">
                  {member.role}
                </p>
                {member.department && (
                  <p className="text-muted-foreground text-sm mb-4">
                    {member.department} Department
                  </p>
                )}
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {member.bio}
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {member.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/30 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-center gap-3">
                  {member.whatsapp && (
                    <motion.a
                      href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </motion.a>
                  )}
                  {member.phone && (
                    <motion.a
                      href={`tel:${member.phone}`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      Call
                    </motion.a>
                  )}
                  {member.linkedin && (
                    <motion.a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </motion.a>
                  )}
                  {member.github && (
                    <motion.a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
      const scrollAmount = 300;
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
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface TeamCardProps {
  member: TeamMember;
  onClick: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ 
        y: -10,
        boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.3)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-4 sm:p-6 text-center group cursor-pointer w-[240px] sm:w-[280px] flex-shrink-0 hover:border-primary/30 transition-colors touch-manipulation snap-start"
    >
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4">
        <motion.div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary blur-lg"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.6 }}
          transition={{ duration: 0.3 }}
        />
        <img
          src={member.image}
          alt={member.name}
          className="relative w-full h-full object-cover rounded-2xl border-2 border-white/10 group-hover:border-primary/50 transition-all duration-300"
          loading="lazy"
        />
      </div>
      
      <h3 className="font-orbitron text-sm sm:text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
        {member.name}
      </h3>
      <p className="text-primary text-xs sm:text-sm font-medium mb-1">
        {member.role}
      </p>
      {member.department && (
        <p className="text-muted-foreground text-xs mb-3 sm:mb-4">
          {member.department} Dept.
        </p>
      )}
      
      <div className="flex justify-center gap-2 flex-wrap">
        {member.whatsapp && (
          <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] sm:text-xs">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </div>
        )}
        {member.phone && (
          <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] sm:text-xs">
            <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            Call
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TeamPage: React.FC = () => {
  useSmoothScroll();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block px-4 py-2 text-xs font-medium tracking-[0.3em] uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-4">
              Our Team
            </span>
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-foreground mb-4">
              Meet the <span className="text-primary text-glow">Crew</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
              The passionate individuals behind ISTE GECB, working together to create amazing experiences.
            </p>
          </ScrollReveal>

          <section className="mb-20">
            <ScrollReveal>
              <HorizontalScroll title="Executive" subtitle="Team">
                {executiveTeam.map((member, index) => (
                  <TeamCard key={index} member={member} onClick={() => openModal(member)} />
                ))}
              </HorizontalScroll>
            </ScrollReveal>
          </section>

          <section>
            <ScrollReveal>
              <HorizontalScroll title="Department" subtitle="Representatives">
                {departmentReps.map((member, index) => (
                  <TeamCard key={index} member={member} onClick={() => openModal(member)} />
                ))}
              </HorizontalScroll>
            </ScrollReveal>
          </section>
        </div>
      </main>

      <TeamModal member={selectedMember} isOpen={isModalOpen} onClose={closeModal} />

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

export default TeamPage;
