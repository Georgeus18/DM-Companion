import React, { useState } from 'react';
import { INITIAL_ABILITY_SCORES } from '../types/character';
import type { Character } from '../types/character';
import { loadCharacters, addCharacter, updateCharacter, deleteCharacter } from '../services/storage';
import { CharacterSheet } from './CharacterSheet';
import { Plus, User, Edit2, Trash2 } from 'lucide-react';

export const CharacterManager: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>(() => loadCharacters());
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const handleCreateNew = () => {
    const newChar: Character = {
      id: Date.now().toString(),
      name: '',
      class: '',
      level: 1,
      race: '',
      alignment: '',
      xp: 0,
      abilityScores: { ...INITIAL_ABILITY_SCORES },
      hpMax: 10,
      hpCurrent: 10,
      ac: 10,
      initiative: 0,
      speed: 30,
      proficiencyBonus: 2,
      passivePerception: 10,
      proficiencies: [],
      equipment: '',
      currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
      spells: '',
      notes: '',
      createdAt: Date.now(),
    };
    setEditingCharacter(newChar);
  };

  const handleSave = (char: Character) => {
    const exists = characters.find(c => c.id === char.id);
    if (exists) {
      updateCharacter(char);
    } else {
      addCharacter(char);
    }
    setCharacters(loadCharacters());
    setEditingCharacter(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this character?')) {
      deleteCharacter(id);
      setCharacters(loadCharacters());
    }
  };

  return (
    <div className="character-manager">
      <div className="manager-header">
        <h2>My Characters</h2>
        <button className="btn-add" onClick={handleCreateNew}>
          <Plus size={18} /> New Character
        </button>
      </div>

      <div className="characters-grid">
        {characters.length === 0 ? (
          <div className="empty-characters">
            <User size={48} />
            <p>No characters created yet.</p>
          </div>
        ) : (
          characters.map((char) => (
            <div key={char.id} className="character-card" onClick={() => setEditingCharacter(char)}>
              <div className="card-info">
                <h3>{char.name || 'Unnamed Character'}</h3>
                <p>{char.race} {char.class} (Level {char.level})</p>
              </div>
              <div className="card-actions">
                <button className="btn-icon" title="Edit"><Edit2 size={16} /></button>
                <button className="btn-icon delete" onClick={(e) => handleDelete(char.id, e)} title="Delete"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingCharacter && (
        <CharacterSheet 
          character={editingCharacter} 
          onSave={handleSave} 
          onCancel={() => setEditingCharacter(null)} 
        />
      )}
    </div>
  );
};
