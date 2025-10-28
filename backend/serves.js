import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db/connection.js';
import * as pokemonService from './db/pokemonService.js';
import * as favoritesService from './db/favoritesService.js';

// Configuración para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de variables de entorno
const PORT = process.env.PORT || 3000;

// Crear instancia de Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../Frontend')));

// ==================== RUTAS API - POKEAPI ====================

// Obtener lista de pokémon
app.get('/api/pokemon', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    
    const data = await pokemonService.getPokemons(limit, offset);
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener pokémon' });
  }
});

// Buscar pokémon por nombre
app.get('/api/pokemon/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }
    
    const results = await pokemonService.searchPokemonByName(q);
    res.json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al buscar pokémon' });
  }
});

// Obtener pokémon por ID o nombre
app.get('/api/pokemon/:idOrName', async (req, res) => {
  try {
    const { idOrName } = req.params;
    const data = await pokemonService.getPokemonDetails(idOrName);
    
    if (!data) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener pokémon' });
  }
});

// Obtener tipos de pokémon
app.get('/api/types', async (req, res) => {
  try {
    const types = await pokemonService.getPokemonTypes();
    res.json(types);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener tipos' });
  }
});

// Obtener pokémon por tipo
app.get('/api/types/:type/pokemon', async (req, res) => {
  try {
    const { type } = req.params;
    const pokemon = await pokemonService.getPokemonByType(type);
    res.json(pokemon);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener pokémon por tipo' });
  }
});

// ==================== RUTAS API - FAVORITOS ====================

// Obtener todos los favoritos
app.get('/api/favorites', async (req, res) => {
  try {
    const favorites = await favoritesService.getAllFavorites();
    res.json(favorites);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

// Obtener favoritos por usuario
app.get('/api/favorites/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await favoritesService.getFavoritesByUser(userId);
    res.json(favorites);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener favoritos del usuario' });
  }
});

// Verificar si un pokémon es favorito
app.get('/api/favorites/check/:pokemonId/:userId', async (req, res) => {
  try {
    const { pokemonId, userId } = req.params;
    const isFav = await favoritesService.isFavorite(pokemonId, userId);
    res.json({ isFavorite: isFav });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al verificar favorito' });
  }
});

// Agregar un favorito
app.post('/api/favorites', async (req, res) => {
  try {
    const { pokemon_id, pokemon_name, user_id = 1 } = req.body;
    
    if (!pokemon_id || !pokemon_name) {
      return res.status(400).json({ error: 'pokemon_id y pokemon_name son requeridos' });
    }
    
    const favorite = await favoritesService.createFavorite(pokemon_id, pokemon_name, user_id);
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error:', error);
    
    if (error.message === 'Este pokémon ya está en favoritos') {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error al agregar favorito' });
  }
});

// Actualizar un favorito
app.put('/api/favorites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { pokemon_name } = req.body;
    
    if (!pokemon_name) {
      return res.status(400).json({ error: 'pokemon_name es requerido' });
    }
    
    const favorite = await favoritesService.updateFavorite(id, pokemon_name);
    res.json(favorite);
  } catch (error) {
    console.error('Error:', error);
    
    if (error.message === 'Favorito no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error al actualizar favorito' });
  }
});

// Eliminar un favorito por ID
app.delete('/api/favorites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await favoritesService.deleteFavorite(id);
    res.json({ message: 'Favorito eliminado', favorite });
  } catch (error) {
    console.error('Error:', error);
    
    if (error.message === 'Favorito no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
});

// Eliminar favorito por pokémon y usuario
app.delete('/api/favorites/pokemon/:pokemonId/:userId', async (req, res) => {
  try {
    const { pokemonId, userId } = req.params;
    const favorite = await favoritesService.deleteFavoriteByPokemon(pokemonId, userId);
    res.json({ message: 'Favorito eliminado', favorite });
  } catch (error) {
    console.error('Error:', error);
    
    if (error.message === 'Favorito no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
});

// ==================== RUTA DE SALUD ====================

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// ==================== RUTAS FRONTEND ====================

// Todas las demás rutas sirven el index.html (para SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🎮 PokeAPI proxy disponible`);
});