import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: number;
  text?: string;
}

const LoadingSpinner = ({ fullScreen = false, size = 40, text = "Loading..." }: LoadingSpinnerProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={size} />
      {text && <p className="mt-4 text-gray-400">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;