"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, Award, Search, Filter, TrendingUp } from "lucide-react";

// Nigerian actors data
const actors = [
  {
    id: "genevieve-nnaji",
    name: "Genevieve Nnaji",
    image: "/api/placeholder/actor/Genevieve Nnaji",
    profession: "Actress, Director, Producer",
    rating: 98,
    yearsActive: "1987 - Present",
    notableWorks: ["Lionheart", "Half of a Yellow Sun", "Road to Yesterday"],
    awards: 15,
    bio: "A trailblazer in Nollywood, Genevieve Nnaji is known for her versatility and groundbreaking directorial debut.",
  },
  {
    id: "ramsey-nouah",
    name: "Ramsey Nouah",
    image: "/api/placeholder/actor/Ramsey Nouah",
    profession: "Actor, Director",
    rating: 95,
    yearsActive: "1993 - Present",
    notableWorks: ["Living in Bondage: Breaking Free", "76", "My Wife & I"],
    awards: 12,
    bio: "The 'lover boy' of Nollywood who successfully transitioned into directing, known for his romantic roles.",
  },
  {
    id: "funke-akindele",
    name: "Funke Akindele",
    image: "/api/placeholder/actor/Funke Akindele",
    profession: "Actress, Producer, Director",
    rating: 93,
    yearsActive: "1998 - Present",
    notableWorks: ["Jenifa's Diary", "Battle on Buka Street", "Omo Ghetto"],
    awards: 18,
    bio: "Comedy queen and box office champion, creator of the iconic Jenifa character.",
  },
  {
    id: "jim-iyke",
    name: "Jim Iyke",
    image: "/api/placeholder/actor/Jim Iyke",
    profession: "Actor, Producer",
    rating: 89,
    yearsActive: "2001 - Present",
    notableWorks: ["Bad Comments", "Last Flight to Abuja", "American Driver"],
    awards: 8,
    bio: "The 'bad boy' of Nollywood known for his intense dramatic performances.",
  },
  {
    id: "mercy-johnson",
    name: "Mercy Johnson",
    image: "/api/placeholder/actor/Mercy Johnson",
    profession: "Actress",
    rating: 91,
    yearsActive: "2003 - Present",
    notableWorks: ["The Legend of Inikpi", "Battle on Buka Street", "The Maid"],
    awards: 14,
    bio: "Versatile actress known for her emotional depth and ability to embody diverse characters.",
  },
  {
    id: "richard-mofe-damijo",
    name: "Richard Mofe-Damijo (RMD)",
    image: "/api/placeholder/actor/Richard Mofe-Damijo",
    profession: "Actor, Lawyer, Politician",
    rating: 87,
    yearsActive: "1988 - Present",
    notableWorks: ["The Black Book", "King of Boys", "The Wedding Party"],
    awards: 16,
    bio: "Veteran actor and former Commissioner, known for his sophisticated roles.",
  },
  {
    id: "omotola-jalade",
    name: "Omotola Jalade Ekeinde",
    image: "/api/placeholder/actor/Omotola Jalade",
    profession: "Actress, Singer, Philanthropist",
    rating: 94,
    yearsActive: "1995 - Present",
    notableWorks: ["Mortal Inheritance", "Blood Sisters", "Ije"],
    awards: 20,
    bio: "One of Africa's biggest stars, Time Magazine's 100 most influential people in 2013.",
  },
  {
    id: "nkem-owoh",
    name: "Nkem Owoh (Osuofia)",
    image: "/api/placeholder/actor/Nkem Owoh",
    profession: "Actor, Comedian",
    rating: 88,
    yearsActive: "1987 - Present",
    notableWorks: ["Osuofia in London", "The Master", "Lionheart"],
    awards: 10,
    bio: "Comic genius known for his hilarious performances and memorable characters.",
  },
  {
    id: "pete-edochie",
    name: "Pete Edochie",
    image: "/api/placeholder/actor/Pete Edochie",
    profession: "Actor",
    rating: 96,
    yearsActive: "1980 - Present",
    notableWorks: ["Things Fall Apart", "Lionheart", "King of Boys"],
    awards: 25,
    bio: "Legendary actor considered one of Africa's most talented, known for his proverbs and powerful presence.",
  },
  {
    id: "patience-ozokwor",
    name: "Patience Ozokwor (Mama G)",
    image: "/api/placeholder/actor/Patience Ozokwor",
    profession: "Actress",
    rating: 90,
    yearsActive: "1998 - Present",
    notableWorks: ["Blood Sister", "The Wedding Party", "Chief Daddy"],
    awards: 13,
    bio: "Iconic actress known for her wicked mother-in-law roles and versatile performances.",
  },
];

const professions = ["All", "Actor", "Actress", "Director", "Producer", "Comedian"];

export default function ActorsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProfession, setSelectedProfession] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("rating");

  const filteredActors = React.useMemo(() => {
    let filtered = actors;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(actor =>
        actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        actor.notableWorks.some(work => 
          work.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by profession
    if (selectedProfession !== "All") {
      filtered = filtered.filter(actor =>
        actor.profession.toLowerCase().includes(selectedProfession.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        case "awards":
          return b.awards - a.awards;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedProfession, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center space-y-6">
            <Badge variant="gradient" className="mb-4">
              <Users className="mr-2 h-4 w-4" />
              Nollywood Stars
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold gradient-text-primary">
              Actors & Actresses
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the talented individuals who bring Nigerian stories to life. 
              From legendary veterans to rising stars, explore the faces of Nollywood.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Find Your Favorite Stars</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search actors or movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Profession:</span>
                <div className="flex flex-wrap gap-1">
                  {professions.map((prof) => (
                    <Badge
                      key={prof}
                      variant={selectedProfession === prof ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedProfession(prof)}
                    >
                      {prof}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-border rounded-md bg-background text-sm"
                >
                  <option value="rating">Popularity</option>
                  <option value="name">Name</option>
                  <option value="awards">Awards</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actors Grid */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredActors.map((actor) => (
            <Card key={actor.id} className="cinema-card group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-muted">
                    <Image
                      src={actor.image}
                      alt={actor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {actor.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{actor.profession}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-nollywood-gold fill-nollywood-gold" />
                        <span className="font-bold">{actor.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-primary" />
                        <span>{actor.awards} Awards</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {actor.bio}
                  </p>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Notable Works:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {actor.notableWorks.slice(0, 3).map((work) => (
                        <Badge key={work} variant="outline" className="text-xs">
                          {work}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active: {actor.yearsActive}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredActors.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold mb-2">No actors found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 