import React, { useState } from 'react';
import { useGameMetaContext } from './GameMetaContext';
import { useGameContext } from './GameContext';
import { Alexandria } from 'next/font/google';

function CharacterSelecting({ playerIndex, playerNames, playerNumbers, onCharacterSubmit }) {
    const [characterChose, setCharacterChose] = useState(0);

    const { ANIMALS, animalOrders, setAnimalOrders = () => { }, characters, setCharacters = () => { }, characterList, gameLog, addGameLog, setGameLog } =
        useGameContext() ?? {
            ANIMALS: [],
            animalOrders: [],
            setAnimalOrders: undefined,
            characters: [],
            setCharacters: undefined,
            characterList: [],
            gameLog: "",
            addGameLog: () => { },
            setGameLog: () => { }
        };


    const handleCharacterChoosing = (characterIndex) => {
        setCharacterChose(characterIndex);
    }

    const handleCharacterSubmit = (event) => {
        event.preventDefault();
        onCharacterSubmit(playerIndex, characterChose);
        setCharacterChose(0)
        addGameLog(playerNames[playerIndex] + " 選擇了 " + characterList[characterChose])
    }

    return (
        <form onSubmit={handleCharacterSubmit}>
            <div>請 {playerNames[playerIndex]} 玩家選擇角色</div>
            {characterList.map((c, characterIndex) => (
                <ul key={characterIndex} hidden={characterIndex >= playerNumbers}>
                    <label>
                        <input
                            type="radio"
                            name="characterChoosing"
                            value={characterIndex}
                            checked={characterChose === characterIndex}
                            onChange={() => handleCharacterChoosing(characterIndex)}
                        />
                        {c}
                    </label >
                </ul>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
}

function GameStart({ onGameStartFinish }) {
    const { numberOfPlayers, playerNames, playerNow, setPlayerNow = () => { } } =
        useGameMetaContext() ?? {
            numberOfPlayers: 0,
            playerNames: [],
            playerNow: 0,
            setPlayerNow: undefined,
        };
    const { ANIMALS, animalOrders, setAnimalOrders = () => { }, characters, setCharacters = () => { }, characterList, setGameLog = () => { } } =
        useGameContext() ?? {
            ANIMALS: [],
            animalOrders: [],
            setAnimalOrders: undefined,
            characters: [],
            setCharacters: undefined,
            characterList: [],
            setGameLog: () => { }
        };

    const [playerIndex, setPlayerIndex] = useState(0);

    const handleCharacterSubmit = (playerIndex, characterIndex) => {
        // Update the characters array with the selected character
        setCharacters((prevCharacters) => [...prevCharacters, characterIndex]);
        setPlayerIndex(playerIndex + 1);

        function hasDuplicates(array) {
            return new Set(array).size !== array.length;
        }

        if (playerIndex >= numberOfPlayers - 1) { // playerIndex start with 0
            // TODO: Check if duplicated character exists
            if (hasDuplicates(characters)) {
                alert("有人選了重複的角色！將重新開始選擇角色");
                setGameLog([])
                setPlayerIndex(0);
                setCharacters([])
            } else {
                onGameStartFinish();
            }
        }
    }

    return (
        <div>
            <CharacterSelecting
                playerIndex={playerIndex}
                playerNames={playerNames}
                playerNumbers={numberOfPlayers}
                onCharacterSubmit={handleCharacterSubmit} />
        </div >
    );
}

export default GameStart;