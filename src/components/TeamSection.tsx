import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Github, Mail, X, Twitter, Globe } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { TiltCard } from './TiltCard';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  github: string;
  twitter?: string;
  website?: string;
  bio: string;
  skills: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: 'Alex Johnson',
    role: 'Chairperson',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    bio: 'Passionate about building inclusive tech communities. Leading ISTE GECB with a vision to empower the next generation of innovators through hands-on learning and industry collaboration.',
    skills: ['Leadership', 'Event Management', 'Public Speaking', 'Strategic Planning']
  },
  {
    name: 'Sarah Chen',
    role: 'Vice Chairperson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    website: 'https://sarahchen.dev',
    bio: 'Full-stack developer with a keen interest in AI/ML. Focused on bridging the gap between theoretical knowledge and practical industry skills through innovative workshop programs.',
    skills: ['Full-Stack Development', 'AI/ML', 'Workshop Design', 'Mentorship']
  },
  {
    name: 'Michael Park',
    role: 'Technical Lead',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    bio: 'Open source enthusiast and competitive programmer. Organizing hackathons and coding competitions to foster a culture of innovation and collaborative problem-solving.',
    skills: ['System Design', 'Competitive Programming', 'Open Source', 'DevOps']
  },
  {
    name: 'Emily Davis',
    role: 'Events Head',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    bio: 'Creative event strategist with experience in organizing large-scale tech festivals. Dedicated to creating memorable experiences that inspire and educate our community.',
    skills: ['Event Planning', 'Marketing', 'Community Building', 'Content Strategy']
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              duration: 0.4 
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-card max-w-lg w-full p-0 overflow-hidden pointer-events-auto border border-primary/20">
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              {/* Header with Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
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
              
              {/* Content */}
              <div className="pt-20 pb-8 px-8 text-center">
                <motion.h3 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="font-orbitron text-2xl font-bold text-foreground mb-1"
                >
                  {member.name}
                </motion.h3>
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-primary font-medium mb-4"
                >
                  {member.role}
                </motion.p>
                
                {/* Bio */}
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-muted-foreground text-sm leading-relaxed mb-6"
                >
                  {member.bio}
                </motion.p>
                
                {/* Skills */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-2 mb-6"
                >
                  {member.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/30 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </motion.div>
                
                {/* Social Links */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex justify-center gap-3"
                >
                  <motion.a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                  {member.twitter && (
                    <motion.a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </motion.a>
                  )}
                  {member.website && (
                    <motion.a
                      href={member.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                    </motion.a>
                  )}
                  <motion.a
                    href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@istegecb.in`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const TeamSection: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

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
            The passionate individuals driving innovation and excellence at ISTE GECB. Click on a member to learn more.
          </p>
        </ScrollReveal>

        {/* Team Grid */}
        <div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          style={{ perspective: '1000px' }}
        >
          {teamMembers.map((member, index) => (
            <ScrollReveal key={index} delay={0.1 * index}>
              <TiltCard>
                <motion.div
                  onClick={() => handleMemberClick(member)}
                  whileHover={{ 
                    y: -10,
                    boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.3)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-6 text-center group cursor-pointer hover:border-primary/30 transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary blur-lg"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.6 }}
                      transition={{ duration: 0.3 }}
                    />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative w-full h-full object-cover rounded-full border-2 border-white/10 group-hover:border-primary/50 transition-all duration-300 group-hover:scale-105"
                    />
                    {/* Click Indicator */}
                    <motion.div 
                      className="absolute inset-0 rounded-full flex items-center justify-center bg-primary/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-xs font-medium text-primary-foreground bg-primary px-2 py-1 rounded-full">
                        View Profile
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Info */}
                  <h3 className="font-orbitron text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mb-4">
                    {member.role}
                  </p>
                  
                  {/* Social Links Preview */}
                  <div className="flex justify-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                      <Github className="w-4 h-4" />
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Team Member Modal */}
      <TeamModal 
        member={selectedMember} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </section>
  );
};

export default TeamSection;
