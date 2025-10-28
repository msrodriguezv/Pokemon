const POKEAPI_BASE_URL = process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

// Obtener lista de pokémon con paginación
export const getPokemons = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error(`Error en PokeAPI: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener pokémon:', error);
    throw error;
  }
};

// Obtener pokémon por ID o nombre
export const getPokemonById = async (idOrName) => {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${idOrName}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error en PokeAPI: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener pokémon por ID:', error);
    throw error;
  }
};

// Obtener detalles de pokémon con información procesada
export const getPokemonDetails = async (idOrName) => {
  try {
    const pokemon = await getPokemonById(idOrName);
    
    if (!pokemon) {
      return null;
    }
    
    // Procesar y simplificar la información
    return {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types.map(t => t.type.name),
      abilities: pokemon.abilities.map(a => a.ability.name),
      stats: pokemon.stats.map(s => ({
        name: s.stat.name,
        value: s.base_stat
      })),
      sprites: {
        front_default: pokemon.sprites.front_default,
        front_shiny: pokemon.sprites.front_shiny,
        official_artwork: pokemon.sprites.other['official-artwork'].front_default
      }
    };
  } catch (error) {
    console.error('Error al obtener detalles del pokémon:', error);
    throw error;
  }
};

// Buscar pokémon por nombre (busca en la lista completa)
export const searchPokemonByName = async (searchTerm) => {
  try {
    // Obtener lista completa (limitado a 1000 para no sobrecargar)
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=1000`);
    const data = await response.json();
    
    // Filtrar por término de búsqueda
    const filtered = data.results.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered;
  } catch (error) {
    console.error('Error al buscar pokémon:', error);
    throw error;
  }
};

// Obtener tipos de pokémon
export const getPokemonTypes = async () => {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/type`);
    
    if (!response.ok) {
      throw new Error(`Error en PokeAPI: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error al obtener tipos:', error);
    throw error;
  }
};

// Obtener pokémon por tipo
export const getPokemonByType = async (type) => {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/type/${type}`);
    
    if (!response.ok) {
      throw new Error(`Error en PokeAPI: ${response.status}`);
    }
    
    const data = await response.json();
    return data.pokemon.map(p => p.pokemon);
  } catch (error) {
    console.error('Error al obtener pokémon por tipo:', error);
    throw error;
  }
};