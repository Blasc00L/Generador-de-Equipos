import React from 'react';
import type { Character } from '../types';
import { TrashIcon } from './icons';

interface CharacterCardProps {
  character: Character;
  onDelete?: (id: string) => void;
  onView?: (character: Character) => void;
  isSelected?: boolean;
  onUpdateValue?: (id: string, newValue: number) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onDelete, onView, isSelected, onUpdateValue }) => {
  const cardClasses = `
    card-bg relative rounded-md shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out group
    h-40 border-2
    ${isSelected ? 'border-teal-400 scale-102 shadow-[0_0_15px_rgba(45,212,191,0.5)]' : 'border-gray-700 hover:border-teal-500'}
  `;

  const handleValueChange = (e: React.MouseEvent, amount: number) => {
    e.stopPropagation();
    onUpdateValue?.(character.id, character.valor + amount);
  }

  return (
    <div className={cardClasses} onClick={() => onView?.(character)} style={{ cursor: onView ? 'pointer' : 'default' }}>
      {onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(character.id); }}
          className="absolute top-2 right-2 z-20 p-1.5 bg-gray-900/50 rounded-full text-gray-300 hover:bg-red-500 hover:text-white transition-colors duration-200"
          aria-label="Eliminar personaje"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      )}

      <div className="flex h-full">
        <div className="w-2/5 flex-shrink-0 relative">
            <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/60 to-gray-800 group-hover:via-gray-800/40 transition-all duration-300"></div>
        </div>
        <div className="w-3/5 flex flex-col justify-between p-3">
            <div className="flex-grow">
                <h3 className="font-orbitron text-lg font-bold text-white uppercase leading-tight tracking-wide truncate" title={character.name}>{character.name}</h3>
                <p className="text-xs text-red-400 uppercase font-semibold tracking-wider truncate" title={character.faccion}>{character.faccion}</p>
            </div>
            {onUpdateValue ? (
                <div className="flex items-center justify-end gap-1 text-white">
                    <button onClick={(e) => handleValueChange(e, -1)} className="w-6 h-6 text-lg bg-gray-700 rounded hover:bg-gray-600 transition-colors">-</button>
                    <span className="font-orbitron text-3xl font-black text-yellow-400 text-center w-12">{character.valor}</span>
                    <button onClick={(e) => handleValueChange(e, 1)} className="w-6 h-6 text-lg bg-gray-700 rounded hover:bg-gray-600 transition-colors">+</button>
                </div>
            ) : (
                <div className="text-right">
                    <span className="font-orbitron text-4xl font-black text-yellow-400">{character.valor}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};