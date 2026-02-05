import { useState, useEffect } from "react";
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/use-events";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@shared/schema";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event;
  defaultDate?: Date;
  mode: "love" | "marriage" | "family";
}

export function EventModal({ open, onOpenChange, event, defaultDate, mode }: EventModalProps) {
  const { toast } = useToast();
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(defaultDate || new Date());

  // Reset form when opening/changing event
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setDate(new Date(event.date));
    } else {
      setTitle("");
      setDescription("");
      setDate(defaultDate || new Date());
    }
  }, [event, defaultDate, open]);

  const handleSubmit = async () => {
    if (!title || !date) {
      toast({ title: "Validation Error", description: "Title and Date are required.", variant: "destructive" });
      return;
    }

    try {
      if (event) {
        await updateMutation.mutateAsync({
          id: event.id,
          title,
          description,
          date: date.toISOString(),
          mode,
          userId: 1,
        });
        toast({ title: "Event updated" });
      } else {
        await createMutation.mutateAsync({
          title,
          description,
          date: date.toISOString(),
          mode,
          userId: 1,
        });
        toast({ title: "Event created" });
      }
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteMutation.mutateAsync(event.id);
      toast({ title: "Event deleted" });
      onOpenChange(false);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "New Event"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Dinner Date" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details..." />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          {event && (
            <Button variant="destructive" onClick={handleDelete} disabled={isPending} type="button">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isPending} className="bg-primary hover:bg-primary/90">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {event ? "Save Changes" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
