
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Activity, Users, BarChart3, Eye, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "Trending Tokens",
      description: "Track tokens by volume, activity, and social signals",
      color: "text-green-500"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Live data with customizable timeframes",
      color: "text-blue-500"
    },
    {
      icon: Users,
      title: "Wallet Tracking",
      description: "Monitor smart money and whale activities",
      color: "text-purple-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Sort, filter, and analyze market data",
      color: "text-orange-500"
    },
    {
      icon: Eye,
      title: "Social Signals",
      description: "Twitter mentions and community activity",
      color: "text-cyan-500"
    },
    {
      icon: Zap,
      title: "Fast Discovery",
      description: "Find momentum plays with confidence",
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">🍌</span>
              </div>
              <h1 className="text-xl font-bold text-white">BananaGun</h1>
            </div>
            <Button 
              onClick={() => navigate('/trending')}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 font-semibold"
            >
              Launch Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Trending Token
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Discovery</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Track trending tokens by volume, social signals, and smart money activity. 
            Discover momentum plays faster with confidence.
          </p>
          <Button 
            onClick={() => navigate('/trending')}
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 font-semibold text-lg px-8 py-3"
          >
            Start Trading
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-6">
                <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to discover the next big move?</h2>
            <p className="text-slate-300 mb-6">
              Join thousands of traders using BananaGun to spot trending tokens before the crowd.
            </p>
            <Button 
              onClick={() => navigate('/trending')}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 font-semibold"
            >
              Access Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
