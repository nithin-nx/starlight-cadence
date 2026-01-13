import React, { useState } from "react";
import StepPersonal from "./StepPersonal";
import StepAcademic from "./StepAcademic";
import StepISTE from "./StepISTE";
import Success from "./Success";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const JoinISTE = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    full_name: "",
    email: "",
    phone: "",
    dob: "",
    department: "",
    year_of_study: "",
    reason: "",
    declaration: false
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const submitApplication = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("membership_applications")
      .insert([
        {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          department: data.department,
          year_of_study: data.year_of_study,
          reason: data.reason
        }
      ]);

    setLoading(false);

    if (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setStep(4);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white pt-28 px-4">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
        <Progress step={step} />

        {step === 1 && (
          <StepPersonal data={data} setData={setData} next={next} />
        )}

        {step === 2 && (
          <StepAcademic
            data={data}
            setData={setData}
            next={next}
            back={back}
          />
        )}

        {step === 3 && (
          <StepISTE
            data={data}
            setData={setData}
            back={back}
            submit={submitApplication}
            loading={loading}
          />
        )}

        {step === 4 && <Success />}
      </div>
    </div>
  );
};

const Progress = ({ step }: { step: number }) => (
  <div className="flex justify-between mb-10 text-sm">
    {["Personal", "Academic", "ISTE", "Done"].map((label, i) => (
      <div
        key={label}
        className={`flex-1 text-center ${
          step >= i + 1 ? "text-primary" : "text-gray-500"
        }`}
      >
        {label}
      </div>
    ))}
  </div>
);

export default JoinISTE;
