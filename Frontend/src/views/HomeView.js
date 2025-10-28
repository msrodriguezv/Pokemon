import { 
    getPokemons, 
    getPokemonDetails, 
    searchPokemon,
    toggleFavorite,
    isFavorite,
    getCurrentUser,
    logoutUser 
  } from '../api/api.js';
  
  export class HomeView {
    constructor() {
      this.currentPage = 0;
      this.limit = 20;
      this.isLoading = false;
      this.searchTimeout = null;
    }
  
    /**
     * Renderizar la vista principal
     * @returns {string} HTML del home
     */
    render() {
      const user = getCurrentUser();
      
      return `
        <div class="home-container">
          <!-- Header -->
          <header class="header">
            <div class="header-content">
              <div class="logo">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="Pikachu">
                <h1>PokéFav</h1>
              </div>
  
              <div class="search-bar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input 
                  type="text" 
                  id="searchInput" 
                  placeholder="Buscar Pokémon..."
                >
              </div>
  
              <div class="user-menu">
                <div class="user-info">
                  <img src="${user?.avatar || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'}" alt="${user?.name}">
                  <span>${user?.name || 'Usuario'}</span>
                </div>
                <nav class="nav-links">
                  <a href="/home" class="nav-link active" data-link>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Inicio
                  </a>
                  <a href="/favorites" class="nav-link" data-link>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Favoritos
                  </a>
                  <button class="btn-logout" id="logoutBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Salir
                  </button>
                </nav>
              </div>
            </div>
          </header>
  
          <!-- Main Content -->
          <main class="main-content">
            <div class="container">
              <h2 class="section-title">Descubre Pokémon</h2>
              
              <!-- Resultados de búsqueda -->
              <div id="searchResults" class="search-results" style="display: none;"></div>
  
              <!-- Grid de Pokémon -->
              <div id="pokemonGrid" class="pokemon-grid">
                <div class="loading">
                  <div class="pokeball-loader"></div>
                  <p>Cargando Pokémon...</p>
                </div>
              </div>
  
              <!-- Paginación -->
              <div class="pagination" id="pagination">
                <button id="prevBtn" class="btn-page" disabled>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  Anterior
                </button>
                <span id="pageInfo">Página 1</span>
                <button id="nextBtn" class="btn-page">
                  Siguiente
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </main>
  
          <!-- Modal de detalles -->
          <div id="pokemonModal" class="modal" style="display: none;">
            <div class="modal-backdrop"></div>
            <div class="modal-content">
              <!-- El contenido se llenará dinámicamente -->
            </div>
          </div>
        </div>
  
        <style>
          .home-container {
            min-height: 100vh;
            background: #f8f9fa;
          }
  
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
          }
  
          .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
          }
  
          .logo {
            display: flex;
            align-items: center;
            gap: 10px;
          }
  
          .logo img {
            width: 50px;
            height: 50px;
            animation: bounce 2s infinite;
          }
  
          .logo h1 {
            font-size: 28px;
            font-weight: 700;
          }
  
          .search-bar {
            flex: 1;
            max-width: 400px;
            position: relative;
          }
  
          .search-bar svg {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
          }
  
          .search-bar input {
            width: 100%;
            padding: 12px 15px 12px 45px;
            border: none;
            border-radius: 25px;
            font-size: 14px;
            outline: none;
          }
  
          .user-menu {
            display: flex;
            align-items: center;
            gap: 20px;
          }
  
          .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 15px;
            border-radius: 25px;
          }
  
          .user-info img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: white;
          }
  
          .nav-links {
            display: flex;
            gap: 10px;
          }
  
          .nav-link, .btn-logout {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 10px;
            color: white;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
          }
  
          .nav-link:hover, .btn-logout:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }
  
          .nav-link.active {
            background: white;
            color: #667eea;
          }
  
          .main-content {
            padding: 40px 20px;
          }
  
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
  
          .section-title {
            font-size: 32px;
            color: #333;
            margin-bottom: 30px;
            text-align: center;
          }
  
          .search-results {
            background: white;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
  
          .search-result-item {
            padding: 10px;
            cursor: pointer;
            border-radius: 8px;
            transition: background 0.2s;
          }
  
          .search-result-item:hover {
            background: #f5f5f5;
          }
  
          .pokemon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
          }
  
          .pokemon-card {
            background: white;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
  
          .pokemon-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transform: scaleX(0);
            transition: transform 0.3s;
          }
  
          .pokemon-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          }
  
          .pokemon-card:hover::before {
            transform: scaleX(1);
          }
  
          .pokemon-card img {
            width: 150px;
            height: 150px;
            object-fit: contain;
            margin-bottom: 10px;
          }
  
          .pokemon-card h3 {
            font-size: 20px;
            color: #333;
            margin: 10px 0;
            text-transform: capitalize;
          }
  
          .pokemon-id {
            color: #999;
            font-size: 14px;
            margin-bottom: 10px;
          }
  
          .pokemon-types {
            display: flex;
            gap: 5px;
            justify-content: center;
            margin: 10px 0;
          }
  
          .type-badge {
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 12px;
            color: white;
            font-weight: 600;
            text-transform: capitalize;
          }
  
          .type-normal { background: #A8A878; }
          .type-fire { background: #F08030; }
          .type-water { background: #6890F0; }
          .type-electric { background: #F8D030; }
          .type-grass { background: #78C850; }
          .type-ice { background: #98D8D8; }
          .type-fighting { background: #C03028; }
          .type-poison { background: #A040A0; }
          .type-ground { background: #E0C068; }
          .type-flying { background: #A890F0; }
          .type-psychic { background: #F85888; }
          .type-bug { background: #A8B820; }
          .type-rock { background: #B8A038; }
          .type-ghost { background: #705898; }
          .type-dragon { background: #7038F8; }
          .type-dark { background: #705848; }
          .type-steel { background: #B8B8D0; }
          .type-fairy { background: #EE99AC; }
  
          .btn-favorite {
            margin-top: 10px;
            padding: 8px 16px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 5px;
          }
  
          .btn-favorite:hover {
            background: #667eea;
            color: white;
          }
  
          .btn-favorite.is-favorite {
            background: #667eea;
            color: white;
          }
  
          .loading {
            grid-column: 1 / -1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
          }
  
          .pokeball-loader {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(180deg, #f00 50%, #fff 50%);
            border: 5px solid #333;
            position: relative;
            animation: spin 1s linear infinite;
          }
  
          .pokeball-loader::before {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            background: white;
            border: 5px solid #333;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
  
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
  
          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 40px;
          }
  
          .btn-page {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
          }
  
          .btn-page:hover:not(:disabled) {
            background: #764ba2;
            transform: translateY(-2px);
          }
  
          .btn-page:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
  
          #pageInfo {
            font-weight: 600;
            color: #333;
          }
  
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
          }
  
          .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
          }
  
          .modal-content {
            position: relative;
            max-width: 600px;
            margin: 50px auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease-out;
          }
  
          @media (max-width: 768px) {
            .header-content {
              flex-direction: column;
            }
  
            .search-bar {
              max-width: 100%;
            }
  
            .pokemon-grid {
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
              gap: 15px;
            }
  
            .nav-links {
              flex-wrap: wrap;
            }
          }
        </style>
      `;
    }
  
    /**
     * Inicializar eventos después de renderizar
     */
    afterRender() {
      this.loadPokemons();
      this.attachEventListeners();
    }
  
    /**
     * Adjuntar event listeners
     */
    attachEventListeners() {
      // Búsqueda
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.handleSearch(e));
      }
  
      // Paginación
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.previousPage());
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.nextPage());
      }
  
      // Logout
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => this.handleLogout());
      }
  
      // Cerrar modal al hacer click en el backdrop
      const modal = document.getElementById('pokemonModal');
      if (modal) {
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.addEventListener('click', () => this.closeModal());
        }
      }
    }
  
    /**
     * Cargar pokémon con paginación
     */
    async loadPokemons() {
      if (this.isLoading) return;
  
      this.isLoading = true;
      const grid = document.getElementById('pokemonGrid');
      
      grid.innerHTML = `
        <div class="loading">
          <div class="pokeball-loader"></div>
          <p>Cargando Pokémon...</p>
        </div>
      `;
  
      try {
        const offset = this.currentPage * this.limit;
        const data = await getPokemons(this.limit, offset);
  
        grid.innerHTML = '';
  
        for (const pokemon of data.results) {
          const details = await getPokemonDetails(pokemon.name);
          const card = await this.createPokemonCard(details);
          grid.appendChild(card);
        }
  
        this.updatePagination();
  
      } catch (error) {
        console.error('Error al cargar pokémon:', error);
        grid.innerHTML = `
          <div class="loading">
            <p style="color: #c33;">Error al cargar Pokémon. Intenta de nuevo.</p>
          </div>
        `;
      } finally {
        this.isLoading = false;
      }
    }
  
    /**
     * Crear tarjeta de pokémon
     */
    async createPokemonCard(pokemon) {
      const card = document.createElement('div');
      card.className = 'pokemon-card';
      
      const isFav = await isFavorite(pokemon.id);
      
      card.innerHTML = `
        <img src="${pokemon.sprites.official_artwork}" alt="${pokemon.name}">
        <h3>${pokemon.name}</h3>
        <p class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</p>
        <div class="pokemon-types">
          ${pokemon.types.map(type => 
            `<span class="type-badge type-${type}">${type}</span>`
          ).join('')}
        </div>
        <button class="btn-favorite ${isFav ? 'is-favorite' : ''}" data-id="${pokemon.id}" data-name="${pokemon.name}">
          ${isFav ? '💖 En Favoritos' : '🤍 Agregar a Favoritos'}
        </button>
      `;
  
      // Event para ver detalles
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn-favorite')) {
          this.showPokemonDetails(pokemon);
        }
      });
  
      // Event para favoritos
      const favoriteBtn = card.querySelector('.btn-favorite');
      favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleToggleFavorite(pokemon.id, pokemon.name, favoriteBtn);
      });
  
      return card;
    }
  
    /**
     * Toggle favorito
     */
    async handleToggleFavorite(pokemonId, pokemonName, button) {
      try {
        button.disabled = true;
        
        await toggleFavorite(pokemonId, pokemonName);
        const isFav = await isFavorite(pokemonId);
  
        if (isFav) {
          button.classList.add('is-favorite');
          button.innerHTML = '💖 En Favoritos';
        } else {
          button.classList.remove('is-favorite');
          button.innerHTML = '🤍 Agregar a Favoritos';
        }
  
      } catch (error) {
        console.error('Error al toggle favorito:', error);
        alert('Error: ' + error.message);
      } finally {
        button.disabled = false;
      }
    }
  
    /**
     * Mostrar detalles del pokémon
     */
    showPokemonDetails(pokemon) {
      const modal = document.getElementById('pokemonModal');
      const modalContent = modal.querySelector('.modal-content');
  
      modalContent.innerHTML = `
        <button class="close-modal" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 30px; cursor: pointer; color: #999;">&times;</button>
        <div style="text-align: center;">
          <img src="${pokemon.sprites.official_artwork}" alt="${pokemon.name}" style="width: 200px; height: 200px;">
          <h2 style="text-transform: capitalize; margin: 20px 0;">${pokemon.name}</h2>
          <p style="color: #999;">#${String(pokemon.id).padStart(3, '0')}</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; text-align: left;">
            <div>
              <strong>Altura:</strong> ${pokemon.height / 10}m
            </div>
            <div>
              <strong>Peso:</strong> ${pokemon.weight / 10}kg
            </div>
          </div>
  
          <h3 style="margin: 20px 0 10px;">Tipos</h3>
          <div class="pokemon-types">
            ${pokemon.types.map(type => 
              `<span class="type-badge type-${type}">${type}</span>`
            ).join('')}
          </div>
  
          <h3 style="margin: 20px 0 10px;">Habilidades</h3>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
            ${pokemon.abilities.map(ability => 
              `<span style="padding: 5px 12px; background: #f5f5f5; border-radius: 15px; font-size: 14px;">${ability}</span>`
            ).join('')}
          </div>
  
          <h3 style="margin: 20px 0 10px;">Estadísticas</h3>
          ${pokemon.stats.map(stat => `
            <div style="margin: 10px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="text-transform: capitalize;">${stat.name.replace('-', ' ')}</span>
                <span>${stat.value}</span>
              </div>
              <div style="background: #e0e0e0; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 10px; width: ${(stat.value / 255) * 100}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
  
      modal.style.display = 'block';
  
      const closeBtn = modalContent.querySelector('.close-modal');
      closeBtn.addEventListener('click', () => this.closeModal());
    }
  
    /**
     * Cerrar modal
     */
    closeModal() {
      const modal = document.getElementById('pokemonModal');
      modal.style.display = 'none';
    }
  
    /**
     * Buscar pokémon
     */
    async handleSearch(event) {
      const searchTerm = event.target.value.trim();
      const searchResults = document.getElementById('searchResults');
  
      clearTimeout(this.searchTimeout);
  
      if (searchTerm.length < 2) {
        searchResults.style.display = 'none';
        return;
      }
  
      this.searchTimeout = setTimeout(async () => {
        try {
          searchResults.innerHTML = '<p>Buscando...</p>';
          searchResults.style.display = 'block';
  
          const results = await searchPokemon(searchTerm);
  
          if (results.length === 0) {
            searchResults.innerHTML = '<p>No se encontraron resultados</p>';
            return;
          }
  
          searchResults.innerHTML = results.slice(0, 5).map(pokemon => `
            <div class="search-result-item" data-name="${pokemon.name}">
              ${pokemon.name}
            </div>
          `).join('');
  
          // Event listeners para resultados
          searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', async () => {
              const name = item.dataset.name;
              const details = await getPokemonDetails(name);
              this.showPokemonDetails(details);
              searchResults.style.display = 'none';
              event.target.value = '';
            });
          });
  
        } catch (error) {
          console.error('Error en búsqueda:', error);
          searchResults.innerHTML = '<p>Error en la búsqueda</p>';
        }
      }, 300);
    }
  
    /**
     * Página anterior
     */
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.loadPokemons();
      }
    }
  
    /**
     * Página siguiente
     */
    nextPage() {
      this.currentPage++;
      this.loadPokemons();
    }
  
    /**
     * Actualizar paginación
     */
    updatePagination() {
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const pageInfo = document.getElementById('pageInfo');
  
      if (prevBtn) {
        prevBtn.disabled = this.currentPage === 0;
      }
  
      if (pageInfo) {
        pageInfo.textContent = `Página ${this.currentPage + 1}`;
      }
    }
  
    /**
     * Logout
     */
    handleLogout() {
      if (confirm('¿Estás seguro de cerrar sesión?')) {
        logoutUser();
      }
    }
  
    /**
     * Limpiar la vista
     */
    destroy() {
      clearTimeout(this.searchTimeout);
    }
  }