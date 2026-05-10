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

export interface EquipmentSummary {
  index: string;
  name: string;
  equipment_category: { name: string; index: string };
}

export interface EquipmentDetail {
  index: string;
  name: string;
  equipment_category: { name: string; index: string };
  weapon_category?: string;
  weapon_range?: string;
  category_range?: string;
  cost: { quantity: number; unit: string };
  damage?: { damage_dice: string; damage_type: { name: string } };
  range?: { normal: number; long: number | null };
  weight?: number;
  properties?: { name: string }[];
  armor_category?: string;
  armor_class?: { base: number; dex_bonus: boolean; max_bonus: number | null };
  str_minimum?: number;
  stealth_disadvantage?: boolean;
  desc?: string[];
  tool_category?: string;
  vehicle_category?: string;
  gear_category?: { name: string };
}

export interface ReferenceItem {
  index: string;
  name: string;
  url: string;
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

export async function fetchEquipment(): Promise<EquipmentSummary[]> {
  const categories = ['weapon', 'armor', 'adventuring-gear', 'tools', 'mounts-and-vehicles'];
  
  try {
    const categoryPromises = categories.map(async (catIndex) => {
      const response = await fetch(`${BASE_URL}/equipment-categories/${catIndex}`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.equipment.map((item: any) => ({
        ...item,
        equipment_category: { index: catIndex, name: data.name }
      }));
    });

    const results = await Promise.all(categoryPromises);
    const flatResults = results.flat();
    
    // Remove duplicates just in case some items appear in multiple categories
    const uniqueResults = Array.from(new Map(flatResults.map(item => [item.index, item])).values());
    
    return uniqueResults;
  } catch (error) {
    console.error('Failed to fetch equipment by categories:', error);
    const response = await fetch(`${BASE_URL}/equipment`);
    const data = await response.json();
    return data.results;
  }
}

export async function fetchEquipmentDetail(index: string): Promise<EquipmentDetail> {
  const response = await fetch(`${BASE_URL}/equipment/${index}`);
  if (!response.ok) throw new Error(`Failed to fetch equipment: ${index}`);
  return response.json();
}

export async function fetchClasses(): Promise<ReferenceItem[]> {
  const response = await fetch(`${BASE_URL}/classes`);
  const data = await response.json();
  return data.results;
}

export async function fetchRaces(): Promise<ReferenceItem[]> {
  const response = await fetch(`${BASE_URL}/races`);
  const data = await response.json();
  return data.results;
}

export async function fetchAlignments(): Promise<ReferenceItem[]> {
  const response = await fetch(`${BASE_URL}/alignments`);
  const data = await response.json();
  return data.results;
}
