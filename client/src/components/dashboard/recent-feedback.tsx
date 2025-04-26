import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { SentimentBadge, SentimentContainer } from "@/components/ui/sentiment-badge";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare, Share, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type SentimentFilter = "all" | "positive" | "neutral" | "negative";

// Sample feedback items
const feedbackItems = [
  {
    id: 1,
    sentiment: "positive" as const,
    author: "Alex Morgan",
    role: "Product Team",
    time: "2 days ago",
    content: "The new dashboard is fantastic! Really streamlines our workflow and gives us exactly the insights we need. Would love to see export options expanded in the next update.",
    likes: 12,
    tags: ["Feature Request"]
  },
  {
    id: 2,
    sentiment: "negative" as const,
    author: "Jamie Chen",
    role: "Enterprise Customer",
    time: "3 days ago",
    content: "We're experiencing consistent timeouts when trying to run reports with large datasets. This is blocking our month-end reporting and causing significant delays. Need urgent assistance.",
    likes: 3,
    tags: ["Bug Report"]
  },
  {
    id: 3,
    sentiment: "neutral" as const,
    author: "Taylor Wilson",
    role: "Marketing Team",
    time: "5 days ago",
    content: "Is there a way to schedule recurring exports of sentiment data? We need to include these metrics in our weekly executive report but can't find any automation options.",
    likes: 7,
    tags: ["Question"]
  }
];

export default function RecentFeedback() {
  const [filter, setFilter] = useState<SentimentFilter>("all");
  
  const { data: feedbacks } = useQuery({
    queryKey: ['/api/feedbacks'],
  });
  
  const displayFeedbacks = feedbackItems; // Use API data when available
  
  const filteredFeedbacks = filter === "all" 
    ? displayFeedbacks 
    : displayFeedbacks.filter(item => item.sentiment === filter);
  
  const getTagColor = (tag: string) => {
    const tagMap: Record<string, string> = {
      'Feature Request': 'bg-primary-100 text-primary-800',
      'Bug Report': 'bg-red-100 text-red-800',
      'Question': 'bg-amber-100 text-amber-800'
    };
    return tagMap[tag] || 'bg-neutral-100 text-neutral-800';
  };
  
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-neutral-200">
      <CardContent className="p-6 border-b border-neutral-200">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-neutral-900">Recent Feedback</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all
          </button>
        </div>
      </CardContent>
      
      {/* Feedback Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex">
          <button 
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2", 
              filter === "all" 
                ? "text-primary-600 border-primary-600" 
                : "text-neutral-500 border-transparent hover:text-neutral-700"
            )}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button 
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2", 
              filter === "positive" 
                ? "text-primary-600 border-primary-600" 
                : "text-neutral-500 border-transparent hover:text-neutral-700"
            )}
            onClick={() => setFilter("positive")}
          >
            Positive
          </button>
          <button 
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2", 
              filter === "neutral" 
                ? "text-primary-600 border-primary-600" 
                : "text-neutral-500 border-transparent hover:text-neutral-700"
            )}
            onClick={() => setFilter("neutral")}
          >
            Neutral
          </button>
          <button 
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2", 
              filter === "negative" 
                ? "text-primary-600 border-primary-600" 
                : "text-neutral-500 border-transparent hover:text-neutral-700"
            )}
            onClick={() => setFilter("negative")}
          >
            Negative
          </button>
        </div>
      </div>
      
      {/* Feedback List */}
      <div className="divide-y divide-neutral-200 max-h-96 overflow-y-auto scrollbar-hide">
        {filteredFeedbacks.map(item => (
          <SentimentContainer key={item.id} sentiment={item.sentiment}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <SentimentBadge sentiment={item.sentiment} />
                <div>
                  <h4 className="text-sm font-medium text-neutral-900">{item.author}</h4>
                  <p className="text-xs text-neutral-500">{item.role} • {item.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} className={getTagColor(tag)} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                <button className="text-neutral-400 hover:text-neutral-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-neutral-700 ml-11">
              {item.content}
            </p>
            <div className="mt-3 ml-11 flex items-center space-x-4">
              <button className="inline-flex items-center text-xs text-neutral-500 hover:text-neutral-700">
                <ThumbsUp className="h-3 w-3 mr-1" />
                {item.likes}
              </button>
              <button className="inline-flex items-center text-xs text-neutral-500 hover:text-neutral-700">
                <MessageSquare className="h-3 w-3 mr-1" />
                Reply
              </button>
              <button className="inline-flex items-center text-xs text-neutral-500 hover:text-neutral-700">
                <Share className="h-3 w-3 mr-1" />
                Share
              </button>
            </div>
          </SentimentContainer>
        ))}
      </div>
    </div>
  );
}
