
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Twitter, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TwitterTrend {
  id: string;
  rank: number;
  hashtag: string;
  mentions: number;
  change: number;
  tweets: Array<{
    id: string;
    username: string;
    handle: string;
    content: string;
    timestamp: string;
    likes: number;
    retweets: number;
  }>;
}

const AllTwitterTrends = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState("5m");
  const [trends, setTrends] = useState<TwitterTrend[]>([]);

  useEffect(() => {
    // Extended mock data for all trends
    const mockTrends: TwitterTrend[] = [
      {
        id: "1",
        rank: 1,
        hashtag: "#PEPE",
        mentions: 15420,
        change: 34.2,
        tweets: [
          {
            id: "1",
            username: "CryptoTrader",
            handle: "@cryptotrader",
            content: "#PEPE is absolutely flying today! 🚀 The community is going wild",
            timestamp: "2m ago",
            likes: 142,
            retweets: 89
          }
        ]
      },
      {
        id: "2",
        rank: 2,
        hashtag: "#WIF",
        mentions: 12850,
        change: 28.7,
        tweets: [
          {
            id: "2",
            username: "SolanaFan",
            handle: "@solanafan",
            content: "#WIF holders are eating good tonight! 📈",
            timestamp: "5m ago",
            likes: 98,
            retweets: 56
          }
        ]
      },
      // Add more trends...
      {
        id: "3",
        rank: 3,
        hashtag: "#BONK",
        mentions: 9870,
        change: 22.1,
        tweets: []
      },
      {
        id: "4",
        rank: 4,
        hashtag: "#SHIB",
        mentions: 8430,
        change: 18.9,
        tweets: []
      },
      {
        id: "5",
        rank: 5,
        hashtag: "#DOGE",
        mentions: 7650,
        change: 15.3,
        tweets: []
      }
    ];

    setTrends(mockTrends);
  }, [timeframe]);

  const timeframes = [
    { value: "1m", label: "1m" },
    { value: "5m", label: "5m" },
    { value: "30m", label: "30m" },
    { value: "1h", label: "1h" },
    { value: "4h", label: "4h" },
    { value: "24h", label: "24h" }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/trending')}
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <Twitter className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">All Twitter Trends</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  size="sm"
                  variant={timeframe === tf.value ? "default" : "ghost"}
                  onClick={() => setTimeframe(tf.value)}
                  className={`h-8 px-3 text-xs ${
                    timeframe === tf.value 
                      ? "bg-slate-600 text-white" 
                      : "text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Twitter Trending Tokens ({timeframe})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trends.map((trend) => (
                <div key={trend.id} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400 text-sm">#{trend.rank}</span>
                      <span className="text-blue-400 font-medium">{trend.hashtag}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-300 text-sm">{trend.mentions.toLocaleString()} mentions</span>
                      <span className="text-green-400 text-sm">+{trend.change}%</span>
                    </div>
                  </div>
                  
                  {trend.tweets.length > 0 && (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded border border-slate-600/30">
                      <div className="text-xs text-slate-400 mb-1">Latest Tweet:</div>
                      <div className="text-slate-300 text-sm">{trend.tweets[0].content}</div>
                      <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                        <span>@{trend.tweets[0].handle} • {trend.tweets[0].timestamp}</span>
                        <span>{trend.tweets[0].likes} likes • {trend.tweets[0].retweets} retweets</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllTwitterTrends;
