const BASE_URL = 'https://www.dnd5eapi.co/api/2014';
const GRAPHQL_URL = 'https://www.dnd5eapi.co/graphql';

export interface MonsterSummary {
  index: string;
  name: string;
  challenge_rating: number;
  type: string;
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
  const query = `
    query {
      monsters(limit: 500) {
        index
        name
        challenge_rating
        type
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) throw new Error('Failed to fetch monsters from GraphQL');
  const result = await response.json();
  return result.data.monsters;
}

export async function fetchMonsterDetail(index: string): Promise<MonsterDetail> {
  const response = await fetch(`${BASE_URL}/monsters/${index}`);
  if (!response.ok) throw new Error(`Failed to fetch monster: ${index}`);
  return response.json();
}
