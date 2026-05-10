import React from 'react';
import type { EquipmentDetail as EquipmentDetailType } from '../services/api';
import { Shield, Sword, Coins, Weight, Info } from 'lucide-react';

interface EquipmentDetailProps {
  item: EquipmentDetailType;
}

export const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ item }) => {
  return (
    <div className="monster-detail">
      <header>
        <h1>{item.name}</h1>
        <p className="subtitle">
          {item.equipment_category.name}
          {item.weapon_category && ` • ${item.weapon_category}`}
          {item.armor_category && ` • ${item.armor_category}`}
        </p>
      </header>

      <div className="stats-row">
        <div className="stat-box cost">
          <Coins size={24} />
          <div className="stat-content">
            <span className="label">Cost</span>
            <span className="value">{item.cost.quantity} {item.cost.unit}</span>
          </div>
        </div>
        <div className="stat-box weight">
          <Weight size={24} />
          <div className="stat-content">
            <span className="label">Weight</span>
            <span className="value">{item.weight ? `${item.weight} lb.` : '—'}</span>
          </div>
        </div>
        {item.damage && (
          <div className="stat-box damage">
            <Sword size={24} />
            <div className="stat-content">
              <span className="label">Damage</span>
              <span className="value">{item.damage.damage_dice} {item.damage.damage_type.name}</span>
            </div>
          </div>
        )}
        {item.armor_class && (
          <div className="stat-box ac">
            <Shield size={24} />
            <div className="stat-content">
              <span className="label">AC</span>
              <span className="value">
                {item.armor_class.base} 
                {item.armor_class.dex_bonus && ` + Dex (max ${item.armor_class.max_bonus || '—'})`}
              </span>
            </div>
          </div>
        )}
      </div>

      <section className="section">
        <div className="meta-grid">
          {item.range && (
            <div className="meta-item">
              <strong>Range</strong>
              <span>{item.range.normal}ft. / {item.range.long || '—'}ft.</span>
            </div>
          )}
          {item.properties && item.properties.length > 0 && (
            <div className="meta-item">
              <strong>Properties</strong>
              <span>{item.properties.map(p => p.name).join(', ')}</span>
            </div>
          )}
          {item.str_minimum !== undefined && item.str_minimum > 0 && (
            <div className="meta-item">
              <strong>Min Strength</strong>
              <span>{item.str_minimum}</span>
            </div>
          )}
          {item.stealth_disadvantage && (
            <div className="meta-item">
              <strong>Stealth</strong>
              <span>Disadvantage</span>
            </div>
          )}
        </div>
      </section>

      {item.desc && item.desc.length > 0 && (
        <section className="section">
          <h3>Description</h3>
          {item.desc.map((d, i) => (
            <p key={i} style={{ marginBottom: '10px', lineHeight: '1.6' }}>{d}</p>
          ))}
        </section>
      )}

      {!item.desc && (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <Info size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
          <p>No additional details available for this item.</p>
        </div>
      )}
    </div>
  );
};
