import React, { useEffect, useState } from 'react';
import { useGameMetaContext } from './GameMetaContext';
import { useGameContext } from './GameContext';


function CharacterSelecting({ playerIndex, playerNames, playerNumbers, onCharacterSubmit }) {
    const [characterChose, setCharacterChose] = useState(0);

    const { playerNow, getPlayerTextBackground, getPlayerTextStyle } = useGameMetaContext() 

    const { ANIMALS, animalOrders, setAnimalOrders = () => { }, characters, setCharacters = () => { }, characterList, gameLog, addGameLog, setGameLog } = useGameContext()


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
            {(playerNow && <div>首家是 <span style={{ ...getPlayerTextStyle(playerNow), ...getPlayerTextBackground(playerNow) }}>{playerNames[playerNow]}</span></div>)}
            <div><h2>
                請 <span style={{ ...getPlayerTextStyle(playerIndex), ...getPlayerTextBackground(playerIndex) }}>{playerNames[playerIndex]}</span> 玩家選擇角色
            </h2></div>
            {characterList && characterList.map((c, characterIndex) => (
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
            <button type="submit">確認</button>
            <div>首家是 <span style={{ ...getPlayerTextStyle(playerNow), ...getPlayerTextBackground(playerNow) }}>{playerNames[playerNow]}</span></div>

        </form>
    );
}

function GameStart({ onGameStartFinish }) {
    const { numberOfPlayers, playerNames, playerNow, setPlayerNow = () => { } } = useGameMetaContext()
    const { ANIMALS, animalOrders, setAnimalOrders = () => { }, characters, setCharacters = () => { }, characterList, setGameLog = () => { }} = useGameContext() 

    const [playerIndex, setPlayerIndex] = useState(playerNow);

    const [lastPlayerIndex, setLastPlayerIndex] = useState((playerNow + numberOfPlayers - 1) % numberOfPlayers);

    function rightRotateArr(arr: number[], n): number[] {
        if (arr.length < n) {
            return [-1]
        }

        const tempArr = arr.splice(arr.length - n)
        return [...tempArr, ...arr]

    }

    const handleCharacterSubmit = (playerIndex, characterIndex) => {
            // Update the characters array with the selected character
            setCharacters([...(characters ?? []), characterIndex]);
            setPlayerIndex((playerIndex + 1) % numberOfPlayers);

    }

    useEffect(() => {

        function hasDuplicates(array) {
            return new Set(array).size !== array.length;
        }

        if (playerIndex === (lastPlayerIndex + 1) % numberOfPlayers && characters.length > 0) {
            // TODO: Check if duplicated character exists
            if (hasDuplicates(characters)) {
                alert("有人選了重複的角色！將重新開始選擇角色");
                setGameLog([])
                setPlayerIndex(playerNow);
                setCharacters([])
            } else {
                setCharacters(rightRotateArr(characters, playerNow))
                onGameStartFinish();
            }
        }
    })

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