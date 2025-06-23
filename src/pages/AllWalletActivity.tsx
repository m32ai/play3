import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface WalletActivity {
  id: string;
  icon: string;
  tokenName: string;
  tokenSymbol: string;
  buyCount: number;
  totalAmountUSD: number;
  totalAmountSOL: number;
  walletCount: number;
}

const AllWalletActivity = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [timeframe, setTimeframe] = useState("5m");
  const [walletActivities, setWalletActivities] = useState<WalletActivity[]>([]);
  const highlightToken = searchParams.get('token');

  useEffect(() => {
    // Extended mock data for all wallet activities
    const mockData: WalletActivity[] = [
      {
        id: "1",
        icon: "F",
        tokenName: "Frogolicious",
        tokenSymbol: "FROG",
        buyCount: 23,
        totalAmountUSD: 145700,
        totalAmountSOL: 234.5,
        walletCount: 8
      },
      {
        id: "2",
        icon: "M",
        tokenName: "MoonShot",
        tokenSymbol: "MOON", 
        buyCount: 18,
        totalAmountUSD: 89300,
        totalAmountSOL: 143.8,
        walletCount: 5
      },
      {
        id: "3",
        icon: "D",
        tokenName: "DiamondHands",
        tokenSymbol: "DIAMOND",
        buyCount: 31,
        totalAmountUSD: 203400,
        totalAmountSOL: 327.2,
        walletCount: 12
      },
      {
        id: "4",
        icon: "R",
        tokenName: "RocketFuel",
        tokenSymbol: "ROCKET",
        buyCount: 15,
        totalAmountUSD: 67800,
        totalAmountSOL: 109.2,
        walletCount: 6
      },
      {
        id: "5",
        icon: "S",
        tokenName: "StarToken",
        tokenSymbol: "STAR",
        buyCount: 42,
        totalAmountUSD: 298500,
        totalAmountSOL: 480.3,
        walletCount: 18
      },
      // Add more activities
      {
        id: "6",
        icon: "B",
        tokenName: "BullRun",
        tokenSymbol: "BULL",
        buyCount: 28,
        totalAmountUSD: 178900,
        totalAmountSOL: 288.1,
        walletCount: 9
      },
      {
        id: "7",
        icon: "L",
        tokenName: "LunarToken",
        tokenSymbol: "LUNAR",
        buyCount: 19,
        totalAmountUSD: 156200,
        totalAmountSOL: 251.6,
        walletCount: 7
      }
    ];

    let filteredData = mockData;
    
    // Highlight specific token if provided
    if (highlightToken) {
      filteredData = mockData.sort((a, b) => {
        if (a.tokenSymbol.toLowerCase() === highlightToken.toLowerCase()) return -1;
        if (b.tokenSymbol.toLowerCase() === highlightToken.toLowerCase()) return 1;
        return 0;
      });
    }

    setWalletActivities(filteredData);
  }, [timeframe, highlightToken]);

  const formatCurrency = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

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
                <Users className="w-6 h-6 text-purple-400" />
                <h1 className="text-xl font-bold text-white">All Tracked Wallet Activity</h1>
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
        {highlightToken && (
          <div className="mb-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-400 text-sm">
                Showing wallet activity for token: <span className="font-bold">${highlightToken}</span>
              </p>
            </div>
          </div>
        )}
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Tracked Wallet Buys ({timeframe})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {walletActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`p-4 rounded-lg border transition-colors ${
                    highlightToken && activity.tokenSymbol.toLowerCase() === highlightToken.toLowerCase()
                      ? 'border-yellow-500/50 bg-yellow-500/10'
                      : 'border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {activity.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium">{activity.tokenName}</div>
                      <div className="text-slate-400 text-sm">${activity.tokenSymbol}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Buys:</span>
                      <span className="text-white font-medium">{activity.buyCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total USD:</span>
                      <span className="text-white font-medium">{formatCurrency(activity.totalAmountUSD)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total SOL:</span>
                      <span className="text-white font-medium">{activity.totalAmountSOL}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Wallets:</span>
                      <span className="text-white font-medium">{activity.walletCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium flex-1">
                      Quick Buy
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      View Wallets
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllWalletActivity;
