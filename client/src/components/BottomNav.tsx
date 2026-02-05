import { Link, useLocation } from "wouter";
import { Heart, Home, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const links = [
    { href: "/love", icon: Heart, label: "Love" },
    { href: "/marriage", icon: Users, label: "Marriage" },
    { href: "/family", icon: Home, label: "Family" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = location === href || (href !== "/" && location.startsWith(href));
          return (
            <Link key={href} href={href}>
              <button
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 w-16 h-full transition-all duration-200",
                  isActive
                    ? "text-primary scale-110"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn("w-6 h-6", isActive && "fill-current")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
