export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  faccion: string;
  valor: number;
}

export interface Team {
  teamName: string;
  members: Character[];
}

export interface SavedTeamSet {
  id: string;
  name: string;
  teams: Team[];
}