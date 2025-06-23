
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Settings, TrendingUp, Banana } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TrendingTokensTable from "@/components/trending/TrendingTokensTable";
import TwitterTrendingWidget from "@/components/trending/TwitterTrendingWidget";
import TrackedWalletActivity from "@/components/trending/TrackedWalletActivity";

const TrendingDashboard = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState("5m");
  const [buyAmount, setBuyAmount] = useState("0.1");

  const timeframes = [
    { value: "1m", label: "1m" },
    { value: "5m", label: "5m" },
    { value: "30m", label: "30m" },
    { value: "1h", label: "1h" },
    { value: "4h", label: "4h" },
    { value: "24h", label: "24h" }
  ];

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
                  onClick={() => navigate('/')}
                  className="text-slate-300 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-yellow-500" />
                  <h1 className="text-xl font-bold text-white">Trending</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
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
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <Settings className="w-4 h-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="w-20 h-9 bg-slate-700 border-slate-600 text-white text-sm"
                    placeholder="0.1"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
                        <Banana className="w-4 h-4 mr-2" />
                        {buyAmount} SOL
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Quick Buy</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Trending Table - Takes up more space */}
            <div className="lg:col-span-3">
              <TrendingTokensTable timeframe={timeframe} buyAmount={buyAmount} />
            </div>
            
            {/* Side Widgets - Smaller column */}
            <div className="space-y-6">
              <TwitterTrendingWidget timeframe={timeframe} buyAmount={buyAmount} />
              <TrackedWalletActivity timeframe={timeframe} buyAmount={buyAmount} />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TrendingDashboard;
