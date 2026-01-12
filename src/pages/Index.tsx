import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, Target, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { FuturisticAlienHero } from '@/components/ui/futuristic-alien-hero';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

// Preview data
const upcomingEvents = [
  {
    id: 1,
    title: 'AeroQuest',
    date: '12th January 2026',
    category: 'Quiz',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    title: 'Workshop on SolidWorks',
    date: '10th January 2026',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 3,
    title: 'BotTech',
    date: '11th December 2025',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60'
  }
];

const teamPreview = [
  {
    name: 'Alex Johnson',
    role: 'Chairperson',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Sarah Chen',
    role: 'Vice Chairperson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Michael Park',
    role: 'Technical Lead',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Emily Davis',
    role: 'Events Head',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60'
  }
];

const stats = [
  { value: '500+', label: 'Active Members' },
  { value: '50+', label: 'Events Organized' },
  { value: '15+', label: 'Years of Excellence' },
  { value: '100+', label: 'Industry Partners' },
];

const Index = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <main id="home">
        <FuturisticAlienHero 
          title="ISTE"
          subtitle="GEC IDUKKI"
          ctaText="Join Chapter"
          ctaHref="/events"
        />
      </main>

      {/* About Preview Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <span className="inline-block px-4 py-2 text-xs font-medium tracking-[0.3em] uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-4">
              About Us
            </span>
            <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-foreground mb-4">
              Who We <span className="text-primary text-glow">Are</span>
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
              The Indian Society for Technical Education (ISTE) Student Chapter at GEC IDUKKI
              is one of the most active and vibrant technical communities in Kerala.
            </p>
          </ScrollReveal>

          <ScrollReveal className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.2)' }}
                  className="glass-card p-6 text-center"
                >
                  <div className="font-orbitron text-2xl md:text-3xl font-bold text-primary text-glow mb-1">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-xs md:text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal className="text-center">
            <Link to="/about">
              <motion.span
                whileHover={{ x: 5 }}
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Learn more about us <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Events Preview Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <ScrollReveal className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-foreground">
                Latest <span className="text-primary text-glow">Events</span>
              </h2>
            </div>
            <Link to="/events">
              <motion.span
                whileHover={{ x: 5 }}
                className="hidden md:inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                View all events <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {upcomingEvents.map((event, index) => (
              <ScrollReveal key={event.id} delay={0.1 * index}>
                <motion.div
                  whileHover={{ 
                    y: -10,
                    boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.25)'
                  }}
                  className="bg-card border border-border/40 rounded-xl overflow-hidden group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <div className="p-5 bg-card">
                    <div className="flex items-center gap-2 text-sm text-primary mb-2">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {event.title}
                    </h3>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center md:hidden">
            <Link to="/events">
              <motion.span
                whileHover={{ x: 5 }}
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                View all events <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Team Preview Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <ScrollReveal className="flex items-start justify-between mb-12">
            <div className="flex-1">
              <span className="inline-block px-4 py-2 text-xs font-semibold tracking-wider uppercase text-foreground border border-primary rounded-lg bg-transparent mb-4">
                OUR TEAM
              </span>
              <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-foreground">
                Meet the <span className="text-primary text-glow">Crew</span>
              </h2>
            </div>
            <Link to="/team" className="hidden md:block">
              <motion.span
                whileHover={{ x: 5 }}
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                View full team <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {teamPreview.map((member, index) => (
              <ScrollReveal key={index} delay={0.1 * index}>
                <motion.div
                  whileHover={{ 
                    y: -10,
                    boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.3)'
                  }}
                  className="bg-card border border-border/40 rounded-xl p-5 text-center group cursor-pointer"
                >
                  <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full border-2 border-border/40 group-hover:border-primary/50 transition-all"
                    />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium">
                    {member.role}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center md:hidden">
            <Link to="/team">
              <motion.span
                whileHover={{ x: 5 }}
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                View full team <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Preview Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <span className="inline-block px-4 py-2 text-xs font-semibold tracking-wider uppercase text-foreground border border-primary rounded-lg bg-transparent mb-4">
              CONTACT
            </span>
            <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-foreground mb-4">
              Get in <span className="text-primary text-glow">Touch</span>
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              Have questions or want to collaborate? We'd love to hear from you.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-card border border-border/40 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-lg border border-primary flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-foreground text-sm">contact@istegecb.in</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-card border border-border/40 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-lg border border-primary flex items-center justify-center mx-auto mb-4">
                  <Target className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Location</h3>
                <p className="text-foreground text-sm">GEC Barton Hill, Kerala</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-card border border-border/40 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-lg border border-primary flex items-center justify-center mx-auto mb-4">
                  <Users className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Community</h3>
                <p className="text-foreground text-sm">500+ Active Members</p>
              </motion.div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="text-center">
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg border-2 border-primary text-foreground font-semibold uppercase tracking-wider bg-transparent hover:bg-primary/10 transition-all"
              >
                CONTACT US <ArrowRight className="w-4 h-4 ml-2 inline" />
              </motion.button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-card/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="font-orbitron font-bold text-primary text-sm">I</span>
              </div>
              <span className="font-orbitron font-medium text-sm text-foreground">
                ISTE <span className="text-primary">GECI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 ISTE GEC IDUKKI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
