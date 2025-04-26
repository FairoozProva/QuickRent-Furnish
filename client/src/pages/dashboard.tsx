import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MetricCards from "@/components/dashboard/metric-cards";
import SentimentTrend from "@/components/dashboard/sentiment-trend";
import FeedbackCategories from "@/components/dashboard/feedback-categories";
import RecentFeedback from "@/components/dashboard/recent-feedback";
import ImpactAnalysis from "@/components/dashboard/impact-analysis";
import FeedbackTools from "@/components/dashboard/feedback-tools";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FilterIcon, TagIcon, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const { data: feedbackTools } = useQuery({
    queryKey: ['/api/feedback-tools'],
  });

  const { data: actions } = useQuery({
    queryKey: ['/api/actions'],
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 overflow-auto bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Customer Feedback Dashboard</h1>
            <p className="text-neutral-600">Analyze and act on customer feedback with sentiment analysis and impact tracking</p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="inline-flex items-center px-3 py-1.5 bg-white border border-neutral-300 rounded-md">
                <CalendarIcon className="h-4 w-4 mr-1 text-neutral-500" />
                <span className="text-sm text-neutral-700">Last 30 days</span>
                <span className="i-material-icons text-sm ml-1 text-neutral-500">arrow_drop_down</span>
              </div>
              
              <div className="inline-flex items-center px-3 py-1.5 bg-white border border-neutral-300 rounded-md">
                <FilterIcon className="h-4 w-4 mr-1 text-neutral-500" />
                <span className="text-sm text-neutral-700">All sources</span>
                <span className="i-material-icons text-sm ml-1 text-neutral-500">arrow_drop_down</span>
              </div>
              
              <div className="inline-flex items-center px-3 py-1.5 bg-white border border-neutral-300 rounded-md">
                <TagIcon className="h-4 w-4 mr-1 text-neutral-500" />
                <span className="text-sm text-neutral-700">All categories</span>
                <span className="i-material-icons text-sm ml-1 text-neutral-500">arrow_drop_down</span>
              </div>
              
              <div className="inline-flex ml-auto items-center">
                <Button className="inline-flex items-center" variant="default">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  <span className="text-sm">Refresh data</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Metric Cards */}
          <MetricCards />
          
          {/* Sentiment Trend and Distribution */}
          <SentimentTrend />
          
          {/* Feedback Categories and Recent Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <FeedbackCategories />
            <RecentFeedback />
          </div>
          
          {/* Impact Analysis */}
          <ImpactAnalysis actions={actions || []} />
          
          {/* Feedback Collection Tools */}
          <FeedbackTools tools={feedbackTools || []} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
