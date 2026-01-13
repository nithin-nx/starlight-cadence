import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MembershipApproval = () => {
  const [apps, setApps] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("membership_applications")
      .select("*")
      .eq("status", "verified");

    setApps(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (app: any) => {
    await supabase
      .from("membership_applications")
      .update({ status: "approved" })
      .eq("id", app.id);

    await supabase
      .from("user_roles")
      .insert({ user_id: app.user_id, role: "public" });

    toast.success("Membership approved");
    load();
  };

  const reject = async (id: string) => {
    await supabase
      .from("membership_applications")
      .update({ status: "rejected" })
      .eq("id", id);

    toast.error("Application rejected");
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-orbitron text-primary mb-6">
        Final Membership Approval
      </h1>

      {apps.map(app => (
        <div key={app.id} className="glass-card p-4 mb-4">
          <p>{app.full_name}</p>

          <div className="flex gap-3 mt-4">
            <Button onClick={() => approve(app)}>
              Approve
            </Button>
            <Button variant="destructive" onClick={() => reject(app.id)}>
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembershipApproval;
