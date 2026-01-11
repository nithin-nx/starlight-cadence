import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, Award, BookOpen, Rocket } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const stats = [
  { value: '500+', label: 'Active Members' },
  { value: '50+', label: 'Events Organized' },
  { value: '15+', label: 'Years of Excellence' },
  { value: '100+', label: 'Industry Partners' },
];

const features = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To cultivate technical excellence and innovation among students through hands-on learning experiences and industry collaboration.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a vibrant ecosystem of tech enthusiasts, fostering peer learning and collaborative problem-solving.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Encouraging creative thinking and providing platforms for students to transform ideas into reality.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Striving for the highest standards in technical education and professional development.'
  },
  {
    icon: BookOpen,
    title: 'Learning',
    description: 'Organizing workshops, seminars, and training programs to bridge the gap between academia and industry.'
  },
  {
    icon: Rocket,
    title: 'Growth',
    description: 'Empowering students with skills and opportunities to accelerate their career trajectories.'
  }
];

const AboutPage: React.FC = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block px-4 py-2 text-xs font-medium tracking-[0.3em] uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-4">
              About Us
            </span>
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-foreground mb-4">
              About <span className="text-primary text-glow">ISTE GECB</span>
            </h1>
            <p className="max-w-3xl mx-auto text-muted-foreground text-lg">
              The Indian Society for Technical Education (ISTE) Student Chapter at Government Engineering College Barton Hill 
              is one of the most active and vibrant technical communities in Kerala.
            </p>
          </ScrollReveal>

          <ScrollReveal className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.2)' }}
                  className="glass-card p-6 text-center"
                >
                  <div className="font-orbitron text-3xl md:text-4xl font-bold text-primary text-glow mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <ScrollReveal>
              <div className="space-y-6">
                <h2 className="font-orbitron text-3xl font-bold text-foreground">
                  Who We <span className="text-primary">Are</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Established with a vision to foster technical education and innovation, ISTE GECB has been at the forefront 
                  of organizing impactful events that bridge the gap between theoretical knowledge and practical application.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our chapter brings together students from all engineering disciplines, creating a melting pot of ideas, 
                  skills, and aspirations. From workshops and hackathons to industry visits and technical fests, we provide 
                  diverse opportunities for holistic development.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe in the power of peer learning and collaborative growth. Our initiatives are designed to nurture 
                  not just technical skills but also leadership, communication, and teamwork abilities.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-card p-4">
                    <p className="text-sm text-foreground font-medium">
                      "Innovation distinguishes between a leader and a follower."
                    </p>
                    <p className="text-xs text-primary mt-2">— Steve Jobs</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <section>
            <ScrollReveal className="text-center mb-12">
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-foreground mb-4">
                What We <span className="text-primary text-glow">Stand For</span>
              </h2>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <ScrollReveal key={index} delay={0.1 * index}>
                  <motion.div
                    whileHover={{ 
                      y: -8,
                      boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.2)'
                    }}
                    className="glass-card p-6 h-full"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-orbitron text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
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

export default AboutPage;
