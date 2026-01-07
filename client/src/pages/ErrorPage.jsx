import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Button from "../components/ui/Button";
import PageContainer from "../components/layout/PageContainer";

const ErrorPage = ({ error, onRetry, onGoHome }) => {
  return (
    <PageContainer className="flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="text-red-400 mb-6">
            <AlertTriangle className="h-16 w-16 mx-auto" />
          </div>

          <h1 className="text-2xl font-bold text-slate-100 mb-4">
            Something went wrong
          </h1>

          <p className="text-slate-400 mb-6">
            {error?.message ||
              "An unexpected error occurred. Please try again."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onRetry}
              className="flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            <Button
              variant="secondary"
              onClick={onGoHome}
              className="flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ErrorPage;
