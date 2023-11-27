import React, { useState, useEffect } from 'react'
import { useGameContext } from './GameContext'
import { useGameMetaContext } from './GameMetaContext'

function IdentTreasureBigEye({ onFinished, onPlayerBeingSkip }) {

    const [identChineseTimeUse, setIdentChineseTimeUse] = useState([0, 0, 0])
    const [identedChinese, setIdentedChinese] = useState<number[]>([])
    const [identedChineseOrder, setIdentedChineseOrder] = useState<number[]>([])
    const [failIdentedChinese, setFailIdentedChinese] = useState<number[]>([])
    const [beingGanked, setBeingGanked] = useState<boolean>(false)

    const { playerNow, playerNames, gameTurn } =
        useGameMetaContext() ?? {
            playerNow: 0,
            playerNames: [],
            gameTurn: 0
        }

    const { ANIMALS,
        animalOrders,
        animalReals,
        setAnimalOrders = () => { },
        characters,
        setCharacters = () => { },
        characterList,
        beingGankedTime,
        setBeingGankedTime = () => { },
        dummy,
        setDummy,
        civHuangBlockedTurn,
        civMuBlockedTurn,
        animalBlocked,
        animalRealAltered,
        addGameLog = () => { },
        CHINESE,
    } = useGameContext() ?? {

        ANIMALS: [],
        animalOrders: [],
        animalReals: [],
        setAnimalOrders: undefined,
        characters: [],
        setCharacters: undefined,
        characterList: [],
        beingGankedTime: [],
        setBeingGankedTime: undefined,
        civHuangBlockedTurn: 0,
        civMuBlockedTurn: 0,
        animalBlocked: [],
        animalRealAltered: [],
        addameLog: () => { },
        CHINESE: []
    }

    function getChineseResult(chineseIndex) {
        let turn = Math.floor(chineseIndex / 4)
        let index = chineseIndex % 4
        const realResult = animalReals[turn][index]
        return (animalRealAltered[turn] ? !realResult : realResult)
    }

    function handleIdentOneChinese(index, turn) {

        let chineseIndex = index + turn * 4

        console.log(animalReals)

        setIdentChineseTimeUse(
            (prevIdentChineseTimeUse) => {
                const temparr = [...prevIdentChineseTimeUse]
                temparr[turn] += 1
                return temparr
            })

        if (beingGankedTime[playerNow] > 0) {
            setBeingGanked(true)
            setFailIdentedChinese([...failIdentedChinese, chineseIndex])
            setIdentedChineseOrder([...identedChineseOrder, chineseIndex])
            setBeingGankedTime((prevBeingGankedTime) => {
                prevBeingGankedTime[playerNow] -= 1
                return prevBeingGankedTime
            })
            addGameLog(playerNames[playerNow] + "鑒定了" + CHINESE[index + turn * 4] + "，但是被偷襲了")
        } else if (animalBlocked[animalOrders[index + turn * 4]]) {
            setFailIdentedChinese([...failIdentedChinese, chineseIndex])
            setIdentedChineseOrder([...identedChineseOrder, chineseIndex])
            addGameLog(playerNames[playerNow] + "鑒定了" + CHINESE[index + turn * 4] + "，但是其被封鎖了")
        } else {
            setIdentedChinese([...identedChinese, chineseIndex])
            setIdentedChineseOrder([...identedChineseOrder, chineseIndex])
            addGameLog(playerNames[playerNow] + "鑒定了" + CHINESE[index + turn * 4] +
                "，結果為" + (getChineseResult(chineseIndex) ? "真" : "假")
            )
        }

    }

    function IdentResult() {
        return (
            identedChineseOrder.map((item, index) => {
                if (identedChinese.includes(item)) {
                    return <SuccessIdentResult item={item} key={index}></SuccessIdentResult>
                } else if (failIdentedChinese.includes(item)) {
                    return <FailIdentResult item={item} key={index}></FailIdentResult>
                }
            }
            )
        ) // HISTORY_PUSH
    }

    function SuccessIdentResult({ item }) {
        return (
            <div>
                鑑別的結果
                {CHINESE[item]}
                是
                {getChineseResult(item) ? "真" : "假"} 的</div>
        ) // HISTORY_PUSH
    }

    function FailIdentResult({ item }) {
        return (
            < p > 無法辨別 {CHINESE[item]} 的真偽！</p >
        ) // HISTORY_PUSH
    }

    function IdentOneChinese({ index, turn }) {
        return (
            <button
                onClick={() => handleIdentOneChinese(index, turn)}
                disabled={
                    identedChinese.includes(index + turn * 4) ||
                    failIdentedChinese.includes(index + turn * 4) ||
                    identChineseTimeUse[turn] >= 1 ||
                    beingGanked}
            >
                {CHINESE[index + turn * 4]}
            </button>
        )
    }

    function IdentSpecificTurnTreasure({ turn }) {

        return (
            <div>
                <IdentOneChinese index={0} turn={turn}></IdentOneChinese>
                <IdentOneChinese index={1} turn={turn}></IdentOneChinese>
                <IdentOneChinese index={2} turn={turn}></IdentOneChinese>
                <IdentOneChinese index={3} turn={turn}></IdentOneChinese>
            </div>)
    }

    function BeingGankedResult() {
        return (beingGanked ? "你被藥不然偷襲或被方震查驗了，所以" : "")
    }

    useEffect(() => {
        //console.log(failIdentedAnimals)
        //console.log(identedAnimals)
        if (beingGanked) {
            onPlayerBeingSkip()
        }
        if (beingGanked ||
            (gameTurn === 0 && identChineseTimeUse[1] >= 1 ||
                gameTurn === 1 && identChineseTimeUse[0] >= 1 && identChineseTimeUse[2] >= 1 ||
                gameTurn === 2 && identChineseTimeUse[1] >= 1)) {
            onFinished()
        }
    }, [beingGanked, identedChinese, failIdentedChinese, onFinished]);

    return (

        <div>
            <div>
                請選擇想鑑定的獸首：
            </div>
            {gameTurn === 0 &&
                <IdentSpecificTurnTreasure turn={1}></IdentSpecificTurnTreasure>}
            {gameTurn === 1 &&
                <div>
                    <IdentSpecificTurnTreasure turn={0}></IdentSpecificTurnTreasure>
                    <IdentSpecificTurnTreasure turn={2}></IdentSpecificTurnTreasure>
                </div>}
            {gameTurn === 2 &&
                <IdentSpecificTurnTreasure turn={1}></IdentSpecificTurnTreasure>}
            <BeingGankedResult></BeingGankedResult>
            <div>
                <IdentResult></IdentResult>
            </div>
        </div>
    )
}

export default IdentTreasureBigEye;