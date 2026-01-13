import useUserRole from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";

const Overview = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-orbitron text-primary mb-6">
        Welcome {user?.email}
      </h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="glass-card p-6">Membership Status</div>
        <div className="glass-card p-6">Total Events</div>
        <div className="glass-card p-6">Certificates</div>
        <div className="glass-card p-6">Notifications</div>
      </div>
    </div>
  );
};

export default Overview;
