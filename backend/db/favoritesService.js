import { query } from './connection.js';

// Obtener todos los favoritos
export const getAllFavorites = async () => {
  try {
    const result = await query('SELECT * FROM favorites ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    throw error;
  }
};

// Obtener favoritos por usuario
export const getFavoritesByUser = async (userId) => {
  try {
    const result = await query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error al obtener favoritos por usuario:', error);
    throw error;
  }
};

// Obtener un favorito por ID
export const getFavoriteById = async (id) => {
  try {
    const result = await query('SELECT * FROM favorites WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error al obtener favorito por ID:', error);
    throw error;
  }
};

// Verificar si un pokémon ya es favorito
export const isFavorite = async (pokemonId, userId) => {
  try {
    const result = await query(
      'SELECT id FROM favorites WHERE pokemon_id = $1 AND user_id = $2',
      [pokemonId, userId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    throw error;
  }
};

// Crear un nuevo favorito
export const createFavorite = async (pokemonId, pokemonName, userId = 1) => {
  try {
    // Verificar si ya existe
    const exists = await isFavorite(pokemonId, userId);
    if (exists) {
      throw new Error('Este pokémon ya está en favoritos');
    }

    const result = await query(
      'INSERT INTO favorites (pokemon_id, pokemon_name, user_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [pokemonId, pokemonName, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al crear favorito:', error);
    throw error;
  }
};

// Actualizar un favorito
export const updateFavorite = async (id, pokemonName) => {
  try {
    const result = await query(
      'UPDATE favorites SET pokemon_name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [pokemonName, id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Favorito no encontrado');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar favorito:', error);
    throw error;
  }
};

// Eliminar un favorito por ID
export const deleteFavorite = async (id) => {
  try {
    const result = await query('DELETE FROM favorites WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Favorito no encontrado');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    throw error;
  }
};

// Eliminar favorito por pokémon y usuario
export const deleteFavoriteByPokemon = async (pokemonId, userId) => {
  try {
    const result = await query(
      'DELETE FROM favorites WHERE pokemon_id = $1 AND user_id = $2 RETURNING *',
      [pokemonId, userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Favorito no encontrado');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al eliminar favorito por pokémon:', error);
    throw error;
  }
};

// Eliminar todos los favoritos de un usuario
export const deleteAllFavoritesByUser = async (userId) => {
  try {
    const result = await query('DELETE FROM favorites WHERE user_id = $1', [userId]);
    return result.rowCount;
  } catch (error) {
    console.error('Error al eliminar todos los favoritos:', error);
    throw error;
  }
};