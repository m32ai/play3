import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Twitter, Banana } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

interface Tweet {
  id: string;
  username: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
}

const TwitterTrendingWidget = ({ timeframe, buyAmount }: { timeframe: string; buyAmount: string }) => {
  const navigate = useNavigate();
  const [twitterTokens, setTwitterTokens] = useState<TwitterToken[]>([]);
  const [showAllTrends, setShowAllTrends] = useState(false);

  // Mock tweets data for each token
  const mockTweets: Record<string, Tweet[]> = {
    "BTC": [
      {
        id: "1",
        username: "CryptoWhale",
        handle: "@cryptowhale",
        content: "Bitcoin breaking through resistance levels! This bull run is just getting started 🚀 #BTC",
        timestamp: "2m",
        likes: 1247,
        retweets: 423
      },
      {
        id: "2",
        username: "BlockchainNews",
        handle: "@blockchainnews",
        content: "Major institutional adoption continues as Bitcoin reaches new monthly highs",
        timestamp: "5m",
        likes: 892,
        retweets: 234
      },
      {
        id: "3",
        username: "TradingPro",
        handle: "@tradingpro",
        content: "BTC consolidating nicely above support. Next target $75k 📈",
        timestamp: "8m",
        likes: 567,
        retweets: 128
      }
    ],
    "ETH": [
      {
        id: "4",
        username: "EthereumDaily",
        handle: "@ethereumdaily",
        content: "Ethereum gas fees dropping significantly with latest network optimizations! 🔥",
        timestamp: "1m",
        likes: 2134,
        retweets: 678
      },
      {
        id: "5",
        username: "DeFiAnalyst",
        handle: "@defianalyst",
        content: "ETH staking rewards looking attractive at current levels. Long-term bullish on Ethereum",
        timestamp: "4m",
        likes: 1456,
        retweets: 345
      }
    ],
    "SOL": [
      {
        id: "6",
        username: "SolanaNews",
        handle: "@solananews",
        content: "Solana ecosystem exploding with new meme coins and DeFi protocols! $SOL to the moon 🌙",
        timestamp: "3m",
        likes: 3421,
        retweets: 1234
      },
      {
        id: "7",
        username: "MemeTrader",
        handle: "@memetrader",
        content: "SOL pumping hard! Best chain for meme coin trading right now 📊",
        timestamp: "6m",
        likes: 987,
        retweets: 456
      }
    ],
    "PEPE": [
      {
        id: "8",
        username: "FrogArmy",
        handle: "@frogarmy",
        content: "PEPE community is unstoppable! 🐸 Diamond hands only! #PEPE #MemeCoin",
        timestamp: "1m",
        likes: 5678,
        retweets: 2345
      },
      {
        id: "9",
        username: "MemeKing",
        handle: "@memeking",
        content: "PEPE breaking all-time highs! This is why we hold 💎🙌",
        timestamp: "7m",
        likes: 4321,
        retweets: 1876
      }
    ],
    "DOGE": [
      {
        id: "10",
        username: "DogeArmy",
        handle: "@dogearmy",
        content: "Much wow! DOGE doing what DOGE does best 🐕 To the moon! #DogeToTheMoon",
        timestamp: "2m",
        likes: 8765,
        retweets: 3456
      }
    ]
  };

  const generateRandomData = (): TwitterToken[] => {
    const baseTokens = [
      { id: "1", icon: "B", name: "Bitcoin", symbol: "BTC" },
      { id: "2", icon: "E", name: "Ethereum", symbol: "ETH" },
      { id: "3", icon: "S", name: "Solana", symbol: "SOL" },
      { id: "4", icon: "P", name: "Pepe", symbol: "PEPE" },
      { id: "5", icon: "D", name: "Dogecoin", symbol: "DOGE" }
    ];

    return baseTokens.map((token, index) => ({
      ...token,
      rank: index + 1,
      tweetCount: Math.floor(Math.random() * 2000) + 500,
      trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down',
      trendPercentage: Math.random() * 200 + 5
    }));
  };

  useEffect(() => {
    // Initial data load
    setTwitterTokens(generateRandomData());

    // Set up interval to refresh data every second
    const interval = setInterval(() => {
      setTwitterTokens(generateRandomData());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [timeframe]);

  const handleAddToDashboard = () => {
    console.log('Add Twitter Trending to dashboard clicked');
    // Implement add to dashboard logic here
  };

  const handleViewAllTrends = () => {
    console.log('View All Twitter Trends clicked');
    navigate('/twitter-trends');
  };

  const handleTokenClick = (token: TwitterToken) => {
    console.log('Twitter token clicked:', token.symbol);
    // Implement token click logic here
  };

  const handleQuickBuy = (token: TwitterToken) => {
    console.log('Quick buy clicked for Twitter token:', token.symbol);
    // Implement quick buy logic here
  };

  const tokensToShow = showAllTrends ? twitterTokens : twitterTokens.slice(0, 5);

  return (
    <TooltipProvider>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Twitter className="w-4 h-4 text-blue-400" />
            Twitter Trending
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {tokensToShow.map((token) => (
              <div 
                key={token.id} 
                className="flex items-center justify-between p-2 rounded hover:bg-slate-700/30 transition-all duration-300 cursor-pointer group animate-fade-in"
                onClick={() => handleTokenClick(token)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-slate-400 text-sm font-medium w-4">{token.rank}</span>
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {token.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-white font-medium text-sm">${token.symbol}</div>
                      <HoverCard openDelay={0} closeDelay={300}>
                        <HoverCardTrigger asChild>
                          <div className="text-blue-400 hover:text-blue-300 cursor-pointer">
                            <Twitter className="w-3 h-3" />
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 bg-slate-800 border-slate-700 text-white">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                              <Twitter className="w-4 h-4 text-blue-400" />
                              <span className="font-medium">Latest ${token.symbol} Tweets</span>
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {(mockTweets[token.symbol] || []).map((tweet) => (
                                <div key={tweet.id} className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                      {tweet.username[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1">
                                        <span className="font-medium text-sm">{tweet.username}</span>
                                        <span className="text-slate-400 text-xs">{tweet.handle}</span>
                                        <span className="text-slate-500 text-xs">•</span>
                                        <span className="text-slate-500 text-xs">{tweet.timestamp}</span>
                                      </div>
                                      <p className="text-sm text-slate-200 mt-1">{tweet.content}</p>
                                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                                        <span>❤️ {tweet.likes.toLocaleString()}</span>
                                        <span>🔄 {tweet.retweets.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div className="text-slate-400 text-xs">{token.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-white font-medium text-sm transition-all duration-500">{token.tweetCount.toLocaleString()}</div>
                    <div className="flex items-center justify-end gap-1">
                      <span className={`text-xs font-medium transition-all duration-500 ${
                        token.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {token.trend === 'up' ? '+' : ''}{token.trendPercentage.toFixed(1)}%
                      </span>
                      <span className="text-slate-400 text-xs">tweets</span>
                    </div>
                  </div>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium text-xs h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickBuy(token);
                        }}
                      >
                        <Banana className="w-3 h-3 mr-1" />
                        {buyAmount}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Buy {buyAmount} SOL</p>
                    </TooltipContent>
                  </Tooltip>
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
              {showAllTrends ? 'Show Less' : 'View All Twitter Trends'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TwitterTrendingWidget;
