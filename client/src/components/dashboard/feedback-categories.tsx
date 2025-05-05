import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Zap, HeadphonesIcon, Gauge, CreditCard, Smartphone } from "lucide-react";
import { ProgressBar } from "../ui/progress-bar";


const categories = [
  {
    id: 1,
    name: "Product Features",
    icon: <Zap />,
    percentage: 32,
    color: "primary"
  },
  {
    id: 2,
    name: "Support Experience",
    icon: <HeadphonesIcon />,
    percentage: 26,
    color: "blue"
  },
  {
    id: 3,
    name: "Performance",
    icon: <Gauge />,
    percentage: 18,
    color: "indigo"
  },
  {
    id: 4,
    name: "Pricing Plans",
    icon: <CreditCard />,
    percentage: 14,
    color: "purple"
  },
  {
    id: 5,
    name: "Mobile Experience",
    icon: <Smartphone />,
    percentage: 10,
    color: "rose"
  },
];

export default function FeedbackCategories() {
  const getBackgroundColor = (color: string) => {
    const colorMap: Record<string, string> = {
      'primary': 'bg-primary-100',
      'blue': 'bg-blue-100',
      'indigo': 'bg-indigo-100',
      'purple': 'bg-purple-100',
      'rose': 'bg-rose-100'
    };
    return colorMap[color] || 'bg-neutral-100';
  };
  
  const getTextColor = (color: string) => {
    const colorMap: Record<string, string> = {
      'primary': 'text-primary-700',
      'blue': 'text-blue-700',
      'indigo': 'text-indigo-700',
      'purple': 'text-purple-700',
      'rose': 'text-rose-700'
    };
    return colorMap[color] || 'text-neutral-700';
  };
  
  const getProgressColor = (color: string) => {
    const colorMap: Record<string, string> = {
      'primary': 'bg-primary-600',
      'blue': 'bg-blue-600',
      'indigo': 'bg-indigo-600',
      'purple': 'bg-purple-600',
      'rose': 'bg-rose-600'
    };
    return colorMap[color] || 'bg-neutral-600';
  };
  
  return (
    <Card className="shadow-sm border border-neutral-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-neutral-900">Top Feedback Categories</h3>
          <button className="text-sm text-neutral-500 hover:text-neutral-700">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-md ${getBackgroundColor(category.color)} flex items-center justify-center ${getTextColor(category.color)} mr-3`}>
                {category.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium text-neutral-900">{category.name}</h4>
                  <span className="text-sm text-neutral-500">{category.percentage}%</span>
                </div>
                <ProgressBar 
                  value={category.percentage} 
                  color={getProgressColor(category.color)} 
                  height="sm" 
                  className="mt-1" 
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
