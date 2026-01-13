import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackToHome = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="
        flex items-center gap-2
        text-gray-300 hover:text-cyan-400
        transition-colors duration-300
        absolute top-6 left-6
      "
    >
      <ArrowLeft size={18} />
      <span className="text-sm font-medium">Back to Home</span>
    </button>
  );
};

export default BackToHome;
