import { useState, useEffect } from 'react';
import { fetchMonsters, fetchMonsterDetail } from './services/api';
import type { MonsterSummary, MonsterDetail as MonsterDetailType } from './services/api';
import { MonsterList } from './components/MonsterList';
import { MonsterDetail } from './components/MonsterDetail';
import { CharacterManager } from './components/CharacterManager';
import { BookOpen, Users } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'bestiary' | 'characters'>('bestiary');
  const [monsters, setMonsters] = useState<MonsterSummary[]>([]);
  const [selectedMonster, setSelectedMonster] = useState<MonsterDetailType | null>(null);
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
  }, [activeTab, monsters.length]);

  const handleSelectMonster = async (index: string) => {
    try {
      setLoading(true);
      const detail = await fetchMonsterDetail(index);
      setSelectedMonster(detail);
      setLoading(false);
    } catch (err) {
      setError('Failed to load monster details');
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
        ) : (
          <CharacterManager />
        )}
      </main>
    </div>
  );
}

export default App;
