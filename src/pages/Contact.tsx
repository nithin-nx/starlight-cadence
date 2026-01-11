import React from 'react';
import { Mail, MapPin, Phone, Send, Github, Linkedin, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const ContactPage: React.FC = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block px-4 py-2 text-xs font-medium tracking-[0.3em] uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-4">
              Contact
            </span>
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-foreground mb-4">
              Get in <span className="text-primary text-glow">Touch</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
              Have questions or want to collaborate? We'd love to hear from you.
            </p>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-16">
            <ScrollReveal>
              <div className="space-y-8">
                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-orbitron font-semibold text-foreground mb-1">Email</h3>
                      <a href="mailto:contact@istegecb.in" className="text-muted-foreground hover:text-primary transition-colors">
                        contact@istegecb.in
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-orbitron font-semibold text-foreground mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        Government Engineering College<br />
                        Barton Hill, Thiruvananthapuram<br />
                        Kerala - 695035
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-orbitron font-semibold text-foreground mb-1">Phone</h3>
                      <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary transition-colors">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-orbitron font-semibold text-foreground mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {[
                      { Icon: Instagram, href: 'https://instagram.com/istegecb', label: 'Instagram' },
                      { Icon: Linkedin, href: 'https://linkedin.com/company/istegecb', label: 'LinkedIn' },
                      { Icon: Twitter, href: 'https://twitter.com/istegecb', label: 'Twitter' },
                      { Icon: Github, href: 'https://github.com/istegecb', label: 'GitHub' },
                    ].map(({ Icon, href, label }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                        aria-label={label}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <form className="glass-card p-8">
                <h3 className="font-orbitron text-xl font-semibold text-foreground mb-6">
                  Send us a Message
                </h3>
                
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
                      placeholder="Write your message..."
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full btn-glow flex items-center justify-center gap-2"
                  >
                    Send Message <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </form>
            </ScrollReveal>
          </div>
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

export default ContactPage;
