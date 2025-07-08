export interface Actor {
  id: string;
  name: string;
  image: string;
  rating: number;
}

export interface CastMember {
  name: string;
  character: string;
  image?: string;
}

export interface CrewMember {
  name: string;
  role: string;
  image?: string;
} 