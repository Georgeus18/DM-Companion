import type { Character } from '../types/character';

const STORAGE_KEY = 'dm_companion_characters';

export const saveCharacters = (characters: Character[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
};

export const loadCharacters = (): Character[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load characters', e);
    return [];
  }
};

export const addCharacter = (character: Character): void => {
  const characters = loadCharacters();
  saveCharacters([...characters, character]);
};

export const updateCharacter = (character: Character): void => {
  const characters = loadCharacters();
  const index = characters.findIndex((c) => c.id === character.id);
  if (index !== -1) {
    characters[index] = character;
    saveCharacters(characters);
  }
};

export const deleteCharacter = (id: string): void => {
  const characters = loadCharacters();
  saveCharacters(characters.filter((c) => c.id !== id));
};
