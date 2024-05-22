import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSsrLocalStorage } from './util/useSsrLocalStorage';


interface GameContextProps {
    ANIMALS: string[];
    CHINESE: string[];
    animalOrders: number[],
    setAnimalOrders: React.Dispatch<number[] > ,
    animalReals: boolean[][],
    setAnimalReals: React.Dispatch<boolean[][] >,
    characters: number[],
    setCharacters: React.Dispatch<number[] >,
    characterList: string[],
    setCharacterList: React.Dispatch<string[] >,
    beingGankedTime: number[],
    setBeingGankedTime: React.Dispatch<number[] >,
    dummy: number,
    setDummy: React.Dispatch<number >,
    civHuangBlockedTurn: number,
    civMuBlockedTurn: number,
    animalBlocked: boolean[],
    setAnimalBlocked: React.Dispatch<boolean[] >,
    animalRealAltered: boolean[],
    setAnimalRealAltered: React.Dispatch<boolean[] >,
    identedPeople: number[],
    setIdentedPeople: React.Dispatch<number[] >,
    votedAnimals: boolean[],
    setVotedAnimals: React.Dispatch<boolean[] >,
    bossVoted: number[],
    setBossVoted: React.Dispatch<number[] >,
    xuVoted: number,
    setXuVoted: React.Dispatch<number >,
    funVoted: number,
    setFunVoted: React.Dispatch<number >,
    gameLog: string[],
    addGameLog: (s: string) => void,
    setGameLog: React.Dispatch<string[] >,
    isLaiEffected: boolean,
    isXuDisplayFirstDirectorFactionInfo: boolean,
    beingPoisonedTime: number[],
    setBeingPoisonedTime: React.Dispatch<number[] >,
    poisonUsedTime: number,
    setPoisonUsedTime: React.Dispatch<number >,
    beingConfusedPlayerIndex: number[],
    setBeingConfusedPlayerIndex: React.Dispatch<number[] >,
    identPeopleTimeUsed: boolean[]
    setIdentPeopleTimeUsed: React.Dispatch<boolean[]>
}

export const GameContext = createContext<GameContextProps>({} as GameContextProps);

export const GameProvider = ({ children }) => {
    const ANIMALS = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
    const CHINESE = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const [animalOrders, setAnimalOrders] = useSsrLocalStorage<number[]>('animalOrders', [])
    const initialBooleanArray = [
        [true, true, false, false],
        [false, true, true, false],
        [false, false, true, true],
    ];
    const [animalReals, setAnimalReals] = useSsrLocalStorage<boolean[][]>('animalReals', initialBooleanArray)
    const [animalRealAltered, setAnimalRealAltered] = useSsrLocalStorage<boolean[]>('animalRealAltered', [false, false, false])
    const [characters, setCharacters] = useSsrLocalStorage<number[]>('characters', [])
    const [beingGankedTime, setBeingGankedTime] = useSsrLocalStorage<number[]>('beingGankedTime', [0, 0, 0, 0, 0, 0, 0, 0])   // 被偷襲的次數
    const [beingPoisonedTime, setBeingPoisonedTime] = useSsrLocalStorage<number[]>('beingPoisonedTime', [0, 0, 0, 0, 0, 0, 0, 0])
    const [beingConfusedPlayerIndex, setBeingConfusedPlayerIndex] = useSsrLocalStorage<number[]>('beingConfusedPlayerIndex', [-1, -1, -1])
    const [poisonUsedTime, setPoisonUsedTime] = useSsrLocalStorage<number>('poisonUsedTime', 0)
    const [dummy, setDummy] = useSsrLocalStorage<number>('dummy', 0)
    const [identedPeople, setIdentedPeople] = useSsrLocalStorage<number[]>('identedPeople', [])
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    const [civHuangBlockedTurn, setCivHuangBlockedTurn] = useSsrLocalStorage<number>('civHuangBlockedTurn', getRandomInt(0, 3))
    const [civMuBlockedTurn, setCivMuBlockedTurn] = useSsrLocalStorage<number>('civMuBlockedTurn', getRandomInt(0, 3))
    const [animalBlocked, setAnimalBlocked] = useSsrLocalStorage<boolean[]>('animalBlocked', [false, false, false, false, false, false, false, false, false, false, false, false])
    const [votedAnimals, setVotedAnimals] = useSsrLocalStorage<boolean[]>('votedAnimals', [false, false, false, false, false, false, false, false, false, false, false, false])
    const [bossVoted, setBossVoted] = useSsrLocalStorage<number[]>('bossVoted', [0, 0, 0, 0, 0, 0, 0, 0])
    
    const [xuVoted, setXuVoted] = useSsrLocalStorage<number>('xuVoted', -1) 
    
    const [funVoted, setFunVoted] = useSsrLocalStorage<number>('funVoted', -1)
    
    const [gameLog, setGameLog] = useSsrLocalStorage<string[]>('gameLog', [])
    
    const [isXuDisplayFirstDirectorFactionInfo, setIsXuDisplayFirstDirectorFactionInfo] = useSsrLocalStorage<boolean>('isXuDisplayFirstDirectorFactionInfo', Math.random() < 0.5)
    
    const [isLaiEffected, setIsLaiEffected] = useSsrLocalStorage<boolean>('isLaiEffected', Math.random() < 0.5)
    function addGameLog(s: string) {
        setGameLog([...gameLog, s])
    }
    // 紀錄每回合方震是否使用過能力
    const [identPeopleTimeUsed, setIdentPeopleTimeUsed] = useSsrLocalStorage<boolean[]>('identPeopleTimeUsed', [false, false, false])
    // static character list
    const [characterList, setCharacterList] = useSsrLocalStorage<string[]>('characterList', ['許願', '方震', '黃煙煙', '木戶加奈', '老朝奉', '藥不然', '鄭國渠', '姬雲浮'])
    const contextValue: GameContextProps = {
        ANIMALS,
        animalOrders,
        setAnimalOrders,
        animalReals,
        setAnimalReals,
        characters,
        setCharacters,
        characterList,
        setCharacterList,
        beingGankedTime,
        setBeingGankedTime,
        dummy,
        setDummy,
        civHuangBlockedTurn,
        civMuBlockedTurn,
        animalBlocked,
        setAnimalBlocked,
        animalRealAltered,
        setAnimalRealAltered,
        identedPeople,
        setIdentedPeople,
        votedAnimals,
        setVotedAnimals,
        bossVoted,
        setBossVoted,
        xuVoted,
        setXuVoted,
        funVoted,
        setFunVoted,
        gameLog,
        addGameLog,
        setGameLog,
        CHINESE,
        isLaiEffected,
        isXuDisplayFirstDirectorFactionInfo,
        beingPoisonedTime,
        setBeingPoisonedTime,
        poisonUsedTime,
        setPoisonUsedTime,
        beingConfusedPlayerIndex,
        setBeingConfusedPlayerIndex,
        identPeopleTimeUsed, 
        setIdentPeopleTimeUsed
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    return useContext(GameContext);
};