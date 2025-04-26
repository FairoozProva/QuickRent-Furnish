import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mail, HeadphonesIcon, MoreVertical, TrendingUp, TrendingDown, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeedbackTool } from "@shared/schema";

interface FeedbackToolsProps {
  tools: FeedbackTool[];
}

export default function FeedbackTools({ tools }: FeedbackToolsProps) {
  // Sample tools when no API data is available
  const sampleTools = [
    {
      id: 1,
      name: "In-App Survey",
      type: "in-app",
      description: "Collects feedback via in-app modal prompts after key actions. Targets specific user journeys.",
      isActive: true,
      responseCount: 1247,
      responseRate: 23,
      averageSentiment: 4.2
    },
    {
      id: 2,
      name: "Email Campaign",
      type: "email",
      description: "Automated email surveys sent to customers 7 days after onboarding and quarterly thereafter.",
      isActive: true,
      responseCount: 3856,
      responseRate: 18,
      averageSentiment: 3.9
    },
    {
      id: 3,
      name: "Support Feedback",
      type: "support",
      description: "Automatically collects and analyzes feedback after support ticket resolution.",
      isActive: true,
      responseCount: 957,
      responseRate: 42,
      averageSentiment: 3.5
    }
  ];
  
  const displayTools = tools.length > 0 ? tools : sampleTools;
  
  const getToolIcon = (type: string) => {
    switch (type) {
      case 'in-app':
        return <MessageCircle className="h-5 w-5 text-primary-600" />;
      case 'email':
        return <Mail className="h-5 w-5 text-indigo-600" />;
      case 'support':
        return <HeadphonesIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <MessageCircle className="h-5 w-5 text-primary-600" />;
    }
  };
  
  const getToolColor = (type: string) => {
    switch (type) {
      case 'in-app':
        return 'bg-primary-50';
      case 'email':
        return 'bg-indigo-50';
      case 'support':
        return 'bg-purple-50';
      default:
        return 'bg-primary-50';
    }
  };
  
  const getToolTitleColor = (type: string) => {
    switch (type) {
      case 'in-app':
        return 'text-primary-900';
      case 'email':
        return 'text-indigo-900';
      case 'support':
        return 'text-purple-900';
      default:
        return 'text-primary-900';
    }
  };
  
  const getSentimentTrend = (value: number) => {
    if (value >= 4.0) return <TrendingUp className="h-3 w-3 mr-1" />;
    if (value < 3.5) return <TrendingDown className="h-3 w-3 mr-1" />;
    return <MoveRight className="h-3 w-3 mr-1" />;
  };
  
  const getSentimentColor = (value: number) => {
    if (value >= 4.0) return 'text-green-600';
    if (value < 3.5) return 'text-red-600';
    return 'text-amber-600';
  };
  
  return (
    <Card className="shadow-sm border border-neutral-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-neutral-900">Feedback Collection Tools</h3>
          <Button className="px-3 py-1.5 text-sm flex items-center">
            <span className="w-4 h-4 mr-1">+</span>
            Create New
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTools.map(tool => (
            <div key={tool.id} className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              <div className={`${getToolColor(tool.type)} p-4 border-b border-neutral-200`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-md shadow-sm">
                      {getToolIcon(tool.type)}
                    </div>
                    <h4 className={`ml-3 ${getToolTitleColor(tool.type)} font-medium`}>{tool.name}</h4>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    {tool.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-neutral-600 mb-4">
                  {tool.description}
                </p>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-neutral-500">Responses</span>
                  <span className="font-medium text-neutral-900">{tool.responseCount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-neutral-500">Response Rate</span>
                  <span className="font-medium text-neutral-900">{tool.responseRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Avg. Sentiment</span>
                  <span className={`font-medium ${getSentimentColor(tool.averageSentiment)} flex items-center`}>
                    {getSentimentTrend(tool.averageSentiment)}
                    {tool.averageSentiment}/5
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200 flex space-x-2">
                  <button className="flex-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                    Edit
                  </button>
                  <button className="flex-1 text-sm font-medium text-neutral-600 hover:text-neutral-700">
                    View Data
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
