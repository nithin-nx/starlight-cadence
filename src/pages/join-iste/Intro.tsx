import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { 
  ChevronRight, 
  Sparkles, 
  Users, 
  Award, 
  Target, 
  BookOpen, 
  MessageSquare,
  Home,
  ArrowLeft,
  User,
  Calendar
} from "lucide-react";

const features = [
  {
    title: "Hands-on Project Experience",
    desc: "Engage in real-world technical challenges with expert guidance and industry-standard resources, preparing you for professional engineering environments.",
    icon: <Target className="w-6 h-6" />
  },
  {
    title: "Quality Training & Guidance",
    desc: "Participate in workshops, hackathons, and expert-led technical sessions to strengthen your core competencies and practical skills.",
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    title: "Networking Opportunities",
    desc: "Build connections with peers, alumni, industry professionals, and academic institutions through state and national level collaborations.",
    icon: <Users className="w-6 h-6" />
  },
  {
    title: "Research Culture",
    desc: "Develop a research-oriented mindset with mentorship for academic publications, conference participation, and higher studies guidance.",
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    title: "Certification & Recognition",
    desc: "Receive official ISTE certifications and letterheads validating your technical contributions, leadership, and organizational roles.",
    icon: <Award className="w-6 h-6" />
  },
  {
    title: "Communication & Leadership",
    desc: "Enhance soft skills, leadership qualities, and management capabilities through event coordination and team collaborations.",
    icon: <MessageSquare className="w-6 h-6" />
  }
];

// Clean Navigation Component
const CleanNavigation = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed top-6 right-6 z-40"
    >
      <div className="flex items-center gap-3">
        {/* Dashboard Button */}
        <motion.button
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 px-4 py-3 bg-gray-800/80 backdrop-blur-md border border-gray-700/30 rounded-lg hover:border-primary/40 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{ rotate: isHovered ? -5 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Home className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
          </motion.div>
          <span className="text-sm font-medium text-gray-300 group-hover:text-white">
            Dashboard
          </span>
        </motion.button>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => navigate("/events")}
            className="p-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/20 rounded-lg hover:bg-gray-700/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="w-4 h-4 text-gray-400" />
          </motion.button>
          
          <motion.button
            onClick={() => navigate("/profile")}
            className="p-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/20 rounded-lg hover:bg-gray-700/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Intro = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-background text-white overflow-hidden">
      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-cyan-500/3"
        />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl" />
      </div>

      {/* Clean Navigation */}
      <CleanNavigation />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700/30 mb-6"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-gray-300">GEC Idukki Chapter</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                JOIN ISTE
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6 leading-relaxed">
              Indian Society for Technical Education at{" "}
              <span className="font-semibold text-white">GEC Idukki</span>
            </p>

            {/* Description */}
            <p className="text-gray-400 max-w-2xl mx-auto mb-10">
              A premier technical community fostering innovation, collaboration, 
              and professional growth through hands-on experience.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              

              <motion.button
                onClick={() => navigate("/about")}
                className="group flex items-center justify-center px-8 py-3.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 text-gray-300 rounded-lg font-medium hover:bg-gray-700/50 hover:text-white transition-all duration-300 w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.button>
            </div>

            
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
            
            <h2 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Why Join ISTE?
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive benefits designed to accelerate your technical career and personal development
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:border-primary/40 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/15 to-cyan-500/15 border border-primary/20">
                  <div className="text-primary">
                    {item.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: "500+", label: "Members" },
              { value: "50+", label: "Projects" },
              { value: "20+", label: "Partners" },
              { value: "100%", label: "Growth Focus" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-4 bg-gray-800/20 backdrop-blur-sm border border-gray-700/20 rounded-lg"
              >
                <div className="text-2xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-8 sm:p-12 text-center"
          >
            {/* Content */}
            <div className="relative z-10">
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                  Ready to Begin?
                </span>
              </h2>

              {/* Description */}
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Join our community of engineers and innovators at GEC Idukki. 
                Take the first step toward your professional growth today.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  onClick={() => navigate("/join-iste/form")}
                  className="group flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-primary to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="mr-2 w-4 h-4" />
                  Register Now
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  onClick={() => navigate("/contact")}
                  className="group flex items-center justify-center px-8 py-3.5 bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 text-gray-300 rounded-lg font-medium hover:bg-gray-600/50 hover:text-white transition-all duration-300 w-full sm:w-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Us
                </motion.button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-700/30">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>₹500 Registration Fee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Instant Confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <span>All Years Welcome</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back to Top Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700/30 rounded-lg hover:bg-gray-700/80 transition-colors z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-4 h-4 text-gray-400 rotate-90" />
      </motion.button>

      {/* Footer */}
      <footer className="relative py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-500 text-sm">
                © 2024 ISTE GEC Idukki. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate("/privacy")}
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                Privacy Policy
              </motion.button>
              <motion.button
                onClick={() => navigate("/terms")}
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                Terms of Service
              </motion.button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Intro;