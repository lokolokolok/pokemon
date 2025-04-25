import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PokemonList from './components/PokemonList';
import PokemonDetails from './components/PokemonDetails';
import MyTeam from './components/MyTeam';
import Battle from './components/Battle';
import BattleHistory from './components/BattleHistory';
import './App.css'; // Import global styles

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Pokémon Battler</h1>
          <nav>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">Browse Pokémon</Link>
              </li>
              <li className="nav-item">
                <Link to="/team" className="nav-link">My Team</Link>
              </li>
              <li className="nav-item">
                <Link to="/battle" className="nav-link">Battle</Link>
              </li>
              <li className="nav-item">
                <Link to="/history" className="nav-link">Battle History</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<PokemonList />} />
            <Route path="/pokemon/:id" element={<PokemonDetails />} />
            <Route path="/team" element={<MyTeam />} />
            <Route path="/battle" element={<Battle />} />
            <Route path="/history" element={<BattleHistory />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 Pokémon Battler</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
