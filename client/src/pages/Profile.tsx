import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Crown, Shield, Bell, HelpCircle, CreditCard, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const [showSubscription, setShowSubscription] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);

  // Settings state (mock)
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(true);

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen bg-background">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground font-display mb-6">Profile</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20 border-2 border-primary">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-sm text-muted-foreground">Free Member</p>
            <Button 
              variant="link" 
              className="px-0 h-auto text-primary font-semibold"
              onClick={() => setShowSubscription(true)}
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>

        {/* Membership Card */}
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-white border-none shadow-lg mb-8">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                Premium Access
              </p>
              <p className="text-primary-foreground/80 text-sm">Unlock all widget slots & unlimited storage</p>
            </div>
            <Button 
              size="sm" 
              className="bg-white text-primary hover:bg-white/90 font-bold"
              onClick={() => setShowSubscription(true)}
            >
              Subscribe
            </Button>
          </CardContent>
        </Card>

        {/* Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent text-primary">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="font-medium">Notifications</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-medium">Privacy Mode</span>
              </div>
              <Switch checked={privacy} onCheckedChange={setPrivacy} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent text-primary">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">Customer Center</span>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground">Open</Button>
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Subscription Modal */}
      <Dialog open={showSubscription} onOpenChange={(open) => { setShowSubscription(open); if(!open) setPaymentStep(false); }}>
        <DialogContent className="sm:max-w-[425px]">
          {!paymentStep ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">Unlock Everything</DialogTitle>
                <DialogDescription className="text-center">
                  Get the most out of your family relationship management.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="grid gap-3">
                  {[
                    "Unlimited Photo Storage",
                    "Advanced Budget Analytics",
                    "Custom Widgets",
                    "Priority Support"
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="bg-green-100 text-green-600 rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-accent/50 p-4 rounded-xl text-center">
                  <span className="text-3xl font-bold">$4.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full text-lg h-12" onClick={() => setPaymentStep(true)}>
                  Subscribe Now
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Payment Method</DialogTitle>
              </DialogHeader>
              <div className="py-6 grid gap-4">
                 <motion.button 
                   whileTap={{ scale: 0.98 }}
                   className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5 relative"
                 >
                   <CreditCard className="w-6 h-6 text-primary" />
                   <div className="text-left">
                     <p className="font-bold">Credit Card</p>
                     <p className="text-xs text-muted-foreground">**** 1234</p>
                   </div>
                   <div className="ml-auto bg-primary text-white rounded-full p-1">
                     <Check className="w-3 h-3" />
                   </div>
                 </motion.button>
                 
                 <motion.button 
                   whileTap={{ scale: 0.98 }}
                   className="flex items-center gap-4 p-4 rounded-xl border hover:border-primary/50 transition-colors"
                 >
                   <div className="w-6 h-6 rounded bg-black" /> 
                   <span className="font-medium">Apple Pay</span>
                 </motion.button>
              </div>
              <DialogFooter>
                <Button className="w-full" onClick={() => { setShowSubscription(false); setPaymentStep(false); }}>
                  Confirm Payment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
