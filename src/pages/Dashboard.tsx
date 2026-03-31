import { Building2, Layers, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Building2} label="Departamentos" value={6} />
        <StatCard icon={Layers} label="Padrões" value={18} />
        <StatCard icon={Activity} label="Logs" value={42} />
      </div>
    </div>
  );
};

export default Dashboard;
