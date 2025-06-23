
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

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

const TrackedWalletActivity = ({ timeframe }: { timeframe: string }) => {
  const [walletActivities, setWalletActivities] = useState<WalletActivity[]>([]);

  useEffect(() => {
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
      }
    ];

    setWalletActivities(mockData);
  }, [timeframe]);

  const formatCurrency = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const handleAddToDashboard = () => {
    console.log('Add Tracked Wallet Activity to dashboard clicked');
    // Implement add to dashboard logic here
  };

  const handleViewWallets = (activity: WalletActivity) => {
    console.log('View wallets clicked for:', activity.tokenSymbol);
    // Implement view wallets logic here
  };

  const handleViewAllActivity = () => {
    console.log('View All Wallet Activity clicked');
    // Implement view all activity logic here
  };

  const handleActivityClick = (activity: WalletActivity) => {
    console.log('Wallet activity clicked:', activity.tokenSymbol);
    // Implement activity click logic here
  };

  const handleQuickBuy = (activity: WalletActivity) => {
    console.log('Quick buy clicked for wallet activity token:', activity.tokenSymbol);
    // Implement quick buy logic here
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Tracked Wallet Buys
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
        <div className="space-y-3">
          {walletActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="p-3 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer border border-slate-700/50 group"
              onClick={() => handleActivityClick(activity)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {activity.icon}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{activity.tokenName}</div>
                    <div className="text-slate-400 text-xs">${activity.tokenSymbol}</div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium text-xs h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickBuy(activity);
                  }}
                >
                  Buy
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Buys</div>
                  <div className="text-white font-medium">{activity.buyCount}</div>
                </div>
                <div>
                  <div className="text-slate-400">Total Amount</div>
                  <div className="text-white font-medium">{formatCurrency(activity.totalAmountUSD)}</div>
                  <div className="text-slate-400 text-xs">{activity.totalAmountSOL} SOL</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/50">
                <div className="text-xs">
                  <span className="text-white font-medium">{activity.walletCount} Wallets</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-400 hover:text-blue-300 text-xs h-6 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewWallets(activity);
                  }}
                >
                  View Wallets
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-700">
          <Button 
            variant="ghost" 
            className="w-full text-blue-400 hover:text-blue-300 text-sm h-8"
            onClick={handleViewAllActivity}
          >
            View All Wallet Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackedWalletActivity;
