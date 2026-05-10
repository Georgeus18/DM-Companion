import React, { useState, useEffect } from 'react';
import { calculateModifier, calculateProficiencyBonus } from '../types/character';
import type { Character } from '../types/character';
import { fetchClasses, fetchRaces, fetchAlignments } from '../services/api';
import type { ReferenceItem } from '../services/api';
import { Shield, Heart, Zap, Save, X } from 'lucide-react';

interface CharacterSheetProps {
  character: Character;
  onSave: (character: Character) => void;
  onCancel: () => void;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Character>(character);
  const [classes, setClasses] = useState<ReferenceItem[]>([]);
  const [races, setRaces] = useState<ReferenceItem[]>([]);
  const [alignments, setAlignments] = useState<ReferenceItem[]>([]);

  useEffect(() => {
    setFormData(character);
  }, [character]);

  useEffect(() => {
    Promise.all([fetchClasses(), fetchRaces(), fetchAlignments()])
      .then(([classesData, racesData, alignmentsData]) => {
        setClasses(classesData);
        setRaces(racesData);
        setAlignments(alignmentsData);
      })
      .catch(err => console.error('Failed to fetch reference data', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.') as [keyof Character, string];
      const parentValue = formData[parent];
      if (typeof parentValue === 'object' && parentValue !== null && !Array.isArray(parentValue)) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...parentValue,
            [child]: parseInt(value) || 0
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.type === 'number' ? parseInt(value) || 0 : value
      }));
    }
  };

  useEffect(() => {
    const newProf = calculateProficiencyBonus(formData.level);
    if (newProf !== formData.proficiencyBonus) {
      setFormData(prev => ({ ...prev, proficiencyBonus: newProf }));
    }
  }, [formData.level]);

  useEffect(() => {
    const wisMod = calculateModifier(formData.abilityScores.wisdom);
    const newPassive = 10 + wisMod;
    if (newPassive !== formData.passivePerception) {
      setFormData(prev => ({ ...prev, passivePerception: newPassive }));
    }
  }, [formData.abilityScores.wisdom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderAbility = (label: string, name: keyof Character['abilityScores']) => {
    const score = formData.abilityScores[name];
    const mod = calculateModifier(score);
    return (
      <div className="ability-field" key={name}>
        <label>{label}</label>
        <input 
          type="number" 
          name={`abilityScores.${name}`} 
          value={score} 
          onChange={handleChange}
        />
        <span className="mod-display">({mod >= 0 ? `+${mod}` : mod})</span>
      </div>
    );
  };

  return (
    <div className="character-sheet-modal">
      <form onSubmit={handleSubmit} className="character-sheet">
        <header className="sheet-header">
          <div className="header-top">
            <input 
              className="name-input" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Character Name"
              required 
            />
            <div className="header-actions">
              <button type="submit" className="btn-save"><Save size={18} /> Save</button>
              <button type="button" className="btn-cancel" onClick={onCancel}><X size={18} /></button>
            </div>
          </div>
          <div className="header-meta">
            <select name="class" value={formData.class} onChange={handleChange}>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.index} value={c.name}>{c.name}</option>)}
              {!classes.some(c => c.name === formData.class) && formData.class && (
                <option value={formData.class}>{formData.class}</option>
              )}
            </select>
            
            <div className="input-with-label">
              <label>Level</label>
              <input type="number" name="level" value={formData.level} onChange={handleChange} min="1" max="20" />
            </div>

            <select name="race" value={formData.race} onChange={handleChange}>
              <option value="">Select Race</option>
              {races.map(r => <option key={r.index} value={r.name}>{r.name}</option>)}
              {!races.some(r => r.name === formData.race) && formData.race && (
                <option value={formData.race}>{formData.race}</option>
              )}
            </select>

            <select name="alignment" value={formData.alignment} onChange={handleChange}>
              <option value="">Select Alignment</option>
              {alignments.map(a => <option key={a.index} value={a.name}>{a.name}</option>)}
              {!alignments.some(a => a.name === formData.alignment) && formData.alignment && (
                <option value={formData.alignment}>{formData.alignment}</option>
              )}
            </select>
          </div>
        </header>

        <div className="sheet-body">
          <div className="sheet-column-left">
            <div className="abilities-grid">
              {renderAbility('Strength', 'strength')}
              {renderAbility('Dexterity', 'dexterity')}
              {renderAbility('Constitution', 'constitution')}
              {renderAbility('Intelligence', 'intelligence')}
              {renderAbility('Wisdom', 'wisdom')}
              {renderAbility('Charisma', 'charisma')}
            </div>
            
            <div className="derived-stats">
              <div className="derived-field">
                <label>Proficiency Bonus</label>
                <input type="number" value={formData.proficiencyBonus} readOnly />
              </div>
              <div className="derived-field">
                <label>Passive Perception</label>
                <input type="number" value={formData.passivePerception} readOnly />
              </div>
            </div>
          </div>

          <div className="sheet-column-main">
            <div className="combat-stats">
              <div className="combat-stat">
                <Shield size={20} />
                <label>Armor Class</label>
                <input type="number" name="ac" value={formData.ac} onChange={handleChange} />
              </div>
              <div className="combat-stat">
                <Zap size={20} />
                <label>Initiative</label>
                <input type="number" name="initiative" value={formData.initiative} onChange={handleChange} />
              </div>
              <div className="combat-stat">
                <Heart size={20} />
                <label>HP Max</label>
                <input type="number" name="hpMax" value={formData.hpMax} onChange={handleChange} />
              </div>
            </div>

            <div className="textarea-group">
              <label>Proficiencies & Languages</label>
              <textarea 
                name="proficiencies" 
                value={formData.proficiencies.join(', ')} 
                onChange={(e) => setFormData(prev => ({ ...prev, proficiencies: e.target.value.split(',').map(s => s.trim()) }))}
                placeholder="List proficiencies..."
              />
            </div>

            <div className="textarea-group">
              <label>Equipment</label>
              <textarea name="equipment" value={formData.equipment} onChange={handleChange} placeholder="Items, weapons, gold..." />
            </div>

            <div className="textarea-group">
              <label>Character Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Backstory, goals, personality..." />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
