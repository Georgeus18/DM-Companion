import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { MonsterSummary } from '../services/api';

interface MonsterListProps {
  monsters: MonsterSummary[];
  onSelect: (index: string) => void;
  selectedIndex?: string;
}

export const MonsterList: React.FC<MonsterListProps> = ({ monsters, onSelect, selectedIndex }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMonsters = monsters.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      </div>
      <div className="monster-list">
        {filteredMonsters.map((monster) => (
          <div
            key={monster.index}
            className={`monster-item ${selectedIndex === monster.index ? 'selected' : ''}`}
            onClick={() => onSelect(monster.index)}
          >
            {monster.name}
          </div>
        ))}
      </div>
    </div>
  );
};
