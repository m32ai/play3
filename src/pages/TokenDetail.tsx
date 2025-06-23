
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Copy, TrendingUp, Banana } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TokenData {
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  marketCap: number;
  liquidity: number;
  volume: number;
  transactions: number;
  buyTxns: number;
  sellTxns: number;
  contractAddress: string;
  socials: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    website?: string;
  };
}

const TokenDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [buyAmount, setBuyAmount] = useState("0.1");

  useEffect(() => {
    // Mock token data - in real app this would fetch from API
    const mockTokenData: TokenData = {
      name: symbol === "FROG" ? "Frogolicious" : `Token ${symbol}`,
      symbol: symbol || "UNKNOWN",
      price: Math.random() * 0.01,
      priceChange: (Math.random() - 0.5) * 1000,
      marketCap: Math.floor(Math.random() * 5000000) + 500000,
      liquidity: Math.floor(Math.random() * 200000) + 30000,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      transactions: Math.floor(Math.random() * 3000) + 500,
      buyTxns: Math.floor(Math.random() * 2000) + 200,
      sellTxns: Math.floor(Math.random() * 1500) + 200,
      contractAddress: "0x1234...5678",
      socials: {
        twitter: "https://twitter.com/token",
        telegram: "https://t.me/token",
        website: "https://token.com"
      }
    };
    setTokenData(mockTokenData);
  }, [symbol]);

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(6)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('Copied to clipboard:', text);
  };

  const openSocialLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleQuickBuy = () => {
    console.log('Quick buy clicked for:', tokenData?.symbol);
  };

  if (!tokenData) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <div className="border-b border-slate-700 bg-slate-900 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(-1)}
                  className="text-slate-300 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                    {tokenData.symbol[0]}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">${tokenData.symbol}</h1>
                    <p className="text-slate-400">{tokenData.name}</p>
                  </div>
                </div>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                    onClick={handleQuickBuy}
                  >
                    <Banana className="w-4 h-4 mr-2" />
                    Buy {buyAmount} SOL
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Buy {buyAmount} SOL of {tokenData.symbol}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Token Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                    Token Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-400 text-sm">Price</label>
                        <div className="text-white text-xl font-bold">{formatPrice(tokenData.price)}</div>
                        <div className={`text-sm flex items-center gap-1 font-medium ${tokenData.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {tokenData.priceChange >= 0 ? '+' : ''}{tokenData.priceChange.toFixed(2)}%
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-slate-400 text-sm">Market Cap</label>
                        <div className="text-white text-lg font-medium">{formatCurrency(tokenData.marketCap)}</div>
                      </div>
                      
                      <div>
                        <label className="text-slate-400 text-sm">Liquidity</label>
                        <div className="text-white text-lg font-medium">{formatCurrency(tokenData.liquidity)}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-400 text-sm">Volume (24h)</label>
                        <div className="text-white text-lg font-medium">{formatCurrency(tokenData.volume)}</div>
                      </div>
                      
                      <div>
                        <label className="text-slate-400 text-sm">Transactions</label>
                        <div className="text-white text-lg font-medium">{tokenData.transactions.toLocaleString()}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-slate-600 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(tokenData.buyTxns / tokenData.transactions) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">
                            {tokenData.buyTxns} / {tokenData.sellTxns}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-slate-400 text-sm">Contract Address</label>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono">{tokenData.contractAddress}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(tokenData.contractAddress)}
                            className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Social Links */}
            <div>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Social Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tokenData.socials.website && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-300 hover:text-white"
                        onClick={() => openSocialLink(tokenData.socials.website!)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                    )}
                    {tokenData.socials.twitter && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-300 hover:text-white"
                        onClick={() => openSocialLink(tokenData.socials.twitter!)}
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Twitter
                      </Button>
                    )}
                    {tokenData.socials.telegram && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-300 hover:text-white"
                        onClick={() => openSocialLink(tokenData.socials.telegram!)}
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        Telegram
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TokenDetail;
