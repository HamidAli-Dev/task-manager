import { ArrowRight, CheckCircle, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            TaskFlow
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Modern task management that adapts to your workflow. Stay organized,
            boost productivity, and achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup">
              <Button size="lg" className="flex items-center gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
            <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Lightning Fast
            </h3>
            <p className="text-slate-400">
              Intuitive interface designed for speed and efficiency
            </p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Secure
            </h3>
            <p className="text-slate-400">
              Your data is protected with enterprise-grade security
            </p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
            <CheckCircle className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Organized
            </h3>
            <p className="text-slate-400">
              Keep track of everything with smart categorization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
