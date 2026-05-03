import React from 'react';
import type { MonsterDetail as MonsterDetailType } from '../services/api';
import { Shield, Heart, Zap } from 'lucide-react';

interface MonsterDetailProps {
  monster: MonsterDetailType;
}

export const MonsterDetail: React.FC<MonsterDetailProps> = ({ monster }) => {
  const getModifier = (score: number) => Math.floor((score - 10) / 2);
  const formatModifier = (score: number) => {
    const mod = getModifier(score);
    return mod >= 0 ? `+${mod}` : mod;
  };

  return (
    <div className="monster-detail">
      <header>
        <h1>{monster.name}</h1>
        <p className="subtitle">
          {monster.size} {monster.type}, {monster.alignment}
        </p>
      </header>

      <div className="stats-row">
        <div className="stat-box">
          <Shield size={20} />
          <div className="stat-content">
            <span className="label">Armor Class</span>
            <span className="value">{monster.armor_class[0].value}</span>
          </div>
        </div>
        <div className="stat-box">
          <Heart size={20} />
          <div className="stat-content">
            <span className="label">Hit Points</span>
            <span className="value">
              {monster.hit_points} ({monster.hit_dice})
            </span>
          </div>
        </div>
        <div className="stat-box">
          <Zap size={20} />
          <div className="stat-content">
            <span className="label">Speed</span>
            <span className="value">{Object.entries(monster.speed).map(([k, v]) => `${k} ${v}`).join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="ability-scores">
        {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((ability) => {
          const score = (monster as any)[ability];
          return (
            <div key={ability} className="ability">
              <span className="name">{ability.slice(0, 3).toUpperCase()}</span>
              <span className="score">{score}</span>
              <span className="modifier">({formatModifier(score)})</span>
            </div>
          );
        })}
      </div>

      <section className="section">
        <p><strong>Challenge</strong> {monster.challenge_rating} ({monster.xp} XP)</p>
        <p><strong>Senses</strong> {Object.entries(monster.senses).map(([k, v]) => `${k.replace('_', ' ')} ${v}`).join(', ')}</p>
        <p><strong>Languages</strong> {monster.languages || '—'}</p>
      </section>

      {monster.special_abilities && (
        <section className="section">
          <h3>Traits</h3>
          {monster.special_abilities.map((ability, i) => (
            <div key={i} className="trait">
              <strong>{ability.name}.</strong> {ability.desc}
            </div>
          ))}
        </section>
      )}

      {monster.actions && (
        <section className="section">
          <h3>Actions</h3>
          {monster.actions.map((action, i) => (
            <div key={i} className="action">
              <strong>{action.name}.</strong> {action.desc}
            </div>
          ))}
        </section>
      )}

      {monster.legendary_actions && (
        <section className="section">
          <h3>Legendary Actions</h3>
          {monster.legendary_actions.map((action, i) => (
            <div key={i} className="action">
              <strong>{action.name}.</strong> {action.desc}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
