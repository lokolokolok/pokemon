import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './PokemonDetails.css';

const PokemonDetails = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon details.');
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  const handleAddToTeam = async () => {
    try {
      const currentTeamResponse = await axios.get('http://localhost:3001/team');
      const currentTeam = currentTeamResponse.data;

      if (currentTeam.length < 6 && !currentTeam.find(p => p.id === pokemon.id)) {
        //  *Important Change:* //  Instead of just checking the team, we now send a POST request
        //  to your json-server to *add* the pokemon to the team data.
        await axios.post('http://localhost:3001/team', pokemon);
        alert(`${pokemon.name} added to your team!`);
      } else if (currentTeam.length >= 6) {
        alert('Your team is full!');
      } else {
        alert(`${pokemon.name} is already in your team!`);
      }
    } catch (error) {
      console.error('Error adding to team:', error);
    }
  };

  if (loading) {
    return <p>Loading details...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!pokemon) {
    return <p>Pokémon not found.</p>;
  }

  return (
    <div className="pokemon-details-container">
      <h2>{pokemon.name}</h2>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="pokemon-image"
      />
      <div className="stats-container">
        <h3>Stats:</h3>
        <ul className="stats-list">
          {pokemon.stats.map((stat) => (
            <li key={stat.stat.name}>
              {stat.stat.name}: {stat.base_stat}
            </li>
          ))}
        </ul>
      </div>
      <div className="types-container">
        <h3>Types:</h3>
        <ul className="types-list">
          {pokemon.types.map((type) => (
            <li key={type.type.name}>{type.type.name}</li>
          ))}
        </ul>
      </div>
      <div className="abilities-container">
        <h3>Abilities:</h3>
        <ul className="abilities-list">
          {pokemon.abilities.map((ability) => (
            <li key={ability.ability.name}>{ability.ability.name}</li>
          ))}
        </ul>
      </div>
      <button onClick={handleAddToTeam} className="add-to-team-button">
        Add to Team
      </button>
    </div>
  );
};

export default PokemonDetails;
