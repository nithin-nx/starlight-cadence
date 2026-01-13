import { useState, useRef, ChangeEvent, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FormInput, FormSelect } from "./FormFields";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  CreditCard, 
  QrCode,
  ChevronRight,
  Shield,
  Loader2
} from "lucide-react";

interface FormData {
  full_name: string;
  dob: string;
  year_of_study: string;
  branch: string;
  phone: string;
  email: string;
}

const Form = () => {
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Track if it's the initial load
  const [initialLoad, setInitialLoad] = useState(true);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<FormData>({
    full_name: "",
    dob: "",
    year_of_study: "",
    branch: "",
    phone: "",
    email: ""
  });

  // Scroll to top only on initial load
  useEffect(() => {
    if (initialLoad) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setInitialLoad(false);
    }
  }, [initialLoad]);

  // Optional: Reset initial load when component mounts again (on route change)
  useEffect(() => {
    setInitialLoad(true);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!data.dob) newErrors.dob = "Date of birth is required";
    if (!data.year_of_study) newErrors.year_of_study = "Please select year";
    if (!data.branch) newErrors.branch = "Please select branch";
    if (!data.phone.trim() || data.phone.length !== 10) 
      newErrors.phone = "Valid 10-digit phone number required";
    if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = "Valid email address required";
    if (!file) newErrors.file = "Payment screenshot is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all fields and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload file to Supabase Storage if needed
      let fileUrl = "";
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        fileUrl = fileName;
      }

      const { error } = await supabase
        .from("membership_applications")
        .insert([
          {
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            department: data.branch,
            year_of_study: data.year_of_study,
            dob: data.dob,
            payment_proof_url: fileUrl,
            status: "pending"
          }
        ]);

      if (error) throw error;

      toast({
        title: "Application Submitted Successfully",
        description: "Your application has been sent to the ISTE Executive Committee.",
      });

      // Reset form
      setData({
        full_name: "",
        dob: "",
        year_of_study: "",
        branch: "",
        phone: "",
        email: ""
      });
      setFile(null);
      setErrors({});
      
      // Scroll to top after successful submission (optional)
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size (4MB)
    if (selectedFile.size > 4 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 4MB.",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setErrors(prev => ({ ...prev, file: "" }));
  };

  return (
    <div ref={formContainerRef} className="relative min-h-screen bg-gradient-to-b from-gray-900 to-background">
      {/* Navigation - Fixed but doesn't cause scroll */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 right-6 z-40"
      >
        <button
          onClick={() => window.history.back()}
          className="group flex items-center gap-2 px-4 py-3 bg-gray-800/80 backdrop-blur-md border border-gray-700/30 rounded-lg hover:border-primary/40 transition-all duration-300"
        >
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary rotate-180 transition-colors" />
          <span className="text-sm font-medium text-gray-300 group-hover:text-white">
            Go Back
          </span>
        </button>
      </motion.div>

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Secure Application</span>
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              ISTE Membership Registration
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Complete your membership application in a few simple steps
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6 sm:p-8"
          >
            {/* Form Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Personal Details</span>
                <span>Step 1 of 2</span>
              </div>
              <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-cyan-500"
                  initial={{ width: "50%" }}
                  animate={{ width: file ? "100%" : "50%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <FormInput
                    label="Full Name *"
                    value={data.full_name}
                    onChange={(value) => handleInputChange("full_name", value)}
                    error={errors.full_name}
                  />
                </div>
                
                
                <div>
                  <FormInput
                    type="date"
                    label="Date of Birth *"
                    value={data.dob}
                    onChange={(value) => handleInputChange("dob", value)}
                    error={errors.dob}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <FormSelect
                    label="Year of Study *"
                    value={data.year_of_study}
                    options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
                    onChange={(value) => handleInputChange("year_of_study", value)}
                    error={errors.year_of_study}
                  />
                </div>

                
                <div>
                  <FormSelect
                    label="Branch of Study *"
                    value={data.branch}
                    options={["CSE", "ECE", "EEE", "ME", "CE"]}
                    onChange={(value) => handleInputChange("branch", value)}
                    error={errors.branch}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <FormInput
                    label="Phone Number *"
                    value={data.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                    placeholder="10-digit mobile number"
                    error={errors.phone}
                  />
                </div>
                
                <div>
                  <FormInput
                    type="email"
                    label="Email Address *"
                    value={data.email}
                    onChange={(value) => handleInputChange("email", value)}
                    placeholder="student@gecidukki.ac.in"
                    error={errors.email}
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Payment Details</h2>
              </div>

              {/* Amount Box */}
              <div className="bg-gradient-to-r from-primary/10 to-cyan-500/5 border border-primary/20 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Membership Fee</p>
                    <p className="text-2xl font-bold text-primary">₹500</p>
                    <p className="text-sm text-gray-400 mt-1">ISTE + Full Membership</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  {showQR ? "Hide Payment Details" : "Show Payment Details"}
                </button>

                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-800/30 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-400">Account Holder</p>
                          <p className="font-medium">Krishnapriya R</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">IFSC Code</p>
                          <p className="font-medium">SBIN0070259</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Account Number</p>
                          <p className="font-medium">44148248108</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">UPI ID</p>
                          <p className="font-medium">krishnapriyarmalu-1@okicici</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <img
                          src="/qr.jpeg"
                          alt="Payment QR Code"
                          className="mx-auto w-48 rounded-lg border border-gray-700/50"
                        />
                        <p className="text-sm text-gray-400 mt-2">Scan to pay via UPI</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* File Upload */}
              <div className="mt-8">
                <label className="block text-sm font-medium mb-4">
                  Payment Proof *
                  <span className="text-gray-400 ml-2">(Screenshot of successful payment)</span>
                </label>

                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-gray-600 hover:border-primary/40 rounded-xl p-8 text-center transition-colors"
                  >
                    {file ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <p className="font-medium">Click to upload payment proof</p>
                        <p className="text-sm text-gray-400">
                          Supports JPG, PNG, PDF (Max 4MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {errors.file && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.file}
                    </div>
                  )}
                </div>
              </div>

              {/* Important Note */}
              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <p className="text-sm text-blue-300">
                    Your application will be reviewed by the ISTE Executive Committee. 
                    You'll receive confirmation via email within 24-48 hours.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-8 py-4 bg-gradient-to-r from-primary to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Footer Note */}
              <p className="text-center text-sm text-gray-500 mt-6">
                By submitting, you agree to ISTE's terms and conditions
              </p>
            </div>
          </motion.div>

          {/* Status Indicators */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: Shield, label: "Secure Submission", desc: "Encrypted & safe" },
              { icon: CheckCircle, label: "Instant Review", desc: "24-48 hours" },
              { icon: AlertCircle, label: "Support", desc: "Contact ISTE team" }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-800/20 rounded-lg">
                <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;