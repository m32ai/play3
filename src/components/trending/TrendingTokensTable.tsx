
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, MessageCircle, Users, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  holders: number;
  tweets: number;
  trend: 'up' | 'down' | 'stable';
  logo: string;
  socialLinks: {
    discord?: string;
    telegram?: string;
    twitter?: string;
    website?: string;
  };
}

interface TrendingTokensTableProps {
  timeframe: string;
  buyAmount: string;
}

const TrendingTokensTable = ({ timeframe, buyAmount }: TrendingTokensTableProps) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Mock data generation
  const generateMockTokens = (): Token[] => {
    const mockTokens = [
      { 
        symbol: "PEPE", 
        name: "Pepe", 
        logo: "🐸",
        socialLinks: {
          discord: "https://discord.gg/pepe",
          telegram: "https://t.me/pepe",
          twitter: "https://twitter.com/pepe",
          website: "https://pepe.com"
        }
      },
      { 
        symbol: "DOGE", 
        name: "Dogecoin", 
        logo: "🐕",
        socialLinks: {
          telegram: "https://t.me/doge",
          twitter: "https://twitter.com/doge",
          website: "https://dogecoin.com"
        }
      },
      { 
        symbol: "SHIB", 
        name: "Shiba Inu", 
        logo: "🐶",
        socialLinks: {
          discord: "https://discord.gg/shib",
          twitter: "https://twitter.com/shib",
          website: "https://shib.io"
        }
      },
      { 
        symbol: "BONK", 
        name: "Bonk", 
        logo: "🔨",
        socialLinks: {
          telegram: "https://t.me/bonk",
          twitter: "https://twitter.com/bonk",
          website: "https://bonk.gg"
        }
      },
      { 
        symbol: "WIF", 
        name: "dogwifhat", 
        logo: "🐕‍🦺",
        socialLinks: {
          discord: "https://discord.gg/wif",
          telegram: "https://t.me/wif",
          twitter: "https://twitter.com/wif"
        }
      }
    ];

    return mockTokens.map((token, index) => ({
      id: `${token.symbol}-${index}`,
      ...token,
      price: Math.random() * 10,
      change24h: (Math.random() - 0.5) * 20,
      volume: Math.random() * 1000000,
      marketCap: Math.random() * 100000000,
      holders: Math.floor(Math.random() * 50000),
      tweets: Math.floor(Math.random() * 1000),
      trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down'
    }));
  };

  // Update tokens periodically, but only if not hovering
  useEffect(() => {
    const updateTokens = () => {
      if (!isHovered) {
        setTokens(generateMockTokens());
      }
    };

    // Initial load
    updateTokens();

    // Update every 2 seconds if not hovering
    const interval = setInterval(updateTokens, 2000);

    return () => clearInterval(interval);
  }, [timeframe, isHovered]);

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatVolume = (num: number): string => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'discord':
        return '💬';
      case 'telegram':
        return '📱';
      case 'twitter':
        return '🐦';
      default:
        return '🔗';
    }
  };

  return (
    <TooltipProvider>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              <span>Trending Tokens ({timeframe})</span>
              {isHovered && (
                <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                  PAUSED
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 text-slate-300 font-medium">#</th>
                  <th className="text-left py-3 text-slate-300 font-medium">Token</th>
                  <th className="text-right py-3 text-slate-300 font-medium">Price</th>
                  <th className="text-right py-3 text-slate-300 font-medium">24h %</th>
                  <th className="text-right py-3 text-slate-300 font-medium">Volume</th>
                  <th className="text-right py-3 text-slate-300 font-medium">Market Cap</th>
                  <th className="text-right py-3 text-slate-300 font-medium">Holders</th>
                  <th className="text-center py-3 text-slate-300 font-medium">Social</th>
                  <th className="text-center py-3 text-slate-300 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, index) => (
                  <tr 
                    key={token.id} 
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <td className="py-4 text-slate-400">{index + 1}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{token.logo}</span>
                        <div>
                          <div className="text-white font-medium">{token.symbol}</div>
                          <div className="text-slate-400 text-sm">{token.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right text-white">{formatNumber(token.price)}</td>
                    <td className="py-4 text-right">
                      <div className={`flex items-center justify-end space-x-1 ${
                        token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {token.change24h >= 0 ? (
                          <ArrowUpIcon className="w-4 h-4" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4" />
                        )}
                        <span>{Math.abs(token.change24h).toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-right text-slate-300">{formatVolume(token.volume)}</td>
                    <td className="py-4 text-right text-slate-300">{formatNumber(token.marketCap)}</td>
                    <td className="py-4 text-right text-slate-300">{token.holders.toLocaleString()}</td>
                    <td className="py-4">
                      <div className="flex justify-center space-x-1">
                        {Object.entries(token.socialLinks).map(([platform, url]) => (
                          <Tooltip key={platform}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                                onClick={() => window.open(url, '_blank')}
                              >
                                <span className="text-lg">{getSocialIcon(platform)}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open {platform}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                              onClick={() => window.open(`https://solscan.io/token/${token.id}`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View on Solscan</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center">
                        <Button 
                          size="sm" 
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                          onClick={() => console.log(`Buying ${buyAmount} SOL of ${token.symbol}`)}
                        >
                          Buy {buyAmount} SOL
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TrendingTokensTable;
