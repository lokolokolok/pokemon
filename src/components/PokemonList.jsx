import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PokemonList.css'; // Import component-specific styles

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchPokemon = async (url = 'https://pokeapi.co/api/v2/pokemon') => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setPokemonList(response.data.results);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleNext = () => {
    if (nextUrl) {
      fetchPokemon(nextUrl);
    }
  };

  const handlePrev = () => {
    if (prevUrl) {
      fetchPokemon(prevUrl);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  useEffect(() => {
    if (searchQuery) {
      const filteredPokemon = pokemonList.filter(pokemon =>
        pokemon.name.includes(searchQuery)
      );
      setSearchResults(filteredPokemon);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, pokemonList]);

  const displayList = searchQuery ? searchResults : pokemonList;

  if (loading) {
    return <p>Loading Pokémon...</p>;
  }

  return (
    <div className="pokemon-list-container">
      <h2>Browse Pokémon</h2>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchQuery}
        onChange={handleSearchInputChange}
        className="search-input"
      />
      <ul className="pokemon-list">
        {displayList.map((pokemon) => (
          <li key={pokemon.name} className="pokemon-item">
            <Link
              to={`/pokemon/${pokemon.url.split('/').slice(-2, -1)[0]}`}
              className="pokemon-link"
            >
              {pokemon.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={handlePrev} disabled={!prevUrl} className="pagination-button">
          Previous
        </button>
        <button onClick={handleNext} disabled={!nextUrl} className="pagination-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default PokemonList;
