import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Users, Calendar, Lightbulb, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { TiltCard } from './TiltCard';

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
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const leftSlideVariants = {
    hidden: { opacity: 0, x: -80 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 0.86, 0.39, 0.96] as const
      }
    }
  };

  const rightFadeVariants = {
    hidden: { opacity: 0, x: 80 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 0.86, 0.39, 0.96] as const
      }
    }
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 0.86, 0.39, 0.96] as const
      }
    }
  };

  return (
    <section ref={sectionRef} id="about" className="relative py-24 bg-background overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header with Split Animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-12 items-center mb-20"
        >
          {/* Left side - Text slides in from left */}
          <motion.div variants={leftSlideVariants}>
            <span className="inline-block px-4 py-2 text-xs font-medium tracking-[0.3em] uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-4">
              About Us
            </span>
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-foreground mb-6">
              Shaping Tomorrow's <span className="text-primary text-glow">Innovators</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              ISTE GEC Barton Hill is a vibrant community of tech enthusiasts, innovators, and future leaders 
              dedicated to fostering excellence in technical education.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Since our inception, we've been at the forefront of technical innovation, 
              organizing workshops, hackathons, and events that bridge the gap between 
              academic learning and industry requirements.
            </p>
          </motion.div>

          {/* Right side - Image fades in from right */}
          <motion.div variants={rightFadeVariants} className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80" 
                alt="ISTE Team Collaboration"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute inset-0 bg-primary/10" />
            </div>
            {/* Floating Stats Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 glass-card p-4 border border-primary/30"
            >
              <div className="font-orbitron text-3xl font-bold text-primary text-glow">10+</div>
              <div className="text-sm text-muted-foreground">Years of Excellence</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-20"
        >
          <div className="glass-card p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              >
                <div className="font-orbitron text-4xl md:text-5xl font-bold text-primary text-glow mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid with Tilt Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ perspective: '1000px' }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeUpVariants}
              custom={index}
            >
              <TiltCard className="h-full">
                <div className="glass-card p-6 h-full group cursor-pointer hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
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
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
