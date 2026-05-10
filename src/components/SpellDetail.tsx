import React from 'react';
import type { SpellDetail as SpellDetailType } from '../services/api';
import { Clock, Zap, Target } from 'lucide-react';

interface SpellDetailProps {
  spell: SpellDetailType;
}

export const SpellDetail: React.FC<SpellDetailProps> = ({ spell }) => {
  const formatLevel = (level: number) => {
    if (level === 0) return 'Cantrip';
    const suffixes = ['st', 'nd', 'rd', 'th'];
    const suffix = level <= 3 ? suffixes[level - 1] : suffixes[3];
    return `${level}${suffix}-level`;
  };

  return (
    <div className="monster-detail">
      <header>
        <h1>{spell.name}</h1>
        <p className="subtitle">
          {formatLevel(spell.level)} {spell.school.name}
          {spell.ritual && ' (ritual)'}
        </p>
      </header>

      <div className="stats-row">
        <div className="stat-box">
          <Clock size={24} />
          <div className="stat-content">
            <span className="label">Casting Time</span>
            <span className="value">{spell.casting_time}</span>
          </div>
        </div>
        <div className="stat-box">
          <Zap size={24} />
          <div className="stat-content">
            <span className="label">Range</span>
            <span className="value">{spell.range}</span>
          </div>
        </div>
        <div className="stat-box">
          <Target size={24} />
          <div className="stat-content">
            <span className="label">Duration</span>
            <span className="value">
              {spell.concentration && 'Concentration, '}
              {spell.duration}
            </span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="meta-grid">
          <div className="meta-item">
            <strong>Components</strong>
            <span>{spell.components.join(', ')} {spell.material && `(${spell.material})`}</span>
          </div>
          <div className="meta-item">
            <strong>Classes</strong>
            <span>{spell.classes.map(c => c.name).join(', ')}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Description</h3>
        {spell.desc.map((d, i) => (
          <p key={i} style={{ marginBottom: '15px', lineHeight: '1.6' }}>{d}</p>
        ))}
      </section>

      {spell.higher_level && (
        <section className="section">
          <h3>At Higher Levels</h3>
          {spell.higher_level.map((d, i) => (
            <p key={i} style={{ marginBottom: '10px', lineHeight: '1.6' }}>{d}</p>
          ))}
        </section>
      )}
    </div>
  );
};
