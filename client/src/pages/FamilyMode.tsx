import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvents } from "@/hooks/use-events";
import { usePhotos, useCreatePhoto } from "@/hooks/use-photos";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { EventModal } from "@/components/EventModal";
import { Calendar as CalendarIcon, Image as ImageIcon, MapPin, Clock, Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function FamilyMode() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("calendar");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const { data: events, isLoading: eventsLoading } = useEvents("family");
  const { data: photos, isLoading: photosLoading } = usePhotos("family");
  const createPhotoMutation = useCreatePhoto();

  // Filter events for selected day
  const selectedDayEvents = events?.filter(e => date && isSameDay(new Date(e.date), date)) || [];
  
  const handleEventClick = (eventId: number) => {
    setSelectedEventId(eventId);
    setIsEventModalOpen(true);
  };

  const handleFabClick = () => {
    if (activeTab === "calendar") {
      setSelectedEventId(null);
      setIsEventModalOpen(true);
    } else {
      // Mock upload photo
      const url = `https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=60`;
      createPhotoMutation.mutate({
        url,
        mode: "family",
        userId: 1,
        caption: "Family memory"
      });
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen bg-background">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground font-display">Family</h1>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <CalendarIcon className="w-5 h-5 text-primary" />
        </div>
      </header>

      <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border bg-card"
            />
          </Card>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {date ? format(date, "MMMM do") : "Select a date"}
            </h3>
            
            {eventsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : selectedDayEvents.length > 0 ? (
              <div className="grid gap-3">
                {selectedDayEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleEventClick(event.id)}
                  >
                    <Card className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-primary">
                      <CardContent className="p-4 flex flex-col gap-1">
                        <span className="font-semibold text-foreground">{event.title}</span>
                        {event.description && (
                          <span className="text-sm text-muted-foreground line-clamp-1">{event.description}</span>
                        )}
                        <span className="text-xs text-muted-foreground mt-1 bg-accent self-start px-2 py-0.5 rounded-full">
                          {format(new Date(event.date), "h:mm a")}
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-accent/30 rounded-xl border border-dashed border-accent">
                <p>No events scheduled</p>
                <p className="text-xs mt-1">Tap + to add one</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          {photosLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos?.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-sm"
                >
                  <img src={photo.url} alt={photo.caption || "Family photo"} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-xs font-medium truncate">{photo.caption}</p>
                  </div>
                </motion.div>
              ))}
              {/* Fallback empty state */}
              {(!photos || photos.length === 0) && (
                <div className="col-span-2 text-center py-12 text-muted-foreground bg-accent/30 rounded-xl border border-dashed border-accent">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No photos yet</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <FloatingActionButton 
        onClick={handleFabClick} 
        icon={createPhotoMutation.isPending ? Loader2 : Plus}
        className={createPhotoMutation.isPending ? "animate-pulse" : ""}
      />

      <EventModal
        open={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        event={events?.find(e => e.id === selectedEventId)}
        defaultDate={date}
        mode="family"
      />
    </div>
  );
}
