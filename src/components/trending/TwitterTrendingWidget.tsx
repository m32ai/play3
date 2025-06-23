
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, ExternalLink, Twitter } from "lucide-react";

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
        name: "Frogolicious",
        symbol: "FROG",
        tweetCount: 1250,
        trend: 'up',
        trendPercentage: 23.5
      },
      {
        id: "2",
        name: "Solana Doge",
        symbol: "SOLDOGE",
        tweetCount: 980,
        trend: 'up',
        trendPercentage: 15.2
      },
      {
        id: "3",
        name: "Solana Pepe",
        symbol: "SPEPE",
        tweetCount: 850,
        trend: 'down',
        trendPercentage: -8.7
      },
      {
        id: "4",
        name: "Banana Token",
        symbol: "BANANA",
        tweetCount: 720,
        trend: 'up',
        trendPercentage: 145.8
      }
    ];

    setTwitterTokens(mockData);
  }, [timeframe]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Twitter className="w-5 h-5 text-blue-400" />
            Twitter Trending
          </div>
          <Button size="sm" variant="ghost" className="text-yellow-500 hover:text-yellow-400">
            <Plus className="w-4 h-4 mr-1" />
            Add to Dashboard
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="grid grid-cols-3 gap-4 text-xs text-slate-400 uppercase tracking-wide pb-2 border-b border-slate-700">
            <span>TOKEN</span>
            <span className="text-right">TWEETS</span>
            <span className="text-right">TREND</span>
          </div>
          {twitterTokens.map((token, index) => (
            <div 
              key={token.id} 
              className="grid grid-cols-3 gap-4 items-center p-2 rounded hover:bg-slate-700/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {token.symbol[0]}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">${token.symbol}</div>
                  <div className="text-slate-400 text-xs">{token.name}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-medium">{token.tweetCount.toLocaleString()}</div>
              </div>
              
              <div className="text-right flex items-center justify-end gap-1">
                {token.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-sm font-medium ${token.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(token.trendPercentage).toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TwitterTrendingWidget;
