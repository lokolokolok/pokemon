import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyTeam.css';

const MyTeam = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await axios.get('http://localhost:3001/team');
      setTeam(response.data);
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  const removeFromTeam = async (pokemonId) => {
    console.log("Removing Pokémon with ID:", pokemonId); // Debug log
    try {
      const response = await axios.delete(`http://localhost:3001/team/${pokemonId}`);
      if (response.status === 200 || response.status === 204) {
        setTeam(prevTeam => prevTeam.filter(pokemon => pokemon.id !== pokemonId));
      } else {
        console.error('Failed to delete Pokémon:', response);
      }
    } catch (error) {
      console.error('Error removing from team:', error);
    }
  };

  return (
    <div className="my-team-container">
      <h2>My Team</h2>
      {team.length === 0 ? (
        <p>Your team is empty. Add some Pokémon!</p>
      ) : (
        <ul className="team-list">
          {team.map((pokemon) => (
            <li key={pokemon.id} className="team-item">
              {pokemon.name}
              <button
                onClick={() => removeFromTeam(pokemon.id)}
                className="remove-button"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {team.length >= 6 && <p className="team-full-message">Your team is full (max 6 Pokémon).</p>}
    </div>
  );
};

export default MyTeam;
