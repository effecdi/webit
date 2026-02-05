import { useWidgets } from "@/hooks/use-widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Lock, Calendar, MessageCircle, Star } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function LoveMode() {
  const { data: widgets } = useWidgets();
  
  // Widget Grid
  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen bg-background">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4 shadow-sm">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h1 className="text-3xl font-bold font-display text-foreground">Love Mode</h1>
        <p className="text-muted-foreground">Days together: <span className="text-primary font-bold">1,024</span></p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Widget 1: D-Day */}
        <motion.div whileHover={{ scale: 1.02 }} className="col-span-2">
          <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-none shadow-lg">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-pink-100 font-medium text-sm">Next Anniversary</p>
                <h3 className="text-2xl font-bold">Oct 15, 2025</h3>
              </div>
              <Calendar className="w-8 h-8 text-pink-100/50" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Widget 2: Photo Memory */}
        <motion.div whileHover={{ scale: 1.02 }} className="aspect-square">
          <Card className="h-full overflow-hidden relative group">
             {/* couples looking at sunset */}
            <img 
              src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&auto=format&fit=crop&q=60" 
              alt="Memory" 
              className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-3 left-3 text-white">
              <p className="font-bold text-sm">Memories</p>
            </div>
          </Card>
        </motion.div>

        {/* Widget 3: Couple Chat */}
        <motion.div whileHover={{ scale: 1.02 }} className="aspect-square">
          <Card className="h-full bg-blue-50 border-blue-100 flex flex-col items-center justify-center text-blue-600 gap-2 cursor-pointer hover:bg-blue-100 transition-colors">
            <MessageCircle className="w-8 h-8" />
            <span className="font-semibold text-sm">Couple Chat</span>
          </Card>
        </motion.div>

        {/* Widget 4: Premium (Locked) */}
        <motion.div whileHover={{ scale: 1.02 }} className="col-span-2">
          <Card className="bg-zinc-50 border-zinc-200 relative overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-[2px] z-10 flex items-center justify-center bg-white/40">
              <div className="bg-white/90 p-2 rounded-full shadow-sm">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 opacity-50">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Premium Insights</h3>
                  <p className="text-sm text-muted-foreground">Unlock relationship analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="text-center">
        <Link href="/profile">
          <Button variant="outline" className="gap-2">
            View Membership Options
          </Button>
        </Link>
      </div>
    </div>
  );
}
