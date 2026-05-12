import React, { useState, useEffect } from 'react';
import type { Character } from '../types/character';
import { loadCharacters } from '../services/storage';
import { fetchMonsterDetail } from '../services/api';
import type { MonsterDetail as MonsterDetailType, MonsterSummary } from '../services/api';
import { User, Sword, Shield, Heart, Trash2, Plus, Minus, Zap } from 'lucide-react';

interface EncounterTrackerProps {
  characterIds: string[];
  monsterSummaries: MonsterSummary[];
  onRemoveCharacter: (id: string) => void;
  onRemoveMonster: (index: string) => void;
}

interface EncounterMonster extends MonsterDetailType {
  currentHp: number;
}

const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

const getHeroPower = (char: Character): number => {
  const statsModSum = Object.values(char.abilityScores).reduce((acc, score) => acc + calculateModifier(score), 0);
  const spellCount = char.spells ? char.spells.split(',').filter(s => s.trim()).length : 0;
  return (char.level * 10) + (statsModSum * 2) + (spellCount * 3);
};

const getMonsterPower = (monster: MonsterDetailType): number => {
  const crValue = monster.challenge_rating === 0.125 ? 0.25 : monster.challenge_rating === 0.25 ? 0.5 : monster.challenge_rating === 0.5 ? 0.75 : monster.challenge_rating;
  return Math.round((crValue * 12) + (monster.hit_points / 8));
};

export const EncounterTracker: React.FC<EncounterTrackerProps> = ({
  characterIds,
  monsterSummaries,
  onRemoveCharacter,
  onRemoveMonster
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [monsters, setMonsters] = useState<EncounterMonster[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load character details
    const allChars = loadCharacters();
    setCharacters(allChars.filter(c => characterIds.includes(c.id)));
  }, [characterIds]);

  useEffect(() => {
    // Fetch monster details
    const loadMonsters = async () => {
      setLoading(true);
      try {
        const monsterDetails = await Promise.all(
          monsterSummaries.map(async (summary) => {
            const detail = await fetchMonsterDetail(summary.index);
            return {
              ...detail,
              currentHp: detail.hit_points
            };
          })
        );
        setMonsters(monsterDetails);
      } catch (error) {
        console.error('Failed to load monster details for encounter', error);
      } finally {
        setLoading(false);
      }
    };

    if (monsterSummaries.length > 0) {
      loadMonsters();
    } else {
      setMonsters([]);
    }
  }, [monsterSummaries]);

  const updateMonsterHp = (index: string, delta: number) => {
    setMonsters(prev => prev.map(m => {
      if (m.index === index) {
        return { ...m, currentHp: Math.max(0, m.currentHp + delta) };
      }
      return m;
    }));
  };

  const totalHeroPower = characters.reduce((sum, char) => sum + getHeroPower(char), 0);
  const totalMonsterPower = monsters.reduce((sum, m) => sum + getMonsterPower(m), 0);
  const difficultyRatio = totalMonsterPower > 0 ? totalMonsterPower / (totalHeroPower || 1) : 0;

  const getDifficultyLabel = () => {
    if (difficultyRatio < 0.5) return { label: 'Easy', color: '#2ecc71' };
    if (difficultyRatio < 0.8) return { label: 'Medium', color: '#f1c40f' };
    if (difficultyRatio < 1.2) return { label: 'Hard', color: '#e67e22' };
    return { label: 'Deadly', color: '#e74c3c' };
  };

  const difficulty = getDifficultyLabel();

  if (characterIds.length === 0 && monsterSummaries.length === 0) {
    return (
      <div className="empty-encounter">
        <Sword size={64} />
        <h2>Your encounter is empty</h2>
        <p>Go to the Bestiary or Characters tab and add some entities to start a combat tracker.</p>
      </div>
    );
  }

  return (
    <div className="encounter-tracker">
      <header className="encounter-header">
        <div className="header-main">
          <h2>Active Encounter</h2>
          <div className="difficulty-badge" style={{ backgroundColor: difficulty.color }}>
            {difficulty.label}
          </div>
        </div>
        <div className="encounter-stats">
          <div className="stat-group">
            <span className="label">Party Power</span>
            <span className="value hero">{totalHeroPower}</span>
          </div>
          <div className="stat-group">
            <span className="label">Enemy Power</span>
            <span className="value enemy">{totalMonsterPower}</span>
          </div>
        </div>
      </header>

      {loading && <div className="loading">Loading combatants...</div>}

      <div className="encounter-grid">
        <section className="encounter-section">
          <h3><User size={18} /> Heroes</h3>
          <div className="combatant-list">
            {characters.map(char => {
              const power = getHeroPower(char);
              return (
                <div key={char.id} className="combatant-card hero">
                  <div className="combatant-info">
                    <span className="combatant-name">{char.name || 'Unnamed'}</span>
                    <span className="combatant-meta">Level {char.level} {char.class}</span>
                  </div>
                  <div className="combatant-stats">
                    <div className="stat power" title="Power Level">
                      <Zap size={14} />
                      <span>{power}</span>
                    </div>
                    <div className="stat">
                      <Heart size={14} />
                      <span>{char.hpCurrent}/{char.hpMax}</span>
                    </div>
                    <div className="stat">
                      <Shield size={14} />
                      <span>{char.ac}</span>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => onRemoveCharacter(char.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
            {characters.length === 0 && <p className="no-combatants">No heroes selected</p>}
          </div>
        </section>

        <section className="encounter-section">
          <h3><Sword size={18} /> Enemies</h3>
          <div className="combatant-list">
            {monsters.map(monster => {
              const power = getMonsterPower(monster);
              return (
                <div key={monster.index} className="combatant-card enemy">
                  <div className="combatant-info">
                    <span className="combatant-name">{monster.name}</span>
                    <span className="combatant-meta">{monster.type} • CR {monster.challenge_rating}</span>
                  </div>
                  <div className="combatant-stats">
                    <div className="stat power" title="Power Level">
                      <Zap size={14} />
                      <span>{power}</span>
                    </div>
                    <div className="hp-tracker">
                      <button onClick={() => updateMonsterHp(monster.index, -1)}><Minus size={12} /></button>
                      <div className="stat">
                        <Heart size={14} />
                        <span>{monster.currentHp}/{monster.hit_points}</span>
                      </div>
                      <button onClick={() => updateMonsterHp(monster.index, 1)}><Plus size={12} /></button>
                    </div>
                    <div className="stat">
                      <Shield size={14} />
                      <span>{monster.armor_class[0]?.value || 10}</span>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => onRemoveMonster(monster.index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
            {monsters.length === 0 && <p className="no-combatants">No enemies selected</p>}
          </div>
        </section>
      </div>
    </div>
  );
};
