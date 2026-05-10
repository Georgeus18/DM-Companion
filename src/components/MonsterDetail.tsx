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
        <div className="stat-box ac">
          <Shield size={24} />
          <div className="stat-content">
            <span className="label">Armor Class</span>
            <span className="value">{monster.armor_class[0].value}</span>
          </div>
        </div>
        <div className="stat-box hp">
          <Heart size={24} />
          <div className="stat-content">
            <span className="label">Hit Points</span>
            <span className="value">
              {monster.hit_points}
            </span>
          </div>
        </div>
        <div className="stat-box speed">
          <Zap size={24} />
          <div className="stat-content">
            <span className="label">Speed</span>
            <span className="value">{monster.speed.walk || Object.values(monster.speed)[0]}</span>
          </div>
        </div>
      </div>

      <div className="ability-scores">
        {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const).map((ability) => {
          const score = monster[ability];
          return (
            <div key={ability} className="ability">
              <span className="name">{ability.slice(0, 3).toUpperCase()}</span>
              <span className="score">{score}</span>
              <span className="modifier">{formatModifier(score)}</span>
            </div>
          );
        })}
      </div>

      <section className="section">
        <div className="meta-grid">
          <div className="meta-item">
            <strong>Challenge</strong>
            <span className="cr-badge">{monster.challenge_rating} ({monster.xp} XP)</span>
          </div>
          <div className="meta-item">
            <strong>Senses</strong>
            <span>{Object.entries(monster.senses).map(([k, v]) => `${k.replace('_', ' ')} ${v}`).join(', ')}</span>
          </div>
          <div className="meta-item">
            <strong>Languages</strong>
            <span>{monster.languages || '—'}</span>
          </div>
        </div>
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
