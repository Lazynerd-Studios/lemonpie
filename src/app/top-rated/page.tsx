import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, TrendingUp, Star } from "lucide-react";

export default function TopRatedPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center space-y-6">
            <Badge variant="gradient-gold" className="mb-4">
              <Award className="mr-2 h-4 w-4" />
              Top Rated
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold gradient-text-gold">
              Best of Nollywood
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The highest-rated Nigerian films of all time. Critically acclaimed masterpieces 
              that showcase the finest in African storytelling and filmmaking excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gradient-gold" size="lg">
                <Star className="mr-2 h-5 w-5" />
                View Rankings
              </Button>
              <Button variant="outline" size="lg">
                <TrendingUp className="mr-2 h-5 w-5" />
                Trending Now
              </Button>
            </div>
            <div className="pt-12">
              <div className="cinema-card inline-block p-8">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold gradient-text-primary mb-2">
                  Top Rated Movies Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  We&apos;re compiling the definitive list of Nollywood&apos;s greatest films.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 