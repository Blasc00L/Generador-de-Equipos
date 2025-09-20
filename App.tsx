import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { Character, Team, SavedTeamSet } from './types';
import { AddCharacterForm } from './components/AddCharacterForm';
import { CharacterCard } from './components/CharacterCard';
import { TeamDisplay } from './components/TeamDisplay';
import { SavedTeamsDisplay } from './components/SavedTeamsDisplay';
import { BulkAddModal } from './components/BulkAddModal';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { generateTeams } from './services/geminiService';
import { SparklesIcon } from './components/icons';

// --- MODO ADMINISTRADOR ---
// Cambia esta clave por una que solo tú conozcas.
const ADMIN_KEY = 'clave-secreta-para-admin-123';
// -------------------------

const createCharacter = (charData: Omit<Character, 'id' | 'imageUrl'>, id: string): Character => ({
  ...charData,
  id,
  imageUrl: `https://picsum.photos/seed/${charData.name.trim().replace(/\s+/g, '-')}/400/300`,
});


const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<Set<string>>(new Set());
  const [teams, setTeams] = useState<Team[]>([]);
  const [savedTeamSets, setSavedTeamSets] = useState<SavedTeamSet[]>([]);
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');
  const [selectedFactions, setSelectedFactions] = useState<Set<string>>(new Set());
  const [viewedCharacter, setViewedCharacter] = useState<Character | null>(null);
  
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setIsInitialLoading(true);
        const response = await fetch('/characters.json');
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de personajes.');
        }
        const data: Character[] = await response.json();
        setCharacters(data);
      } catch (err: any) {
        setError(err.message || 'Error cargando datos.');
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  const uniqueFactions = useMemo(() => {
    const factions = new Set(characters.map(c => c.faccion));
    return Array.from(factions).sort();
  }, [characters]);

  useEffect(() => {
    // Inicializa los filtros de facción para que todas estén seleccionadas al principio
    setSelectedFactions(new Set(uniqueFactions));
  }, [uniqueFactions]);

  useEffect(() => {
    // Comprobar si el modo admin ya está activado en el navegador
    if (localStorage.getItem('isAdmin') === 'true') {
      setIsAdmin(true);
      return;
    }
    
    // Comprobar si la clave secreta está en la URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin_key') === ADMIN_KEY) {
      setIsAdmin(true);
      // Guardar el estado de admin en el navegador para futuras visitas
      localStorage.setItem('isAdmin', 'true');
    }
  }, []);


  const handleAddCharacter = useCallback((characterData: Omit<Character, 'id' | 'imageUrl'>) => {
    const newCharacter = createCharacter(characterData, Date.now().toString());
    setCharacters(prev => [newCharacter, ...prev]);
  }, []);

  const handleBulkAddCharacters = useCallback((newCharactersData: Omit<Character, 'id' | 'imageUrl'>[]) => {
    const newCharacters = newCharactersData.map(c => createCharacter(c, Date.now().toString() + c.name));
    setCharacters(prev => [...newCharacters, ...prev]);
    setIsBulkAddModalOpen(false);
  }, []);

  const handleDeleteCharacter = useCallback((id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
    setSelectedCharacterIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const handleUpdateCharacterValue = useCallback((id: string, newValue: number) => {
    setCharacters(prev => 
      prev.map(c => (c.id === id ? { ...c, valor: Math.max(1, newValue) } : c))
    );
  }, []);

  const handleToggleSelection = useCallback((character: Character) => {
    setSelectedCharacterIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(character.id)) {
        newSet.delete(character.id);
      } else {
        newSet.add(character.id);
      }
      return newSet;
    });
  }, []);

  const handleViewCharacter = useCallback((character: Character) => {
    setViewedCharacter(character);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setViewedCharacter(null);
  }, []);
  
  const handleToggleFaction = useCallback((faction: string) => {
    setSelectedFactions(prev => {
        const newSet = new Set(prev);
        if (newSet.has(faction)) {
            newSet.delete(faction);
        } else {
            newSet.add(faction);
        }
        return newSet;
    });
  }, []);

  const handleSelectAllFactions = useCallback(() => {
    setSelectedFactions(new Set(uniqueFactions));
  }, [uniqueFactions]);

  const handleDeselectAllFactions = useCallback(() => {
    setSelectedFactions(new Set());
  }, []);

  const handleGenerateTeams = async () => {
    const selectedCharacters = characters.filter(c => selectedCharacterIds.has(c.id));
    if (selectedCharacters.length < numberOfTeams) {
      setError(`Se necesitan al menos ${numberOfTeams} personajes para crear ${numberOfTeams} equipos.`);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setTeams([]);

    try {
      const generated = await generateTeams(selectedCharacters, numberOfTeams);
      setTeams(generated);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTeams = useCallback((name: string) => {
    const newSavedSet: SavedTeamSet = {
      id: Date.now().toString(),
      name,
      teams,
    };
    setSavedTeamSets(prev => [newSavedSet, ...prev]);
    setTeams([]); // Limpiar los equipos actuales después de guardarlos
  }, [teams]);
  
  const handleDeleteSavedSet = useCallback((id: string) => {
    setSavedTeamSets(prev => prev.filter(set => set.id !== id));
  }, []);

  const totalSelectedLevel = useMemo(() => {
    return characters
      .filter(c => selectedCharacterIds.has(c.id))
      .reduce((sum, char) => sum + char.valor, 0);
  }, [characters, selectedCharacterIds]);

  const sortedCharacters = useMemo(() => {
    const filteredCharacters = characters.filter(c => selectedFactions.has(c.faccion));
    const sorted = [...filteredCharacters];

    switch (sortOrder) {
      case 'level_desc':
        sorted.sort((a, b) => b.valor - a.valor);
        break;
      case 'level_asc':
        sorted.sort((a, b) => a.valor - b.valor);
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // No se necesita ordenación para el valor por defecto
        break;
    }
    return sorted;
  }, [characters, sortOrder, selectedFactions]);

  if (isInitialLoading) {
    return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto"></div>
                <p className="text-white mt-4 text-lg">Cargando personajes...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Generador de Equipos para <span className="text-blue-500">DC</span> & <span className="text-red-500">Marvel</span> Universe
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Selecciona tus héroes y villanos, y deja que la IA cree los equipos más equilibrados.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            {isAdmin && (
              <div className="relative">
                  <AddCharacterForm onAddCharacter={handleAddCharacter} />
                  <button 
                      onClick={() => setIsBulkAddModalOpen(true)}
                      className="absolute top-4 right-4 text-xs text-teal-400 hover:text-teal-300 font-semibold transition-colors bg-gray-900/50 px-3 py-1 rounded-full border border-teal-800 hover:border-teal-500"
                  >
                      Añadir Varios
                  </button>
              </div>
            )}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">Generar Equipos</h2>
              <p className="text-sm text-gray-400 mb-4">
                Selecciona al menos {numberOfTeams} personajes de la lista para empezar.
              </p>
              <div className="space-y-4">
                <div>
                    <label htmlFor="numberOfTeams" className="block text-sm font-medium text-gray-300">Número de Equipos</label>
                    <input
                        id="numberOfTeams"
                        type="number"
                        value={numberOfTeams}
                        min="2"
                        max="10"
                        onChange={(e) => setNumberOfTeams(Math.max(2, Number(e.target.value)))}
                        className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <div className="text-center bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Nivel Total Seleccionado</p>
                  <p className="text-3xl font-bold text-yellow-400 tracking-tight">{totalSelectedLevel}</p>
                </div>
                <button 
                  onClick={handleGenerateTeams}
                  disabled={isLoading || selectedCharacterIds.size < numberOfTeams}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon />
                      <span>Generar Equipos ({selectedCharacterIds.size} seleccionados)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 p-6 rounded-lg shadow-inner border border-gray-700/50">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-white">Personajes Disponibles</h2>
                  <div>
                      <label htmlFor="sort-order" className="text-sm font-medium text-gray-400 mr-2">Ordenar por:</label>
                      <select
                          id="sort-order"
                          value={sortOrder}
                          onChange={e => setSortOrder(e.target.value)}
                          className="bg-gray-900 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      >
                          <option value="default">Por defecto</option>
                          <option value="level_desc">Nivel (Mayor a Menor)</option>
                          <option value="level_asc">Nivel (Menor a Mayor)</option>
                          <option value="name_asc">Nombre (A-Z)</option>
                      </select>
                  </div>
              </div>

              <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h3 className="text-base font-semibold text-white mb-3">Filtrar por Facción</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {uniqueFactions.map(faction => (
                    <button
                        key={faction}
                        onClick={() => handleToggleFaction(faction)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                            selectedFactions.has(faction)
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {faction}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 text-xs pt-2">
                    <button onClick={handleSelectAllFactions} className="text-teal-400 hover:underline">Seleccionar todo</button>
                    <button onClick={handleDeselectAllFactions} className="text-teal-400 hover:underline">Deseleccionar todo</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedCharacters.map(character => (
                  <CharacterCard 
                    key={character.id} 
                    character={character} 
                    onDelete={isAdmin ? handleDeleteCharacter : undefined}
                    onUpdateValue={isAdmin ? handleUpdateCharacterValue : undefined}
                    onView={handleViewCharacter}
                    isSelected={selectedCharacterIds.has(character.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
        
        <section className="mt-12">
           {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center mb-6">{error}</div>}
           <TeamDisplay teams={teams} onSave={handleSaveTeams} />
        </section>

        <section className="mt-12">
            <SavedTeamsDisplay savedSets={savedTeamSets} onDelete={isAdmin ? handleDeleteSavedSet : undefined} />
        </section>
        
        {isBulkAddModalOpen && isAdmin && (
            <BulkAddModal 
                onClose={() => setIsBulkAddModalOpen(false)}
                onBulkAdd={handleBulkAddCharacters}
            />
        )}

        {viewedCharacter && (
            <CharacterDetailModal 
                character={viewedCharacter}
                onClose={handleCloseDetailModal}
                onToggleSelection={handleToggleSelection}
                isSelected={selectedCharacterIds.has(viewedCharacter.id)}
            />
        )}

      </div>
    </div>
  );
};

export default App;