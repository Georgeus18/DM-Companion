export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  subclass: string;
  level: number;
  race: string;
  alignment: string;
  xp: number;
  abilityScores: AbilityScores;
  hpMax: number;
  hpCurrent: number;
  ac: number;
  initiative: number;
  speed: number;
  proficiencyBonus: number;
  passivePerception: number;
  proficiencies: string[];
  equipment: string;
  currency: {
    cp: number;
    sp: number;
    ep: number;
    gp: number;
    pp: number;
  };
  spells: string;
  notes: string;
  createdAt: number;
}

export const INITIAL_ABILITY_SCORES: AbilityScores = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
};

export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

export const calculateProficiencyBonus = (level: number): number => {
  return Math.floor((level - 1) / 4) + 2;
};
