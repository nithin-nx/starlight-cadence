import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full glass-card p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center">
            <ShieldAlert className="text-destructive w-8 h-8" />
          </div>
        </div>

        <h1 className="font-orbitron text-2xl text-foreground mb-2">
          Access Denied
        </h1>

        <p className="text-muted-foreground mb-6">
          You do not have permission to view this page.
          Please contact the administrator if you believe this is a mistake.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="btn-glow text-center py-3"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
