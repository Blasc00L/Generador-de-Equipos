import React, { useState } from 'react';
import type { Character } from '../types';
import { PlusIcon } from './icons';

interface AddCharacterFormProps {
  onAddCharacter: (character: Omit<Character, 'id' | 'imageUrl'>) => void;
}

export const AddCharacterForm: React.FC<AddCharacterFormProps> = ({ onAddCharacter }) => {
  const [name, setName] = useState('');
  const [faccion, setFaccion] = useState('');
  const [valor, setValor] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !faccion) {
      alert("El nombre y la facción son obligatorios.");
      return;
    }
    
    onAddCharacter({ 
      name, 
      faccion, 
      valor: Number(valor),
    });
    setName('');
    setFaccion('');
    setValor(50);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Añadir Nuevo Personaje</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre del Personaje</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Valquiria"
            required
            className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
         <div>
          <label htmlFor="faccion" className="block text-sm font-medium text-gray-300">Facción</label>
          <input
            id="faccion"
            type="text"
            value={faccion}
            onChange={(e) => setFaccion(e.target.value)}
            placeholder="Ej: Alianza de la Luz"
            required
            className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
         <div>
          <label htmlFor="valor" className="block text-sm font-medium text-gray-300">Nivel: <span className="font-bold text-yellow-400">{valor}</span></label>
          <input
            id="valor"
            type="range"
            min="1"
            max="100"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            className="mt-1 w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <button type="submit" className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-gray-800 transition-colors">
          <PlusIcon />
          Añadir Personaje
        </button>
      </form>
    </div>
  );
};