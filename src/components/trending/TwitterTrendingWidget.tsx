import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Twitter } from "lucide-react";

interface TwitterToken {
  id: string;
  rank: number;
  icon: string;
  name: string;
  symbol: string;
  tweetCount: number;
  trend: 'up' | 'down';
  trendPercentage: number;
}

const TwitterTrendingWidget = ({ timeframe }: { timeframe: string }) => {
  const [twitterTokens, setTwitterTokens] = useState<TwitterToken[]>([]);

  useEffect(() => {
    const mockData: TwitterToken[] = [
      {
        id: "1",
        rank: 1,
        icon: "B",
        name: "Bitcoin",
        symbol: "BTC",
        tweetCount: 2847,
        trend: 'up',
        trendPercentage: 23.5
      },
      {
        id: "2",
        rank: 2,
        icon: "E",
        name: "Ethereum",
        symbol: "ETH",
        tweetCount: 1923,
        trend: 'up',
        trendPercentage: 15.2
      },
      {
        id: "3",
        rank: 3,
        icon: "S",
        name: "Solana",
        symbol: "SOL",
        tweetCount: 1456,
        trend: 'up',
        trendPercentage: 8.7
      },
      {
        id: "4",
        rank: 4,
        icon: "P",
        name: "Pepe",
        symbol: "PEPE",
        tweetCount: 987,
        trend: 'up',
        trendPercentage: 145.8
      },
      {
        id: "5",
        rank: 5,
        icon: "D",
        name: "Dogecoin",
        symbol: "DOGE",
        tweetCount: 734,
        trend: 'up',
        trendPercentage: 34.2
      }
    ];

    setTwitterTokens(mockData);
  }, [timeframe]);

  const handleAddToDashboard = () => {
    console.log('Add Twitter Trending to dashboard clicked');
    // Implement add to dashboard logic here
  };

  const handleViewAllTrends = () => {
    console.log('View All Twitter Trends clicked');
    // Implement view all trends logic here
  };

  const handleTokenClick = (token: TwitterToken) => {
    console.log('Twitter token clicked:', token.symbol);
    // Implement token click logic here
  };

  const handleQuickBuy = (token: TwitterToken) => {
    console.log('Quick buy clicked for Twitter token:', token.symbol);
    // Implement quick buy logic here
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Twitter className="w-4 h-4 text-blue-400" />
            Twitter Trending
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-yellow-500 hover:text-yellow-400 text-xs h-7"
            onClick={handleAddToDashboard}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add to Dashboard
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {twitterTokens.map((token) => (
            <div 
              key={token.id} 
              className="flex items-center justify-between p-2 rounded hover:bg-slate-700/30 transition-colors cursor-pointer group"
              onClick={() => handleTokenClick(token)}
            >
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-slate-400 text-sm font-medium w-4">{token.rank}</span>
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {token.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">${token.symbol}</div>
                  <div className="text-slate-400 text-xs">{token.name}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-white font-medium text-sm">{token.tweetCount.toLocaleString()}</div>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-green-400 text-xs font-medium">
                      {token.trendPercentage}%
                    </span>
                    <span className="text-slate-400 text-xs">tweets</span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium text-xs h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickBuy(token);
                  }}
                >
                  Buy
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-700">
          <Button 
            variant="ghost" 
            className="w-full text-blue-400 hover:text-blue-300 text-sm h-8"
            onClick={handleViewAllTrends}
          >
            View All Twitter Trends
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwitterTrendingWidget;
