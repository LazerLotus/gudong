import React, { useState, useEffect } from 'react';
import { useGameMetaContext } from './GameMetaContext';
import { useGameContext } from './GameContext';

function IdentTreasure({ onFinished, onPlayerBeingSkip }) {
    const { playerNow, playerNames, gameTurn } = useGameMetaContext()
    const { ANIMALS,
        animalOrders,
        animalReals,
        setAnimalOrders,
        characters,
        setCharacters,
        characterList,
        beingGankedTime,
        setBeingGankedTime,
        dummy,
        setDummy,
        civHuangBlockedTurn,
        civMuBlockedTurn,
        animalBlocked,
        animalRealAltered,
        addGameLog,
        isLaiEffected,
        beingPoisonedTime,
        setBeingPoisonedTime,
        beingConfusedPlayerIndex,
        setBeingConfusedPlayerIndex,
    } = useGameContext()
    const [identTimeUse, setIdentTimeUse] = useState(0)
    const [identedAnimals, setIdentedAnimals] = useState<number[]>([])
    const [identedAnimalsOrder, setIdentedAnimalOrder] = useState<number[]>([])
    const [failIdentedAnimals, setFailIdentedAnimals] = useState<number[]>([])
    const [beingGanked, setBeingGanked] = useState(false)
    const [isConfused, setIsConfused] = useState(false)
    const [isEgg, setIsEgg] = useState(Math.random() < 0.2)

    const getInitialIdentTime = (contextValue) => {
        if (contextValue === '許願') {
            return 2;
        } else {
            return 1;
        }
    };
    const [identTime, setIdentTime] = useState(
        getInitialIdentTime(characterList[characters[playerNow]])
    )

    const getInitialIdentTruly = (contextValue) => {
        if (contextValue === '藥來' || contextValue === '魔藥不然' ||
            contextValue === '姬雲浮' || contextValue === '老朝奉' || contextValue === '藥不然' || contextValue === '鄭國渠') {
            return true;
        } else {
            return false;
        }
    };
    const [identTruly, setIdentTruly] = useState(
        getInitialIdentTruly(characterList[characters[playerNow]])
    )


    const ANIMAL_DISPLAY_IN_ONE_TURN = 4

    const handleIdentOneAnimal = (animalIndex: number) => {


        if (beingGankedTime[playerNow] > 0) {
            setBeingGanked(true)
            setFailIdentedAnimals([...failIdentedAnimals, animalIndex])
            setIdentedAnimalOrder([...identedAnimalsOrder, animalIndex])
            const tempBeingGankedTime = [...beingGankedTime]
            tempBeingGankedTime[playerNow] -= 1 // 姑且當作這個是對的
            setBeingGankedTime(tempBeingGankedTime)
            addGameLog(playerNames[playerNow] + "鑒定了" + ANIMALS[animalOrders[animalIndex + gameTurn * 4]] + "，但是被偷襲了")

        } else if (characterList[characters[playerNow]] === "黃煙煙" && civHuangBlockedTurn === gameTurn ||
            characterList[characters[playerNow]] === "木戶加奈" && civMuBlockedTurn === gameTurn
        ) {
            setFailIdentedAnimals([...failIdentedAnimals, animalIndex])
            setIdentedAnimalOrder([...identedAnimalsOrder, animalIndex])
            setIdentTimeUse(identTimeUse + 1)
            addGameLog(playerNames[playerNow] + "鑒定了" + ANIMALS[animalOrders[animalIndex + gameTurn * 4]] + "，但是被系統封了")
        } else if (characterList[characters[playerNow]] === "劉局" && gameTurn > 0) {
            setFailIdentedAnimals([...failIdentedAnimals, animalIndex])
            setIdentedAnimalOrder([...identedAnimalsOrder, animalIndex])
            setIdentTimeUse(identTimeUse + 1)
            addGameLog(playerNames[playerNow] + "鑒定了" + ANIMALS[animalOrders[animalIndex + gameTurn * 4]] + "，但是被系統封了")
        }

        else if (animalBlocked[animalOrders[animalIndex + gameTurn * ANIMAL_DISPLAY_IN_ONE_TURN]]) {

            setFailIdentedAnimals([...failIdentedAnimals, animalIndex])
            setIdentedAnimalOrder([...identedAnimalsOrder, animalIndex])
            setIdentTimeUse(identTimeUse + 1)
            addGameLog(playerNames[playerNow] + "鑒定了" + ANIMALS[animalOrders[animalIndex + gameTurn * 4]] + "，但是其被封鎖了")
        } else {
            setIdentedAnimals([...identedAnimals, animalIndex])
            setIdentedAnimalOrder([...identedAnimalsOrder, animalIndex])
            setIdentTimeUse(identTimeUse + 1)

            addGameLog(playerNames[playerNow] + "鑒定了" + ANIMALS[animalOrders[animalIndex + gameTurn * 4]] +
                "，結果為" + (getAnimalResult(animalIndex) ? "真" : "假"))
            if (characterList[characters[playerNow]] === "藥來") {
                if (isLaiEffected) {
                    addGameLog("但是這個結果是錯的。")
                } else {
                    addGameLog("這個結果必定是對的。")
                }
            }
        }
    }

    function IdentOneAnimal({ index }) { // 這裡要加{}!!!
        return (
            <button
                onClick={() => handleIdentOneAnimal(index)}
                disabled={
                    identedAnimals.includes(index) ||
                    failIdentedAnimals.includes(index) ||
                    identTimeUse >= identTime ||
                    beingGanked}
            >   
                {ANIMALS[animalOrders[index + gameTurn * ANIMAL_DISPLAY_IN_ONE_TURN]]}
            </button>
        )
    }

    function BeingGankedResult() {
        return (beingGanked ? ((isEgg ? "哈哈！" : "") + "你被藥不然偷襲了，所以") : "")
    }

    function getAnimalResult(index) {
        const realResult = animalReals[gameTurn][index]
        if (characterList[characters[playerNow]] === '藥來') {
            return isLaiEffected ? !realResult : realResult
        }

        let resultBeforePoison = animalRealAltered[gameTurn] && !identTruly ? !realResult : realResult

        return beingConfusedPlayerIndex[gameTurn] === playerNow ? !resultBeforePoison : resultBeforePoison

    }

    function IdentResult() {
        return (
            identedAnimalsOrder.map((item, index) => {
                if (identedAnimals.includes(item)) {
                    return <SuccessIdentResult item={item} key={index}></SuccessIdentResult>
                } else if (failIdentedAnimals.includes(item)) {
                    return <FailIdentResult item={item} key={index}></FailIdentResult>
                }
            }
            )
        ) // HISTORY_PUSH
    }

    function SuccessIdentResult({ item }) {
        return (
            <div>
                <span className="ident-result">
                    鑑別的結果{" "}
                    {ANIMALS[animalOrders[item + gameTurn * ANIMAL_DISPLAY_IN_ONE_TURN]]}
                    {" "}是
                    {getAnimalResult(item) ? "真" : "假"}的
                </span>
            </div>
        ) // HISTORY_PUSH
    }
    function FailIdentResult({ item }) {
        return (

            <div>
                <span className='ident-result'>
                    無法辨別 {ANIMALS[animalOrders[item + gameTurn * ANIMAL_DISPLAY_IN_ONE_TURN]]} 的真偽！
                </span>
            </div>
        ) // HISTORY_PUSH
    }

    useEffect(() => {
        if (beingPoisonedTime[playerNow] > 0) {

            const tempBeingConfusedPlayerIndex = [...beingConfusedPlayerIndex]
            tempBeingConfusedPlayerIndex[gameTurn] = playerNow
            setBeingConfusedPlayerIndex(tempBeingConfusedPlayerIndex)
            const tempBeingPoisonedTime = [...beingPoisonedTime]
            tempBeingPoisonedTime[playerNow] -= 1
            setBeingPoisonedTime(tempBeingPoisonedTime)
            addGameLog(playerNames[playerNow] + "中了混亂之毒！")
        }

        if (beingGanked) {
            onPlayerBeingSkip()
        }
        if (beingGanked || identTimeUse >= identTime) {
            onFinished()
        }
    }, [beingGanked, identedAnimals, failIdentedAnimals, onFinished]);

    return (
        <div>
            <div>
                <div>請選擇想鑑定的獸首</div>
                <div className="button-container">
                    <IdentOneAnimal index={0}></IdentOneAnimal>
                    <IdentOneAnimal index={1}></IdentOneAnimal>
                    <IdentOneAnimal index={2}></IdentOneAnimal>
                    <IdentOneAnimal index={3}></IdentOneAnimal>
                </div>
            </div>
            <h3><span style={{ fontSize: "200%" }}><BeingGankedResult></BeingGankedResult></span></h3>
            <div>
                <IdentResult></IdentResult>
            </div>
        </div>
    )
}

export default IdentTreasure;