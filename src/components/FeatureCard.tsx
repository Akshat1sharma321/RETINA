
import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 border border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 group",
      className
    )}>
      <CardHeader className="p-6">
        <div className="w-12 h-12 bg-navi-600/40 flex items-center justify-center rounded-lg mb-4 text-navi-400 group-hover:text-navi-300 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-medium text-white mb-1">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
