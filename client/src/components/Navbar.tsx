import { motion } from "framer-motion";
import { Brain, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className = "" }: NavbarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-card/90 backdrop-blur-2xl border-b border-border/50 shadow-card ${className}`}
    >
      <div className="medical-container">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground group-hover:text-primary-glow transition-colors">
                MedAnalyze
              </span>
            </motion.div>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <Link to="/">
              <Button
                variant="ghost"
                className={`transition-colors font-medium ${
                  isActive("/")
                    ? "text-primary-glow bg-primary-soft border border-primary/20 rounded-lg px-4"
                    : "text-muted-foreground hover:text-primary-glow"
                }`}
              >
                Home
              </Button>
            </Link>

            <Link to="/about">
              <Button
                variant="ghost"
                className={`transition-colors font-medium ${
                  isActive("/about")
                    ? "text-primary-glow bg-primary-soft border border-primary/20 rounded-lg px-4"
                    : "text-muted-foreground hover:text-primary-glow"
                }`}
              >
                About
              </Button>
            </Link>

            <Link to="/upload">
              <Button
                variant="ghost"
                className={`transition-colors font-medium ${
                  isActive("/upload")
                    ? "text-primary-glow bg-primary-soft border border-primary/20 rounded-lg px-4"
                    : "text-muted-foreground hover:text-primary-glow"
                }`}
              >
                Upload
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button
                variant="ghost"
                className={`transition-colors font-medium ${
                  isActive("/dashboard")
                    ? "text-primary-glow bg-primary-soft border border-primary/20 rounded-lg px-4"
                    : "text-muted-foreground hover:text-primary-glow"
                }`}
              >
                Dashboard
              </Button>
            </Link>

            <Link to="/auth/sign-in">
              <Button className="btn-medical-primary group">
                <Shield className="w-4 h-4 mr-2" />
                Log In/Sign Up
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};
