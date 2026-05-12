import { useState, useEffect } from 'react';
import { fetchMonsters, fetchMonsterDetail, fetchEquipment, fetchEquipmentDetail, fetchSpells, fetchSpellDetail } from './services/api';
import type { MonsterSummary, MonsterDetail as MonsterDetailType, EquipmentSummary, EquipmentDetail as EquipmentDetailType, SpellSummary, SpellDetail as SpellDetailType } from './services/api';
import { MonsterList } from './components/MonsterList';
import { MonsterDetail } from './components/MonsterDetail';
import { EquipmentList } from './components/EquipmentList';
import { EquipmentDetail } from './components/EquipmentDetail';
import { SpellList } from './components/SpellList';
import { SpellDetail } from './components/SpellDetail';
import { CharacterManager } from './components/CharacterManager';
import { EncounterTracker } from './components/EncounterTracker';
import { BookOpen, Users, Sword, Sparkles } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'bestiary' | 'characters' | 'armory' | 'spells' | 'encounter'>('bestiary');
  const [monsters, setMonsters] = useState<MonsterSummary[]>([]);
  const [selectedMonster, setSelectedMonster] = useState<MonsterDetailType | null>(null);
  const [equipment, setEquipment] = useState<EquipmentSummary[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentDetailType | null>(null);
  const [spells, setSpells] = useState<SpellSummary[]>([]);
  const [selectedSpell, setSelectedSpell] = useState<SpellDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Encounter state
  const [encounterCharacters, setEncounterCharacters] = useState<string[]>([]);
  const [encounterMonsters, setEncounterMonsters] = useState<MonsterSummary[]>([]);

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

    if (activeTab === 'spells' && spells.length === 0) {
      setLoading(true);
      fetchSpells()
        .then((data) => {
          setSpells(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [activeTab, monsters.length, equipment.length, spells.length]);

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

  const toggleMonsterInEncounter = (monster: MonsterSummary) => {
    setEncounterMonsters(prev => {
      const exists = prev.find(m => m.index === monster.index);
      if (exists) {
        return prev.filter(m => m.index !== monster.index);
      } else {
        return [...prev, monster];
      }
    });
  };

  const toggleCharacterInEncounter = (id: string) => {
    setEncounterCharacters(prev => {
      if (prev.includes(id)) {
        return prev.filter(cId => cId !== id);
      } else {
        return [...prev, id];
      }
    });
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

  const handleSelectSpell = async (index: string) => {
    try {
      setLoading(true);
      const detail = await fetchSpellDetail(index);
      setSelectedSpell(detail);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load spell details');
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-top-bar">
        <div className="app-header">
          <h1>
            DM Companion
            <span>Dungeon Master Toolset</span>
          </h1>
        </div>

        <nav className="app-nav">
          <button 
            className={`nav-item ${activeTab === 'bestiary' ? 'active' : ''}`}
            onClick={() => setActiveTab('bestiary')}
          >
            <BookOpen size={20} />
            <span>Bestiary</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'spells' ? 'active' : ''}`}
            onClick={() => setActiveTab('spells')}
          >
            <Sparkles size={20} />
            <span>Spells</span>
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
          <button 
            className={`nav-item ${activeTab === 'encounter' ? 'active' : ''}`}
            onClick={() => setActiveTab('encounter')}
          >
            <Sword size={20} />
            <span>Encounter</span>
          </button>
        </nav>
      </header>

      <div className="app-body">
        {['bestiary', 'spells', 'armory'].includes(activeTab) && (
          <aside className="sidebar">
            {activeTab === 'bestiary' && (
              <MonsterList 
                monsters={monsters} 
                onSelect={handleSelectMonster} 
                selectedIndex={selectedMonster?.index}
                encounterMonsters={encounterMonsters}
                onToggleEncounter={toggleMonsterInEncounter}
              />
            )}

            {activeTab === 'armory' && (
              <EquipmentList 
                equipment={equipment} 
                onSelect={handleSelectEquipment} 
                selectedIndex={selectedEquipment?.index}
              />
            )}

            {activeTab === 'spells' && (
              <SpellList 
                spells={spells} 
                onSelect={handleSelectSpell} 
                selectedIndex={selectedSpell?.index}
              />
            )}
          </aside>
        )}

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
          ) : activeTab === 'spells' ? (
            <>
              {error && <div className="error-message">{error}</div>}
              {loading && !selectedSpell ? (
                <div className="loading">Loading spells...</div>
              ) : selectedSpell ? (
                <div className={loading ? 'loading-overlay' : ''}>
                  <SpellDetail spell={selectedSpell} />
                </div>
              ) : (
                <div className="empty-state">
                  <h2>Select a spell to view details</h2>
                  <p>Use the list on the left to browse the SRD spells.</p>
                </div>
              )}
            </>
          ) : activeTab === 'characters' ? (
            <CharacterManager 
              encounterCharacters={encounterCharacters}
              onToggleEncounter={toggleCharacterInEncounter}
            />
          ) : (
            <EncounterTracker 
              characterIds={encounterCharacters}
              monsterSummaries={encounterMonsters}
              onRemoveCharacter={toggleCharacterInEncounter}
              onRemoveMonster={(index) => toggleMonsterInEncounter({ index } as MonsterSummary)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
