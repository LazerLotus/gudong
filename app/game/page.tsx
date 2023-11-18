'use client'

import React, { useState } from 'react';

function PlayerList({ numberOfPlayers }) {
    function clamp(number, min, max) {
        return Math.min(Math.max(number, min), max);
    }

    numberOfPlayers = clamp(numberOfPlayers, 1, 8)

    const players = Array.from({ length: numberOfPlayers }, (_, index) => index + 1);
    const [playerNames, setPlayerNames] = useState(Array(numberOfPlayers).fill(''));

    const handleNameChange = (index, newName) => {
        setPlayerNames(prevNames => {
            const newPlayerNames = [...prevNames];
            newPlayerNames[index] = newName;
            return newPlayerNames;
        });
    };

    let defalutColors = ["紅", "橙", "黃", "綠", "藍", "紫", "黑", "白"];

    return (
        <div>
            <h2>Player List:</h2>
            <ul>
                {players.map(player => (
                    <li key={player}>
                        Player {player}: {defalutColors[player - 1]}
                        <input type="text" value={playerNames[player - 1]} onChange={(e) => handleNameChange(player - 1, e.target.value)} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

function GameSetup({ onSubmit }) {
    const [numberOfPlayers, setNumberOfPlayers] = useState(0);

    const handleInputChange = event => {
        const inputNumber = parseInt(event.target.value, 10);
        setNumberOfPlayers(isNaN(inputNumber) ? 0 : inputNumber);
    };

    const handleFormSubmit = event => {
        event.preventDefault();
        onSubmit(numberOfPlayers);
    };

    return (
        <div>
            <h2>Game Setup</h2>
            <form onSubmit={handleFormSubmit}>
                <label>
                    Enter the number of players:
                    <input type="number" value={numberOfPlayers} onChange={handleInputChange} min="1" max="8" />
                </label>
                <PlayerList numberOfPlayers={numberOfPlayers} />
            </form>
        </div>
    );
}

function Game() {
    const [phase, setPhase] = useState('setup');
    const [numberOfPlayers, setNumberOfPlayers] = useState(0);

    const handlePlayerSetupSubmit = (numberOfPlayers) => {
        setNumberOfPlayers(numberOfPlayers);
        setPhase('playerList');
    };

    return (
        <div>
            <h1>Game</h1>

            {phase === 'setup' && (
                <GameSetup onSubmit={handlePlayerSetupSubmit} />
            )}


            {/* Add more phases as needed */}
        </div>
    );
}

export default Game;