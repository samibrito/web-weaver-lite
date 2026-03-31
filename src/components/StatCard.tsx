import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
        <Icon size={28} className="text-primary-foreground" />
      </div>
      <h3 className="text-base font-medium text-card-foreground">{label}</h3>
      <p className="text-3xl font-bold text-card-foreground">{value}</p>
    </div>
  );
};

export default StatCard;
