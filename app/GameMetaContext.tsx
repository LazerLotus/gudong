import React, { createContext, useContext, useState } from 'react';
import { useSsrLocalStorage } from './util/useSsrLocalStorage';

interface GameMetaContextProps {
    MIN_PLAYERS: number;
    MAX_PLAYERS: number;
    playerNames: string[];
    setPlayerNames: React.Dispatch<string[]>;
    numberOfPlayers: number;
    setNumberOfPlayers: React.Dispatch<number>;
    playerNow: number;
    setPlayerNow: React.Dispatch<number>;
    gameTurn: number;  
    setGameTurn: React.Dispatch<number>;
    playerPlayed: number[],
    setPlayerPlayed: React.Dispatch<number[]>,
    getPlayerTextStyle: (index: number) => object
    getPlayerTextBackground: (index: number) => object
}

export const GameMetaContext = createContext<GameMetaContextProps>({} as GameMetaContextProps); 

export const GameMetaProvider = ({ children }) => {
    const MIN_PLAYERS = 6;
    const MAX_PLAYERS = 8;
    const [playerNames, setPlayerNames] = useSsrLocalStorage<string[]>("playerNames", [(Math.random() < 0.05 ? "黑包" : "黑"), "紅", "橘", "黃", "綠", "藍", "紫", (Math.random() < 0.05 ? "白虎" : "白")]);
    const [numberOfPlayers, setNumberOfPlayers] = useSsrLocalStorage<number>("numberOfPlayers", MAX_PLAYERS);
    const [playerNow, setPlayerNow] = useSsrLocalStorage<number>("playerNow", 0);
    const [gameTurn, setGameTurn] = useSsrLocalStorage<number>("gameTurn", 0);
    const [playerPlayed, setPlayerPlayed] = useSsrLocalStorage<number[]>("playerPlayed", [])
    const getPlayerTextStyle = (abs_index: number) => {
        if (abs_index == 0) {
            return { color: "white" }
        } else if (abs_index == 1) {
            return { color: "black" }
        } else if (abs_index == 2) {
            return { color: "black" }
        } else if (abs_index == 3) {
            return { color: "black" }
        } else if (abs_index == 4) {
            return { color: "black" }
        } else if (abs_index == 5) {
            return { color: "black" }
        } else if (abs_index == 6) {
            return { color: "black" }
        } else if (abs_index == 7) {
            return { color: "black" }
        }
        return { color: "black" }
    }

    const getPlayerTextBackground = (abs_index: number) => {
        if (abs_index == 0) {
            return { backgroundColor: "black" }
        } else if (abs_index == 1) {
            return { backgroundColor: "orangered" }
        } else if (abs_index == 2) {
            return { backgroundColor: "darkorange" }
        } else if (abs_index == 3) {
            return { backgroundColor: "gold" }
        } else if (abs_index == 4) {
            return { backgroundColor: "Lime" }
        } else if (abs_index == 5) {
            return { backgroundColor: "DeepSkyBlue" }
        } else if (abs_index == 6) {
            return { backgroundColor: "violet" }
        } else if (abs_index == 7) {
            return { backgroundColor: "lightgray" }
        }
        return { color: "black" }
    }


    const contextValue: GameMetaContextProps = {
        MIN_PLAYERS,
        MAX_PLAYERS,
        playerNames,
        setPlayerNames,
        numberOfPlayers,
        setNumberOfPlayers,
        playerNow, // 這不應該算在meta context
        setPlayerNow,
        gameTurn,
        setGameTurn,
        playerPlayed,
        setPlayerPlayed,
        getPlayerTextStyle,
        getPlayerTextBackground,
    };
    console.log("gameTurn", gameTurn)
    return (
        <GameMetaContext.Provider value={contextValue}>
            {children}
        </GameMetaContext.Provider>
    );
};

export const useGameMetaContext = () => {
    return useContext(GameMetaContext);
};