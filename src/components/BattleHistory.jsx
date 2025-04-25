import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BattleHistory.css'; // Import component-specific styles

const BattleHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBattleHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3001/battleHistory');
        setHistory(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch battle history.');
        setLoading(false);
      }
    };

    fetchBattleHistory();
  }, []);

  if (loading) {
    return <p>Loading battle history...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="battle-history-container">
      <h2>Battle History</h2>
      {history.length === 0 ? (
        <p>No battles have been fought yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((battle, index) => (
            <li key={index} className="history-item">
              {battle.pokemon1} vs. {battle.pokemon2} - Winner: {battle.winner} ({new Date(battle.date).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BattleHistory;
