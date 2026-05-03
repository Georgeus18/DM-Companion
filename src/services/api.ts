const BASE_URL = 'https://www.dnd5eapi.co/api/2014';

export interface MonsterSummary {
  index: string;
  name: string;
  url: string;
}

export interface MonsterListResponse {
  count: number;
  results: MonsterSummary[];
}

export interface MonsterDetail {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: { type: string; value: number }[];
  hit_points: number;
  hit_dice: string;
  hit_points_roll: string;
  speed: Record<string, string>;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: { value: number; proficiency: { name: string } }[];
  senses: Record<string, string | number>;
  languages: string;
  challenge_rating: number;
  xp: number;
  special_abilities?: { name: string; desc: string }[];
  actions?: { name: string; desc: string }[];
  legendary_actions?: { name: string; desc: string }[];
}

export async function fetchMonsters(): Promise<MonsterSummary[]> {
  const response = await fetch(`${BASE_URL}/monsters`);
  if (!response.ok) throw new Error('Failed to fetch monsters');
  const data: MonsterListResponse = await response.json();
  return data.results;
}

export async function fetchMonsterDetail(index: string): Promise<MonsterDetail> {
  const response = await fetch(`${BASE_URL}/monsters/${index}`);
  if (!response.ok) throw new Error(`Failed to fetch monster: ${index}`);
  return response.json();
}
