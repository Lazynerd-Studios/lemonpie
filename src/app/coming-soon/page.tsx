import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Bell } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center space-y-6">
            <Badge variant="warning" className="mb-4">
              <Calendar className="mr-2 h-4 w-4" />
              Coming Soon
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold gradient-text-gold">
              Upcoming Releases
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get ready for the next wave of Nigerian cinema. From blockbusters to indie gems, 
              discover what&apos;s coming to screens near you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gradient" size="lg">
                <Bell className="mr-2 h-5 w-5" />
                Set Reminders
              </Button>
              <Button variant="outline" size="lg">
                <Clock className="mr-2 h-5 w-5" />
                Release Calendar
              </Button>
            </div>
            <div className="pt-12">
              <div className="cinema-card inline-block p-8">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-2xl font-bold gradient-text-primary mb-2">
                  Release Calendar Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  We&apos;re building a comprehensive calendar of upcoming Nollywood releases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 