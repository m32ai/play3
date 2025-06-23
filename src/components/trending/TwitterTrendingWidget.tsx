
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";

interface TwitterToken {
  id: string;
  name: string;
  symbol: string;
  tweetCount: number;
  trend: 'up' | 'down';
  trendPercentage: number;
}

const TwitterTrendingWidget = ({ timeframe }: { timeframe: string }) => {
  const [twitterTokens, setTwitterTokens] = useState<TwitterToken[]>([]);

  useEffect(() => {
    // Mock data based on timeframe
    const mockData: TwitterToken[] = [
      {
        id: "1",
        name: "Bitcoin",
        symbol: "BTC",
        tweetCount: 2847,
        trend: 'up',
        trendPercentage: 23.5
      },
      {
        id: "2",
        name: "Ethereum",
        symbol: "ETH",
        tweetCount: 1923,
        trend: 'up',
        trendPercentage: 15.2
      },
      {
        id: "3",
        name: "Solana",
        symbol: "SOL",
        tweetCount: 1456,
        trend: 'down',
        trendPercentage: -8.7
      },
      {
        id: "4",
        name: "Pepe",
        symbol: "PEPE",
        tweetCount: 987,
        trend: 'up',
        trendPercentage: 145.8
      },
      {
        id: "5",
        name: "Dogecoin",
        symbol: "DOGE",
        tweetCount: 734,
        trend: 'up',
        trendPercentage: 34.2
      }
    ];

    setTwitterTokens(mockData);
  }, [timeframe]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🐦</span>
            Twitter Trending
          </div>
          <Button size="sm" variant="ghost" className="text-yellow-500 hover:text-yellow-400">
            <Plus className="w-4 h-4 mr-1" />
            Add to Dashboard
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {twitterTokens.map((token, index) => (
            <div 
              key={token.id} 
              className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6 bg-slate-600 rounded text-xs text-slate-300 font-medium">
                  {index + 1}
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {token.symbol[0]}
                </div>
                <div>
                  <div className="text-white font-medium">${token.symbol}</div>
                  <div className="text-slate-400 text-sm">{token.name}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{token.tweetCount.toLocaleString()}</span>
                  <Badge 
                    variant="secondary" 
                    className={`${token.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                  >
                    {token.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(token.trendPercentage).toFixed(1)}%
                  </Badge>
                  <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-slate-400 text-sm">tweets</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700">
          <Button variant="ghost" className="w-full text-slate-400 hover:text-white text-sm">
            View All Twitter Trends
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwitterTrendingWidget;
