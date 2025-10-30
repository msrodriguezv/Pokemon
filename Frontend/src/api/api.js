// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000/api';
const STRAPI_URL = 'http://localhost:1337/api';

// ==================== UTILIDADES ====================

/**
 * Función helper para hacer peticiones HTTP
 * @param {string} endpoint - Endpoint de la API
 * @param {object} options - Opciones de fetch
 * @returns {Promise<any>} Respuesta de la API
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error);
    throw error;
  }
};

// ==================== AUTENTICACIÓN ====================

/**
 * Login de usuario con Strapi
 * @param {string} identifier - Email o username del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<object>} Datos del usuario y JWT token
 */
export const loginUser = async (identifier, password) => {
  try {
    // Llamar al endpoint de autenticación de Strapi
    const response = await fetch(`${STRAPI_URL}/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: identifier, // Puede ser email o username
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Credenciales incorrectas');
    }

    const data = await response.json();

    // Strapi devuelve: { jwt, user }
    const { jwt, user } = data;

    // Guardar en localStorage
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.username, // Usar username como name si no hay campo name
      avatar: null, // Puedes agregar un campo avatar en Strapi si lo necesitas
      token: jwt,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwt);
    localStorage.setItem('isAuthenticated', 'true');

    return userData;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

/**
 * Logout de usuario
 */
export const logoutUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('isAuthenticated');
  window.location.hash = '#/login';
};

/**
 * Obtener usuario actual
 * @returns {object|null} Datos del usuario o null
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// ==================== POKÉMON API ====================

/**
 * Obtener lista de pokémon con paginación
 * @param {number} limit - Límite de resultados
 * @param {number} offset - Offset para paginación
 * @returns {Promise<object>} Lista de pokémon
 */
export const getPokemons = async (limit = 20, offset = 0) => {
  return fetchAPI(`/pokemon?limit=${limit}&offset=${offset}`);
};

/**
 * Obtener detalles de un pokémon por ID o nombre
 * @param {string|number} idOrName - ID o nombre del pokémon
 * @returns {Promise<object>} Detalles del pokémon
 */
export const getPokemonDetails = async (idOrName) => {
  return fetchAPI(`/pokemon/${idOrName}`);
};

/**
 * Buscar pokémon por nombre
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<array>} Lista de pokémon que coinciden
 */
export const searchPokemon = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return [];
  }
  return fetchAPI(`/pokemon/search?q=${encodeURIComponent(searchTerm)}`);
};

/**
 * Obtener todos los tipos de pokémon
 * @returns {Promise<array>} Lista de tipos
 */
export const getPokemonTypes = async () => {
  return fetchAPI('/types');
};

/**
 * Obtener pokémon por tipo
 * @param {string} type - Tipo de pokémon (fire, water, etc.)
 * @returns {Promise<array>} Lista de pokémon del tipo especificado
 */
export const getPokemonByType = async (type) => {
  return fetchAPI(`/types/${type}/pokemon`);
};

// ==================== FAVORITOS ====================

/**
 * Obtener todos los favoritos del usuario actual
 * @returns {Promise<array>} Lista de favoritos
 */
export const getFavorites = async () => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Usuario no autenticado');
  }
  return fetchAPI(`/favorites/user/${user.id}`);
};

/**
 * Agregar un pokémon a favoritos
 * @param {number} pokemonId - ID del pokémon
 * @param {string} pokemonName - Nombre del pokémon
 * @returns {Promise<object>} Favorito creado
 */
export const addToFavorites = async (pokemonId, pokemonName) => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  return fetchAPI('/favorites', {
    method: 'POST',
    body: JSON.stringify({
      pokemon_id: pokemonId,
      pokemon_name: pokemonName,
      user_id: user.id,
    }),
  });
};

/**
 * Eliminar un pokémon de favoritos por ID
 * @param {number} favoriteId - ID del favorito
 * @returns {Promise<object>} Resultado de la eliminación
 */
export const removeFavorite = async (favoriteId) => {
  return fetchAPI(`/favorites/${favoriteId}`, {
    method: 'DELETE',
  });
};

/**
 * Eliminar un pokémon de favoritos por pokemonId y userId
 * @param {number} pokemonId - ID del pokémon
 * @returns {Promise<object>} Resultado de la eliminación
 */
export const removeFavoriteByPokemon = async (pokemonId) => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  return fetchAPI(`/favorites/pokemon/${pokemonId}/${user.id}`, {
    method: 'DELETE',
  });
};

/**
 * Verificar si un pokémon es favorito
 * @param {number} pokemonId - ID del pokémon
 * @returns {Promise<boolean>} true si es favorito, false si no
 */
export const isFavorite = async (pokemonId) => {
  const user = getCurrentUser();
  if (!user) {
    return false;
  }

  try {
    const result = await fetchAPI(`/favorites/check/${pokemonId}/${user.id}`);
    return result.isFavorite;
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    return false;
  }
};

/**
 * Toggle favorito (agregar si no existe, eliminar si existe)
 * @param {number} pokemonId - ID del pokémon
 * @param {string} pokemonName - Nombre del pokémon
 * @returns {Promise<object>} Resultado de la operación
 */
export const toggleFavorite = async (pokemonId, pokemonName) => {
  try {
    const isFav = await isFavorite(pokemonId);

    if (isFav) {
      return await removeFavoriteByPokemon(pokemonId);
    } else {
      return await addToFavorites(pokemonId, pokemonName);
    }
  } catch (error) {
    console.error('Error al hacer toggle de favorito:', error);
    throw error;
  }
};

// ==================== HEALTH CHECK ====================

/**
 * Verificar estado del servidor
 * @returns {Promise<object>} Estado del servidor
 */
export const checkHealth = async () => {
  return fetchAPI('/health');
};

// ==================== EXPORTAR TODO ====================

export default {
  // Auth
  loginUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  
  // Pokemon
  getPokemons,
  getPokemonDetails,
  searchPokemon,
  getPokemonTypes,
  getPokemonByType,
  
  // Favorites
  getFavorites,
  addToFavorites,
  removeFavorite,
  removeFavoriteByPokemon,
  isFavorite,
  toggleFavorite,
  
  // Health
  checkHealth,
};