import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Battle.css';

const Battle = () => {
  const [team, setTeam] = useState([]);
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [battleLog, setBattleLog] = useState([]); // Added state for battle log

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

  const handleSelectPokemon1 = (event) => {
    const selectedPokemon = team.find(p => p.id === parseInt(event.target.value));
    setPokemon1(selectedPokemon);
  };

  const handleSelectPokemon2 = (event) => {
    const selectedPokemon = team.find(p => p.id === parseInt(event.target.value));
    setPokemon2(selectedPokemon);
  };

  const simulateBattle = async () => {
    if (!pokemon1 || !pokemon2) {
      alert('Please select two Pokémon to battle!');
      return;
    }

    setBattleLog([]); // Clear previous log
    const roundsWon = {
      [pokemon1.name]: 0,
      [pokemon2.name]: 0,
    };
    const newBattleLog = []; // Local array to build log

    // Round 1: HP
    const hp1 = pokemon1.stats.find(s => s.stat.name === 'hp').base_stat;
    const hp2 = pokemon2.stats.find(s => s.stat.name === 'hp').base_stat;
    newBattleLog.push(`Round 1 - HP: ${pokemon1.name} (${hp1}) vs. ${pokemon2.name} (${hp2})`);
    if (hp1 > hp2) {
      roundsWon[pokemon1.name]++;
      newBattleLog.push(`${pokemon1.name} wins Round 1`);
    } else if (hp2 > hp1) {
      roundsWon[pokemon2.name]++;
      newBattleLog.push(`${pokemon2.name} wins Round 1`);
    } else {
      newBattleLog.push(`Round 1 is a tie`);
    }

    // Round 2: Attack
    const attack1 = pokemon1.stats.find(s => s.stat.name === 'attack').base_stat;
    const attack2 = pokemon2.stats.find(s => s.stat.name === 'attack').base_stat;
    newBattleLog.push(`Round 2 - Attack: ${pokemon1.name} (${attack1}) vs. ${pokemon2.name} (${attack2})`);
    if (attack1 > attack2) {
      roundsWon[pokemon1.name]++;
      newBattleLog.push(`${pokemon1.name} wins Round 2`);
    } else if (attack2 > attack1) {
      roundsWon[pokemon2.name]++;
      newBattleLog.push(`${pokemon2.name} wins Round 2`);
    } else {
      newBattleLog.push(`Round 2 is a tie`);
    }

    // Round 3: Speed
    const speed1 = pokemon1.stats.find(s => s.stat.name === 'speed').base_stat;
    const speed2 = pokemon2.stats.find(s => s.stat.name === 'speed').base_stat;
    newBattleLog.push(`Round 3 - Speed: ${pokemon1.name} (${speed1}) vs. ${pokemon2.name} (${speed2})`);
    if (speed1 > speed2) {
      roundsWon[pokemon1.name]++;
      newBattleLog.push(`${pokemon1.name} wins Round 3`);
    } else if (speed2 > speed1) {
      roundsWon[pokemon2.name]++;
      newBattleLog.push(`${pokemon2.name} wins Round 3`);
    } else {
      newBattleLog.push(`Round 3 is a tie`);
    }

    let winner;
    if (roundsWon[pokemon1.name] > roundsWon[pokemon2.name]) {
      winner = pokemon1.name;
      newBattleLog.push(`${pokemon1.name} wins the battle!`);
    } else if (roundsWon[pokemon2.name] > roundsWon[pokemon1.name]) {
      winner = pokemon2.name;
      newBattleLog.push(`${pokemon2.name} wins the battle!`);
    } else {
      winner = 'It\'s a tie!';
      newBattleLog.push(`The battle is a tie!`);
    }

    const battleRecord = {
      pokemon1: pokemon1.name,
      pokemon2: pokemon2.name,
      winner: winner === 'It\'s a tie!' ? 'Tie' : winner,
      date: new Date().toISOString(),
      battleType: 'simple-stats'
    };

    saveBattleResult(battleRecord);
    setBattleResult(battleRecord);
    setBattleLog(newBattleLog); // Update the battle log state
  };

  const saveBattleResult = async (result) => {
    try {
      await axios.post('http://localhost:3001/battleHistory', result);
    } catch (error) {
      console.error('Error saving battle result:', error);
    }
  };

  return (
    <div className="battle-container">
      <h2>Battle Simulator</h2>
      <div>
        <label htmlFor="pokemon1">Pokemon 1:</label>
        <select id="pokemon1" onChange={handleSelectPokemon1} className="pokemon-select">
          <option value="">Select a Pokémon</option>
          {team.map((pokemon) => (
            <option key={pokemon.id} value={pokemon.id}>{pokemon.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="pokemon2">Pokemon 2:</label>
        <select id="pokemon2" onChange={handleSelectPokemon2} className="pokemon-select">
          <option value="">Select a Pokémon</option>
          {team.map((pokemon) => (
            <option key={pokemon.id} value={pokemon.id}>{pokemon.name}</option>
          ))}
        </select>
      </div>
      <button onClick={simulateBattle} disabled={!pokemon1 || !pokemon2} className="battle-button">
        Simulate Battle
      </button>

      {battleResult && (
        <div className="battle-result">
          <h3>Battle Result:</h3>
          <p>{battleResult.pokemon1} vs. {battleResult.pokemon2}</p>
          <p className="winner">
            <strong>Winner: {battleResult.winner}</strong>
          </p>
          <p>Date: {new Date(battleResult.date).toLocaleString()}</p>
          <h4>Battle Log:</h4>
          <ul className="battle-log">
            {battleLog.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
           {/* Display the table */}
          <h4>Round Details:</h4>
          <table className="round-table">
            <thead>
              <tr>
                <th>Stat</th>
                <th>{pokemon1.name}</th>
                <th>{pokemon2.name}</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>HP</td>
                <td>{pokemon1.stats.find(s => s.stat.name === 'hp').base_stat}</td>
                <td>{pokemon2.stats.find(s => s.stat.name === 'hp').base_stat}</td>
                <td>
                  {pokemon1.stats.find(s => s.stat.name === 'hp').base_stat >
                  pokemon2.stats.find(s => s.stat.name === 'hp').base_stat
                    ? pokemon1.name
                    : pokemon2.name}
                </td>
              </tr>
              <tr>
                <td>Attack</td>
                <td>{pokemon1.stats.find(s => s.stat.name === 'attack').base_stat}</td>
                <td>{pokemon2.stats.find(s => s.stat.name === 'attack').base_stat}</td>
                <td>
                {pokemon1.stats.find(s => s.stat.name === 'attack').base_stat >
                  pokemon2.stats.find(s => s.stat.name === 'attack').base_stat
                    ? pokemon1.name
                    : pokemon2.name}
                </td>
              </tr>
              <tr>
                <td>Speed</td>
                <td>{pokemon1.stats.find(s => s.stat.name === 'speed').base_stat}</td>
                <td>{pokemon2.stats.find(s => s.stat.name === 'speed').base_stat}</td>
                <td>
                {pokemon1.stats.find(s => s.stat.name === 'speed').base_stat >
                  pokemon2.stats.find(s => s.stat.name === 'speed').base_stat
                    ? pokemon1.name
                    : pokemon2.name}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Battle;
