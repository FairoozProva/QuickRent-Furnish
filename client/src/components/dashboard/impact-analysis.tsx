import { Card, CardContent } from "@/components/ui/card";
import { DownloadIcon, MoreHorizontal, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "../ui/progress-bar";
import { Action } from "@shared/schema";

interface ImpactAnalysisProps {
  actions: Action[];
}

export default function ImpactAnalysis({ actions }: ImpactAnalysisProps) {
  // Sample key improvements when no API data is available
  const keyImprovements = [
    {
      id: 1,
      title: "Added bulk export functionality in response to 28 user requests",
      status: "completed"
    },
    {
      id: 2,
      title: "Fixed loading time issues reported by enterprise users - 62% performance improvement",
      status: "completed"
    },
    {
      id: 3,
      title: "Redesigned dashboard based on UX feedback - 30% increase in feature engagement",
      status: "completed"
    },
    {
      id: 4,
      title: "Developing automated report scheduling (in progress)",
      status: "in-progress"
    },
    {
      id: 5,
      title: "Expanding API capabilities for better integration (planned for Q3)",
      status: "planned"
    }
  ];
  
  const displayImprovements = actions.length > 0 
    ? actions.map(action => ({
        id: action.id,
        title: action.description,
        status: action.status
      }))
    : keyImprovements;
  
  return (
    <Card className="shadow-sm border border-neutral-200 mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-neutral-900">Impact Analysis</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="px-3 py-1.5 text-sm bg-primary-50 text-primary-700 flex items-center">
              <DownloadIcon className="h-4 w-4 mr-1" />
              Export
            </Button>
            <button className="text-sm text-neutral-500 hover:text-neutral-700">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-neutral-700">Actions Taken Based on Feedback</h4>
              <div className="flex flex-wrap gap-3">
                <div className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-md text-sm flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  Added new features (12)
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-md text-sm flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Fixed bugs (28)
                </div>
                <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-md text-sm flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Improved UX (9)
                </div>
                <div className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-md text-sm flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Updated docs (5)
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-neutral-700">Key Improvements</h4>
              
              {displayImprovements.map(improvement => (
                <div key={improvement.id} className="flex items-start">
                  <div className={`flex-shrink-0 h-5 w-5 ${improvement.status === 'completed' ? 'text-green-500' : 'text-amber-500'}`}>
                    {improvement.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-neutral-700">{improvement.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-3">Impact on Key Metrics</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-800">User Retention</span>
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                </div>
                <ProgressBar value={75} color="bg-green-500" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-800">Customer Satisfaction</span>
                  <span className="text-sm text-green-600 font-medium">+8%</span>
                </div>
                <ProgressBar value={66} color="bg-green-500" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-800">Feature Adoption</span>
                  <span className="text-sm text-green-600 font-medium">+15%</span>
                </div>
                <ProgressBar value={80} color="bg-green-500" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-800">Support Tickets</span>
                  <span className="text-sm text-green-600 font-medium">-23%</span>
                </div>
                <ProgressBar value={50} color="bg-green-500" />
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="i-material-icons text-green-500">insights</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">ROI Analysis</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Based on feedback-driven improvements, estimated $145,000 savings from reduced support costs and $280,000 additional revenue from improved retention.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
