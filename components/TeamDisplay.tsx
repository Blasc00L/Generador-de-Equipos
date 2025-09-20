import React, { useState } from 'react';
import type { Team, Character } from '../types';

interface TeamDisplayProps {
  teams: Team[];
  onSave: (name: string) => void;
}

const SmallCharacterCard: React.FC<{character: Character}> = ({ character }) => (
    <div className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg">
        <img src={character.imageUrl} alt={character.name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-600" />
        <div>
            <p className="font-semibold text-white text-sm">{character.name}</p>
            <p className="text-xs text-gray-400">{character.faccion}</p>
            <p className="text-xs text-gray-400">
                Nivel: <span className="font-semibold text-yellow-400">{character.valor}</span>
            </p>
        </div>
    </div>
);

export const TeamDisplay: React.FC<TeamDisplayProps> = ({ teams, onSave }) => {
  const [saveName, setSaveName] = useState('');
  
  if (!teams.length) {
    return null;
  }

  const handleSave = () => {
    if (saveName.trim()) {
      onSave(saveName.trim());
      setSaveName('');
    } else {
      alert("Por favor, introduce un nombre para guardar la lista de equipos.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Equipos Generados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, index) => (
          <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col">
            <h3 className="text-xl font-bold text-teal-400 mb-4 truncate">{team.teamName}</h3>
            <div className="space-y-3 flex-grow">
              {team.members.map(member => (
                <SmallCharacterCard key={member.id} character={member} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Nombre para la lista de equipos..."
          className="flex-grow w-full sm:w-auto bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        />
        <button
          onClick={handleSave}
          className="w-full sm:w-auto py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-colors"
        >
          Guardar Equipos
        </button>
      </div>
    </div>
  );
};