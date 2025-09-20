import React, { useState } from 'react';
import type { Character } from '../types';

interface BulkAddModalProps {
  onClose: () => void;
  onBulkAdd: (characters: Omit<Character, 'id' | 'imageUrl'>[]) => void;
}

export const BulkAddModal: React.FC<BulkAddModalProps> = ({ onClose, onBulkAdd }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleBulkAdd = () => {
    setError('');
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const newCharacters: Omit<Character, 'id' | 'imageUrl'>[] = [];

    for (const line of lines) {
      const parts = line.split(',').map(part => part.trim());
      if (parts.length !== 3) {
        setError(`Error en la línea: "${line}". El formato debe ser: Nombre, Facción, Nivel.`);
        return;
      }
      
      const [name, faccion, valorStr] = parts;
      const valor = parseInt(valorStr, 10);

      if (!name || !faccion || isNaN(valor)) {
        setError(`Error de formato en la línea: "${line}". Asegúrate de que el nivel sea un número.`);
        return;
      }

      newCharacters.push({ name, faccion, valor });
    }

    if (newCharacters.length > 0) {
      onBulkAdd(newCharacters);
    } else {
        setError("No se encontraron personajes para añadir. Asegúrate de seguir el formato.");
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-xl border border-gray-700 relative p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white">Añadir Varios Personajes</h2>
        
        <div>
            <label htmlFor="bulk-add-textarea" className="block text-sm font-medium text-gray-300 mb-2">
                Pega la lista de personajes aquí.
            </label>
            <textarea
                id="bulk-add-textarea"
                value={text}
                onChange={e => setText(e.target.value)}
                rows={10}
                className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Superman, DC, 98&#10;Batman, DC, 80&#10;Iron Man, Marvel, 90"
            />
            <p className="text-xs text-gray-400 mt-2">
                Formato por línea: <code className="bg-gray-900 px-1 py-0.5 rounded">Nombre, Facción, Nivel</code>
            </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-4 pt-4">
            <button 
                onClick={onClose} 
                className="py-2 px-4 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 transition-colors"
            >
                Cancelar
            </button>
            <button 
                onClick={handleBulkAdd}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-gray-800 transition-colors"
            >
                Añadir Personajes
            </button>
        </div>
      </div>
    </div>
  );
};