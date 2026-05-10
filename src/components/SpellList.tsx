import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { SpellSummary } from '../services/api';

interface SpellListProps {
  spells: SpellSummary[];
  onSelect: (index: string) => void;
  selectedIndex?: string;
}

export const SpellList: React.FC<SpellListProps> = ({ 
  spells, 
  onSelect, 
  selectedIndex
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpells = useMemo(() => {
    return spells.filter((s) => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [spells, searchTerm]);

  return (
    <div className="monster-list-container">
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search spells..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="monster-list">
        {filteredSpells.length > 0 ? (
          filteredSpells.map((spell) => (
            <div
              key={spell.index}
              className={`monster-item ${selectedIndex === spell.index ? 'selected' : ''}`}
              onClick={() => onSelect(spell.index)}
            >
              <div className="monster-info">
                <span className="monster-name">{spell.name}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No spells found</div>
        )}
      </div>
    </div>
  );
};
