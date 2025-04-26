import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MoreHorizontal } from "lucide-react";
import { ProgressBar } from "../ui/progress-bar";

// Sample data for the chart - in a real app, this would come from an API
const data = [
  { name: 'Jan', positive: 65, neutral: 20, negative: 15 },
  { name: 'Feb', positive: 60, neutral: 25, negative: 15 },
  { name: 'Mar', positive: 70, neutral: 15, negative: 15 },
  { name: 'Apr', positive: 63, neutral: 22, negative: 15 },
  { name: 'May', positive: 68, neutral: 21, negative: 11 },
  { name: 'Jun', positive: 65, neutral: 22, negative: 13 },
  { name: 'Jul', positive: 68, neutral: 20, negative: 12 },
];

export default function SentimentTrend() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card className="shadow-sm border border-neutral-200 lg:col-span-2">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-neutral-900">Sentiment Trend</h3>
            <div className="flex items-center gap-3">
              <span className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                Positive
              </span>
              <span className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
                Neutral
              </span>
              <span className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                Negative
              </span>
            </div>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border border-neutral-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-neutral-900">Sentiment Distribution</h3>
            <button className="text-sm text-neutral-500 hover:text-neutral-700">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="w-full flex flex-col space-y-5">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium flex items-center">
                  <span className="i-material-icons text-green-500 mr-1 text-sm">sentiment_very_satisfied</span>
                  Positive
                </span>
                <span className="text-sm font-medium">68.2%</span>
              </div>
              <ProgressBar value={68.2} color="bg-green-500" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium flex items-center">
                  <span className="i-material-icons text-amber-500 mr-1 text-sm">sentiment_neutral</span>
                  Neutral
                </span>
                <span className="text-sm font-medium">20.5%</span>
              </div>
              <ProgressBar value={20.5} color="bg-amber-500" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium flex items-center">
                  <span className="i-material-icons text-red-500 mr-1 text-sm">sentiment_very_dissatisfied</span>
                  Negative
                </span>
                <span className="text-sm font-medium">11.3%</span>
              </div>
              <ProgressBar value={11.3} color="bg-red-500" />
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <h4 className="text-sm font-medium text-neutral-700 mb-3">Most common sentiments</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Very satisfied</span>
                  <span className="text-sm font-medium">42.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Somewhat satisfied</span>
                  <span className="text-sm font-medium">25.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Neutral</span>
                  <span className="text-sm font-medium">20.5%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
