import React, { useEffect, useState } from 'react';
import type { Character } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface CharacterDetailModalProps {
  character: Character;
  onClose: () => void;
  onToggleSelection: (character: Character) => void;
  isSelected: boolean;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({ character, onClose, onToggleSelection, isSelected }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Activar animación de entrada
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsMounted(false); // Activar animación de salida
    setTimeout(onClose, 300); // Coincidir con la duración de la animación
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection(character);
  };
  
  const backdropClasses = `
    fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4
    transition-opacity duration-300 ease-in-out
    ${isMounted ? 'opacity-100' : 'opacity-0'}
  `;

  const modalContentClasses = `
    card-bg relative rounded-lg shadow-2xl w-full max-w-sm border-2 border-teal-500/50
    transform transition-all duration-300 ease-in-out overflow-hidden
    ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
  `;

  return (
    <div
      className={backdropClasses}
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="character-detail-title"
    >
      <div
        className={modalContentClasses}
        onClick={e => e.stopPropagation()}
        role="document"
      >
        <img src={character.imageUrl} alt={character.name} className="w-full h-64 object-cover" />
        
        <div className="p-6">
          <p className="text-sm font-semibold text-red-400 mb-1 tracking-wider uppercase">{character.faccion}</p>
          <h3 id="character-detail-title" className="font-orbitron text-3xl font-bold text-white mb-4 uppercase tracking-wide">{character.name}</h3>
          
          <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
            <div className="flex justify-between items-center">
                <span className="font-orbitron text-lg font-bold uppercase text-red-400 tracking-wider">Nivel</span>
                <span className="font-orbitron text-5xl font-black text-yellow-400">{character.valor}</span>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2">
            <button
                onClick={handleToggle}
                className={`w-full flex justify-center items-center gap-3 py-3 px-4 border-2 rounded-md shadow-sm text-base font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    isSelected 
                    ? 'bg-red-600/20 border-red-500 hover:bg-red-600/40 focus:ring-red-500' 
                    : 'bg-teal-600/20 border-teal-500 hover:bg-teal-600/40 focus:ring-teal-500'
                }`}
            >
                {isSelected ? (
                    <>
                        <TrashIcon className="h-5 w-5" />
                        <span className="font-semibold">Quitar del equipo</span>
                    </>
                ) : (
                    <>
                        <PlusIcon className="h-5 w-5" />
                        <span className="font-semibold">Añadir al equipo</span>
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};