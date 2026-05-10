import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { EquipmentSummary } from '../services/api';

interface EquipmentListProps {
  equipment: EquipmentSummary[];
  onSelect: (index: string) => void;
  selectedIndex?: string;
}

const EQUIPMENT_CATEGORIES = [
  { name: 'Weapon', index: 'weapon' },
  { name: 'Armor', index: 'armor' },
  { name: 'Adventuring Gear', index: 'adventuring-gear' },
  { name: 'Tools', index: 'tools' },
  { name: 'Mounts and Vehicles', index: 'mounts-and-vehicles' }
];

export const EquipmentList: React.FC<EquipmentListProps> = ({ 
  equipment, 
  onSelect, 
  selectedIndex
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredEquipment = useMemo(() => {
    return equipment.filter((e) => {
      const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || (e.equipment_category?.index === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [equipment, searchTerm, selectedCategory]);

  return (
    <div className="monster-list-container">
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search armory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className={`filter-toggle ${showFilters || selectedCategory !== '' ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {EQUIPMENT_CATEGORIES.map(cat => (
                <option key={cat.index} value={cat.index}>{cat.name}</option>
              ))}
            </select>
          </div>
          {selectedCategory !== '' && (
            <button className="clear-filter" onClick={() => setSelectedCategory('')}>
              <X size={12} /> Clear Filter
            </button>
          )}
        </div>
      )}

      <div className="monster-list">
        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((item) => (
            <div
              key={item.index}
              className={`monster-item ${selectedIndex === item.index ? 'selected' : ''}`}
              onClick={() => onSelect(item.index)}
            >
              <div className="monster-info">
                <span className="monster-name">{item.name}</span>
                <span className="monster-meta">{item.equipment_category?.name || 'Item'}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No equipment found</div>
        )}
      </div>
    </div>
  );
};
