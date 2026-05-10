import React, { useState, useEffect, useMemo } from 'react';
import { calculateModifier, calculateProficiencyBonus } from '../types/character';
import type { Character } from '../types/character';
import { fetchClasses, fetchRaces, fetchAlignments, fetchSubclasses, fetchInteractiveSpells } from '../services/api';
import type { ReferenceItem, SpellInteractive } from '../services/api';
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
  const [subclasses, setSubclasses] = useState<ReferenceItem[]>([]);
  const [allSpells, setAllSpells] = useState<SpellInteractive[]>([]);

  useEffect(() => {
    setFormData(character);
  }, [character]);

  useEffect(() => {
    Promise.all([fetchClasses(), fetchRaces(), fetchAlignments(), fetchInteractiveSpells()])
      .then(([classesData, racesData, alignmentsData, spellsData]) => {
        setClasses(classesData);
        setRaces(racesData);
        setAlignments(alignmentsData);
        setAllSpells(spellsData);
      })
      .catch(err => console.error('Failed to fetch reference data', err));
  }, []);

  useEffect(() => {
    if (formData.class) {
      fetchSubclasses(formData.class).then(setSubclasses);
      setFormData(prev => ({ ...prev, subclass: '' })); // Reset subclass on class change
    } else {
      setSubclasses([]);
    }
  }, [formData.class]);

  const availableSpells = useMemo(() => {
    if (!formData.class) return [];
    const classIndex = formData.class.toLowerCase();
    // Simplified rule: max spell level is ceil(character level / 2)
    const maxSpellLevel = Math.ceil(formData.level / 2);
    
    return allSpells.filter(spell => {
      const isForClass = spell.classes.some(c => c.index === classIndex);
      const isCorrectLevel = spell.level <= maxSpellLevel;
      return isForClass && isCorrectLevel;
    });
  }, [allSpells, formData.class, formData.level]);

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

  const handleAddSpell = (spellName: string) => {
    if (!spellName) return;
    const currentSpells = formData.spells ? formData.spells.split('\n').filter(s => s.trim()) : [];
    if (!currentSpells.includes(spellName)) {
      setFormData(prev => ({
        ...prev,
        spells: [...currentSpells, spellName].join('\n')
      }));
    }
  };

  const handleRemoveSpell = (spellName: string) => {
    const currentSpells = formData.spells.split('\n').filter(s => s.trim());
    setFormData(prev => ({
      ...prev,
      spells: currentSpells.filter(s => s !== spellName).join('\n')
    }));
  };

  useEffect(() => {
    const newProf = calculateProficiencyBonus(formData.level);
    if (newProf !== formData.proficiencyBonus) {
      setFormData(prev => ({ ...prev, proficiencyBonus: newProf }));
    }
  }, [formData.level, formData.proficiencyBonus]);

  useEffect(() => {
    const wisMod = calculateModifier(formData.abilityScores.wisdom);
    const newPassive = 10 + wisMod;
    if (newPassive !== formData.passivePerception) {
      setFormData(prev => ({ ...prev, passivePerception: newPassive }));
    }
  }, [formData.abilityScores.wisdom, formData.passivePerception]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderAbility = (label: string, name: keyof Character['abilityScores']) => {
    const score = formData.abilityScores[name];
    const mod = calculateModifier(score);
    return (
      <div className="ability-score-box" key={name}>
        <label>{label}</label>
        <input 
          type="number" 
          name={`abilityScores.${name}`} 
          value={score} 
          onChange={handleChange}
        />
        <span className="mod-display">{mod >= 0 ? `+${mod}` : mod}</span>
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
              <button type="submit" className="btn-save" title="Save Character"><Save size={18} /> Save</button>
              <button type="button" className="btn-cancel" onClick={onCancel} title="Close"><X size={18} /></button>
            </div>
          </div>
          <div className="header-meta">
            <select name="class" value={formData.class} onChange={handleChange} required>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.index} value={c.name}>{c.name}</option>)}
            </select>

            {formData.level >= 3 && subclasses.length > 0 && (
              <select name="subclass" value={formData.subclass} onChange={handleChange}>
                <option value="">Select Subclass</option>
                {subclasses.map(s => <option key={s.index} value={s.name}>{s.name}</option>)}
              </select>
            )}
            
            <div className="input-with-label">
              <label>Level</label>
              <input type="number" name="level" value={formData.level} onChange={handleChange} min="1" max="20" />
            </div>

            <select name="race" value={formData.race} onChange={handleChange}>
              <option value="">Select Race</option>
              {races.map(r => <option key={r.index} value={r.name}>{r.name}</option>)}
            </select>

            <select name="alignment" value={formData.alignment} onChange={handleChange}>
              <option value="">Select Alignment</option>
              {alignments.map(a => <option key={a.index} value={a.name}>{a.name}</option>)}
            </select>
          </div>
        </header>

        <div className="sheet-body">
          <div className="abilities-col">
            {renderAbility('Strength', 'strength')}
            {renderAbility('Dexterity', 'dexterity')}
            {renderAbility('Constitution', 'constitution')}
            {renderAbility('Intelligence', 'intelligence')}
            {renderAbility('Wisdom', 'wisdom')}
            {renderAbility('Charisma', 'charisma')}
          </div>

          <div className="main-col">
            <div className="combat-row">
              <div className="combat-box accent-border">
                <Shield size={24} color="var(--accent)" />
                <input type="number" name="ac" value={formData.ac} onChange={handleChange} />
                <label>Armor Class</label>
              </div>
              <div className="combat-box">
                <Zap size={24} color="var(--text-secondary)" />
                <input type="number" name="initiative" value={formData.initiative} onChange={handleChange} />
                <label>Initiative</label>
              </div>
              <div className="combat-box">
                <input type="number" name="speed" value={formData.speed} onChange={handleChange} />
                <label>Speed</label>
              </div>
            </div>

            <div className="hp-box">
              <div className="hp-header">
                <span><Heart size={14} color="var(--danger)" /> Hit Points</span>
                <span>Max Capacity: {formData.hpMax}</span>
              </div>
              <div className="hp-inputs">
                <input 
                  type="number" 
                  name="hpCurrent" 
                  value={formData.hpCurrent} 
                  onChange={handleChange} 
                />
                <span className="hp-divider">/</span>
                <input 
                  type="number" 
                  name="hpMax" 
                  value={formData.hpMax} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="derived-stats-box">
              <div className="meta-item">
                <strong>Proficiency Bonus</strong>
                <span style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>+{formData.proficiencyBonus}</span>
              </div>
              <div className="meta-item">
                <strong>Passive Perception</strong>
                <span style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{formData.passivePerception}</span>
              </div>
            </div>

            <div className="textarea-group">
              <label>Proficiencies & Languages</label>
              <textarea 
                name="proficiencies" 
                value={formData.proficiencies.join(', ')} 
                onChange={(e) => setFormData(prev => ({ ...prev, proficiencies: e.target.value.split(',').map(s => s.trim()) }))}
                placeholder="List your skills, languages, tools..."
              />
            </div>

            <div className="textarea-group">
              <label>Equipment & Inventory</label>
              <div className="currency-grid">
                {['cp', 'sp', 'ep', 'gp', 'pp'].map(curr => (
                  <div className="currency-item" key={curr}>
                    <label>{curr.toUpperCase()}</label>
                    <input 
                      type="number" 
                      name={`currency.${curr}`} 
                      value={(formData.currency as any)[curr]} 
                      onChange={handleChange} 
                    />
                  </div>
                ))}
              </div>
              <textarea name="equipment" value={formData.equipment} onChange={handleChange} placeholder="Weapons, armor, and gear..." />
            </div>

            <div className="textarea-group">
              <label>Cantrips & Spells</label>
              <div className="spell-management">
                <div className="spell-picker">
                  <select onChange={(e) => handleAddSpell(e.target.value)} value="">
                    <option value="">+ Add Spell (Filtered by Class/Level)</option>
                    {availableSpells.map(s => (
                      <option key={s.index} value={s.name}>
                        {s.name} (Lvl {s.level})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="selected-spells">
                  {formData.spells.split('\n').filter(s => s.trim()).map(spell => (
                    <div key={spell} className="spell-tag">
                      <span>{spell}</span>
                      <button type="button" onClick={() => handleRemoveSpell(spell)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {(!formData.spells || formData.spells.trim() === '') && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      No spells selected. Choose a class and level to see options.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="textarea-group">
              <label>Character Notes & Backstory</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Describe your character's history..." />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
