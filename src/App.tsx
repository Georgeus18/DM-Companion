import { useState, useEffect } from 'react';
import { fetchMonsters, fetchMonsterDetail, fetchEquipment, fetchEquipmentDetail } from './services/api';
import type { MonsterSummary, MonsterDetail as MonsterDetailType, EquipmentSummary, EquipmentDetail as EquipmentDetailType } from './services/api';
import { MonsterList } from './components/MonsterList';
import { MonsterDetail } from './components/MonsterDetail';
import { EquipmentList } from './components/EquipmentList';
import { EquipmentDetail } from './components/EquipmentDetail';
import { CharacterManager } from './components/CharacterManager';
import { BookOpen, Users, Sword } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'bestiary' | 'characters' | 'armory'>('bestiary');
  const [monsters, setMonsters] = useState<MonsterSummary[]>([]);
  const [selectedMonster, setSelectedMonster] = useState<MonsterDetailType | null>(null);
  const [equipment, setEquipment] = useState<EquipmentSummary[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'bestiary' && monsters.length === 0) {
      setLoading(true);
      fetchMonsters()
        .then((data) => {
          setMonsters(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }

    if (activeTab === 'armory' && equipment.length === 0) {
      setLoading(true);
      fetchEquipment()
        .then((data) => {
          setEquipment(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [activeTab, monsters.length, equipment.length]);

  const handleSelectMonster = async (index: string) => {
    try {
      setLoading(true);
      const detail = await fetchMonsterDetail(index);
      setSelectedMonster(detail);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load monster details');
      setLoading(false);
    }
  };

  const handleSelectEquipment = async (index: string) => {
    try {
      setLoading(true);
      const detail = await fetchEquipmentDetail(index);
      setSelectedEquipment(detail);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load equipment details');
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <header className="app-header">
          <h1>DM Companion</h1>
        </header>

        <nav className="app-nav">
          <button 
            className={`nav-item ${activeTab === 'bestiary' ? 'active' : ''}`}
            onClick={() => setActiveTab('bestiary')}
          >
            <BookOpen size={20} />
            <span>Bestiary</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'armory' ? 'active' : ''}`}
            onClick={() => setActiveTab('armory')}
          >
            <Sword size={20} />
            <span>Armory</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'characters' ? 'active' : ''}`}
            onClick={() => setActiveTab('characters')}
          >
            <Users size={20} />
            <span>Characters</span>
          </button>
        </nav>

        {activeTab === 'bestiary' && (
          <MonsterList 
            monsters={monsters} 
            onSelect={handleSelectMonster} 
            selectedIndex={selectedMonster?.index}
          />
        )}

        {activeTab === 'armory' && (
          <EquipmentList 
            equipment={equipment} 
            onSelect={handleSelectEquipment} 
            selectedIndex={selectedEquipment?.index}
          />
        )}
      </aside>

      <main className="content">
        {activeTab === 'bestiary' ? (
          <>
            {error && <div className="error-message">{error}</div>}
            {loading && !selectedMonster ? (
              <div className="loading">Loading monsters...</div>
            ) : selectedMonster ? (
              <div className={loading ? 'loading-overlay' : ''}>
                <MonsterDetail monster={selectedMonster} />
              </div>
            ) : (
              <div className="empty-state">
                <h2>Select a monster to view details</h2>
                <p>Use the list on the left to browse the SRD monsters.</p>
              </div>
            )}
          </>
        ) : activeTab === 'armory' ? (
          <>
            {error && <div className="error-message">{error}</div>}
            {loading && !selectedEquipment ? (
              <div className="loading">Loading armory...</div>
            ) : selectedEquipment ? (
              <div className={loading ? 'loading-overlay' : ''}>
                <EquipmentDetail item={selectedEquipment} />
              </div>
            ) : (
              <div className="empty-state">
                <h2>Select an item to view details</h2>
                <p>Use the list on the left to browse the SRD equipment.</p>
              </div>
            )}
          </>
        ) : (
          <CharacterManager />
        )}
      </main>
    </div>
  );
}

export default App;
