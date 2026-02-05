import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FABProps {
  onClick: () => void;
  className?: string;
  icon?: React.ElementType;
}

export function FloatingActionButton({ onClick, className, icon: Icon = Plus }: FABProps) {
  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 90 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          "fixed bottom-20 right-4 z-40",
          "w-14 h-14 rounded-full",
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
          "flex items-center justify-center",
          "hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30",
          "transition-colors duration-200",
          className
        )}
      >
        <Icon className="w-7 h-7" strokeWidth={2.5} />
      </motion.button>
    </AnimatePresence>
  );
}
