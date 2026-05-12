import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Sword } from 'lucide-react';
import type { MonsterSummary } from '../services/api';

interface MonsterListProps {
  monsters: MonsterSummary[];
  onSelect: (index: string) => void;
  selectedIndex?: string;
  encounterMonsters?: MonsterSummary[];
  onToggleEncounter?: (monster: MonsterSummary) => void;
}

const CR_VALUES = [0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30];

const MONSTER_TYPES = [
  'aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 
  'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead'
];

export const MonsterList: React.FC<MonsterListProps> = ({ 
  monsters, 
  onSelect, 
  selectedIndex,
  encounterMonsters = [],
  onToggleEncounter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minCR, setMinCR] = useState<number>(0);
  const [maxCR, setMaxCR] = useState<number>(30);
  const [selectedType, setSelectedType] = useState<string>('');

  const filteredMonsters = useMemo(() => {
    return monsters.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMinCR = m.challenge_rating >= minCR;
      const matchesMaxCR = m.challenge_rating <= maxCR;
      const matchesType = selectedType === '' || m.type === selectedType;
      return matchesSearch && matchesMinCR && matchesMaxCR && matchesType;
    });
  }, [monsters, searchTerm, minCR, maxCR, selectedType]);

  const hasActiveFilters = minCR > 0 || maxCR < 30 || selectedType !== '';

  const clearFilters = () => {
    setMinCR(0);
    setMaxCR(30);
    setSelectedType('');
  };

  const formatCR = (val: number) => {
    if (val === 0.125) return '1/8';
    if (val === 0.25) return '1/4';
    if (val === 0.5) return '1/2';
    return val.toString();
  };

  const isMonsterInEncounter = (index: string) => {
    return encounterMonsters.some(m => m.index === index);
  };

  return (
    <div className="monster-list-container">
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search monsters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className={`filter-toggle ${showFilters || hasActiveFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          title="Advanced Filters"
        >
          <Filter size={18} />
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Type</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              {MONSTER_TYPES.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>CR Range ({formatCR(minCR)} - {formatCR(maxCR)})</label>
            <div className="range-controls">
              <select value={minCR} onChange={(e) => setMinCR(Number(e.target.value))}>
                {CR_VALUES.filter(v => v <= maxCR).map(v => (
                  <option key={v} value={v}>Min {formatCR(v)}</option>
                ))}
              </select>
              <select value={maxCR} onChange={(e) => setMaxCR(Number(e.target.value))}>
                {CR_VALUES.filter(v => v >= minCR).map(v => (
                  <option key={v} value={v}>Max {formatCR(v)}</option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button className="clear-filter" onClick={clearFilters}>
              <X size={12} /> Clear Filters
            </button>
          )}
        </div>
      )}

      <div className="monster-list">
        {filteredMonsters.length > 0 ? (
          filteredMonsters.map((monster) => (
            <div
              key={monster.index}
              className={`monster-item ${selectedIndex === monster.index ? 'selected' : ''}`}
              onClick={() => onSelect(monster.index)}
            >
              <div className="monster-info">
                <span className="monster-name">{monster.name}</span>
                <span className="monster-meta">{monster.type}</span>
              </div>
              <div className="monster-actions">
                <span className="monster-cr">CR {formatCR(monster.challenge_rating)}</span>
                {onToggleEncounter && (
                  <button 
                    className={`btn-toggle-encounter ${isMonsterInEncounter(monster.index) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleEncounter(monster);
                    }}
                    title={isMonsterInEncounter(monster.index) ? "Remove from Encounter" : "Add to Encounter"}
                  >
                    <Sword size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No monsters found</div>
        )}
      </div>
    </div>
  );
};
