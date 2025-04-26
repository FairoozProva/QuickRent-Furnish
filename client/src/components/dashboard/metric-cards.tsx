import { useQuery } from "@tanstack/react-query";
import { CardMetric } from "@/components/ui/card-metric";
import { MessageSquare, UserCheck, Reply, Clock } from "lucide-react";

export default function MetricCards() {
  const { data: stats } = useQuery({
    queryKey: ['/api/feedbacks/stats'],
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <CardMetric
        title="Total Feedback"
        value={stats?.totalFeedbacks || 5247}
        icon={<MessageSquare className="h-5 w-5 text-primary-600" />}
        iconBgColor="bg-primary-50"
        changeValue="12.5%"
        changeDirection="up"
      />
      
      <CardMetric
        title="Positive Sentiment"
        value={stats ? `${((stats.positiveFeedbacks / stats.totalFeedbacks) * 100).toFixed(1)}%` : "68.2%"}
        icon={<UserCheck className="h-5 w-5 text-green-600" />}
        iconBgColor="bg-green-50"
        changeValue="3.7%"
        changeDirection="up"
      />
      
      <CardMetric
        title="Response Rate"
        value="92.4%"
        icon={<Reply className="h-5 w-5 text-blue-600" />}
        iconBgColor="bg-blue-50"
        changeValue="8.3%"
        changeDirection="up"
      />
      
      <CardMetric
        title="Average Resolution Time"
        value="32.5 hrs"
        icon={<Clock className="h-5 w-5 text-amber-600" />}
        iconBgColor="bg-amber-50"
        changeValue="5.2%"
        changeDirection="down"
      />
    </div>
  );
}
