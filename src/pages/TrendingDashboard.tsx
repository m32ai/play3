
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TrendingTokensTable from "@/components/trending/TrendingTokensTable";
import TwitterTrendingWidget from "@/components/trending/TwitterTrendingWidget";
import TrackedWalletActivity from "@/components/trending/TrackedWalletActivity";

const TrendingDashboard = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState("24h");

  const timeframes = [
    { value: "5m", label: "5 minutes" },
    { value: "1h", label: "1 hour" },
    { value: "4h", label: "4 hours" },
    { value: "12h", label: "12 hours" },
    { value: "24h", label: "24 hours" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
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
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-sm">🍌</span>
                </div>
                <h1 className="text-xl font-bold text-white">Trending Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-slate-300 text-sm">Timeframe:</span>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {timeframes.map((tf) => (
                      <SelectItem key={tf.value} value={tf.value} className="text-white hover:bg-slate-700">
                        {tf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Trending Table - Full Width on Large Screens */}
          <div className="lg:col-span-2">
            <TrendingTokensTable timeframe={timeframe} />
          </div>
          
          {/* Side Widgets */}
          <div className="space-y-6">
            <TwitterTrendingWidget timeframe={timeframe} />
            <TrackedWalletActivity timeframe={timeframe} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingDashboard;
