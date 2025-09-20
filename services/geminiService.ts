import { GoogleGenAI, Type } from "@google/genai";
import type { Character, Team } from '../types';

// fix: Según las directrices de codificación, se eliminó la conversión innecesaria 'as string'.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTeams = async (characters: Character[], numberOfTeams: number): Promise<Team[]> => {
  // fix: Según las directrices de codificación, se asume que la API_KEY está configurada, por lo que esta comprobación es innecesaria.
  if (characters.length < numberOfTeams) {
    throw new Error("No hay suficientes personajes para crear la cantidad de equipos solicitada.");
  }

  // fix: Se pasan los IDs de los personajes al modelo para asegurar un mapeo fiable en la respuesta.
  const characterList = characters.map(c => `- ${c.name} (ID: ${c.id}, Facción: ${c.faccion}, Nivel: ${c.valor})`).join('\n');

  // fix: Se actualizó el prompt para ser más específico y solicitar solo los IDs de los personajes.
  // Esto simplifica la tarea del modelo y hace la respuesta más fiable.
  const prompt = `
    Eres un estratega experto en la creación de equipos para videojuegos. Tu tarea es crear ${numberOfTeams} equipos equilibrados a partir de la siguiente lista de personajes.

    Consideraciones para el equilibrio:
    1. Intenta que la suma de los "Niveles" de cada equipo sea lo más similar posible.
    2. Considera la "Facción" para crear sinergias.
    3. Asegúrate de que cada personaje de la lista sea asignado a un solo equipo.
    4. En la respuesta, para cada miembro de equipo, incluye únicamente su 'id'.

    Lista de Personajes:
    ${characterList}

    Genera una respuesta en formato JSON que se ajuste al esquema proporcionado. Cada equipo debe tener un nombre creativo y una lista de los IDs de sus miembros.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // fix: Se simplificó el esquema para solicitar solo el nombre del equipo y un array de IDs de miembros.
        // Esto es más robusto ya que evita que el modelo alucine detalles de los personajes.
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            teams: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  teamName: {
                    type: Type.STRING,
                    description: "Un nombre creativo para el equipo."
                  },
                  members: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING, description: "El ID de un personaje de la lista." },
                      },
                      required: ['id'],
                    }
                  }
                },
                required: ['teamName', 'members'],
              }
            }
          },
          required: ['teams'],
        },
      }
    });

    // fix: Se añadió .trim() para manejar posibles espacios en blanco al principio/final de la respuesta.
    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    // fix: Se refactorizó el procesamiento de la respuesta para mayor robustez.
    // Mapea los IDs devueltos a los objetos de personaje completos de la lista original.
    if (parsed && parsed.teams) {
      return parsed.teams.map((team: { teamName: string, members: {id: string}[] }) => ({
          teamName: team.teamName,
          members: team.members
            .map((member) => {
              return characters.find(c => c.id === member.id);
            })
            .filter((c): c is Character => c !== undefined) // Filtrar cualquier ID inválido
      }));
    } else {
        throw new Error("La respuesta de la IA no tiene el formato esperado.");
    }

  } catch (error) {
    console.error("Error al generar equipos con Gemini API:", error);
    throw new Error("No se pudieron generar los equipos. Por favor, inténtelo de nuevo.");
  }
};