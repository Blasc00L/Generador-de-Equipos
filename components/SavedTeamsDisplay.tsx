import React from 'react';
import type { SavedTeamSet, Character } from '../types';
import { TrashIcon } from './icons';

const SmallCharacterCard: React.FC<{character: Character}> = ({ character }) => (
    <div className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg">
        <img src={character.imageUrl} alt={character.name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-700" />
        <div>
            <p className="font-semibold text-white text-sm">{character.name}</p>
            <p className="text-xs text-gray-400">{character.faccion}</p>
            <p className="text-xs text-gray-400">
                Nivel: <span className="font-semibold text-yellow-400">{character.valor}</span>
            </p>
        </div>
    </div>
);

export const SavedTeamsDisplay: React.FC<{ savedSets: SavedTeamSet[]; onDelete?: (id: string) => void; }> = ({ savedSets, onDelete }) => {
  if (!savedSets.length) {
    return null;
  }

  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white text-center">Mis Listas de Equipos</h2>
        {savedSets.map(savedSet => (
            <div key={savedSet.id} className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-indigo-400">{savedSet.name}</h3>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(savedSet.id)}
                            className="p-2 bg-gray-700 rounded-full text-gray-300 hover:bg-red-500 hover:text-white transition-colors"
                            aria-label="Eliminar lista de equipos"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedSet.teams.map((team, index) => (
                    <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col">
                        <h4 className="text-xl font-bold text-teal-400 mb-4 truncate">{team.teamName}</h4>
                        <div className="space-y-3 flex-grow">
                        {team.members.map(member => (
                            <SmallCharacterCard key={member.id} character={member} />
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
  );
};