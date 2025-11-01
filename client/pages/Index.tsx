import { Link } from "react-router-dom";
import { Play, Film, Tv, RefreshCw, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCookie } from "@/hooks/useCookie";
import { useState } from "react";

export default function Index() {
  const { tHash, loading, error, fetchCookie, hasCookie } = useCookie();
  const [copied, setCopied] = useState(false);
  const services = [
    {
      id: "netflix",
      name: "Netflix",
      icon: Play,
      description: "Search for movies and series on Netflix",
      color: "from-red-600 to-red-800",
      path: "/netflix",
    },
    {
      id: "prime",
      name: "Amazon Prime",
      icon: Film,
      description: "Search for movies and series on Amazon Prime",
      color: "from-blue-600 to-blue-800",
      path: "/amazon-prime",
    },
    {
      id: "hotstar",
      name: "JioHotstar",
      icon: Tv,
      description: "Search for movies and series on JioHotstar",
      color: "from-purple-600 to-purple-800",
      path: "/jio-hotstar",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="pt-20 px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tighter">
            IOSMIRROR
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-2">
            Streaming Content Discovery
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Search for movies and series across your favorite streaming platforms
          </p>
        </div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.id} to={service.path}>
                  <div className="group h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-slate-500 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 transform hover:scale-105 cursor-pointer">
                    <div
                      className={`bg-gradient-to-br ${service.color} rounded-xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-slate-400 mb-6">{service.description}</p>

                    <Button
                      asChild
                      className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white border-0`}
                    >
                      <span>Search Now</span>
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-12 border-t border-slate-800 mt-12">
          <p className="text-slate-500 text-sm">
            IOSMIRROR © 2024. Search movies and series across streaming platforms.
          </p>
        </div>
      </div>

      {/* Cookie Status Indicator */}
      <CookieStatus />
    </div>
  );
}
