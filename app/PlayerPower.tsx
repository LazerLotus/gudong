import React, { useCallback, useEffect, useState } from 'react';
import { useGameMetaContext } from './GameMetaContext';
import { useGameContext } from './GameContext';


function PlayerPower({ onPlayerPowerFinish }) {


    const [clickedGankingButton, setClickedGankingButton] = useState(-1);
    const [clickedPoisoningButton, setClickedPoisoningButton] = useState(-1);
    const [clikcedBlockingButton, setClickedBlockingButton] = useState(-1);
    const [plyaerPowerConfirm, setPlayerPowerConfirm] = useState(false)
    const [alterSwitch, setAlterSwitch] = useState(false);
    const [preAlterSwitch, setPrevAlterSwitch] = useState(false);
    const [isEasterEggDisplayed, _] = useState(Math.random() < 0.1)

    const { playerNow, playerNames, numberOfPlayers, gameTurn, playerPlayed } =useGameMetaContext()

    const { beingPoisonedTime, setBeingPoisonedTime, poisonUsedTime, setPoisonUsedTime, addGameLog, characters, characterList, beingGankedTime, setBeingGankedTime, setAnimalOrders, ANIMALS, animalBlocked, setAnimalBlocked, animalOrders, animalRealAltered, setAnimalRealAltered } =
        useGameContext()

    const getCharacterName = useCallback((index) => { return characterList[characters[index]] }, [characterList, characters])    

    function findXu(): number {
        for (let i = 0; i < numberOfPlayers; i++) {
            if (getCharacterName(i) === "許願") {
                return i
            }
        }
        return -1
    }

    function findBigBrother(): number {
        for (let i = 0; i < numberOfPlayers; i++) {
            if (getCharacterName(i) === "老朝奉") {
                return i
            }
        }
        return -1
    }

    const handlePlayerGanked = (index) => {

        let numberOfBeingGanked = 1
        if (characterList[characters[index]] === "姬雲浮") {
            numberOfBeingGanked = 99
        }
        
        const tempBeingGankedTime: number[] = [...beingGankedTime]
        tempBeingGankedTime[index] += numberOfBeingGanked
        setBeingGankedTime(tempBeingGankedTime)

        if (characterList[characters[index]] != "方震") {
            return
        }
        
        const tempXuBeingGankedTime: number[] = [...beingGankedTime]
        tempXuBeingGankedTime[findXu()] += numberOfBeingGanked
        setBeingGankedTime(tempXuBeingGankedTime)

    }

    const handlePlayerPoisoned = (index) => {

        if (characterList[characters[index]] === "姬雲浮") {
            const tempBeingGankedTime: number[] = [...beingGankedTime]
            tempBeingGankedTime[index] += 99
            setBeingGankedTime(tempBeingGankedTime)
            return
        }
       
        const tempBeingPoisonedTime: number[] = [...beingPoisonedTime]
        tempBeingPoisonedTime[index] += 1
        setBeingPoisonedTime(tempBeingPoisonedTime)

        if (characterList[characters[index]] != "方震") {
            return
        }
        
        const tempXuBeingPoisonedTime: number[] = [...beingPoisonedTime]
        tempXuBeingPoisonedTime[findXu()] += 1
        setBeingPoisonedTime(tempXuBeingPoisonedTime)

    }

    function GankedButtonList({ onPlayerGanked }) {
        //const [clickedButton, setClickedButton] = useState(-1); // 這個不能放裡面!!否則會導致它一直是在1, 我猜是重新render時，GankedButtonList也會重新Render所導致的

        //console.log(numberOfPlayers)
        const handleGankingButtonClick = (value) => {
            if (value === findBigBrother()) {
                const isConfirmed = window.confirm(
                    "你確定要偷襲" + playerNames[value] + "嗎？他是你隊友！"
                )
                if (!isConfirmed) return;
            }

            setClickedGankingButton(value)
            onPlayerGanked(value)

            addGameLog(playerNames[playerNow] + "偷襲了" + playerNames[value] + "！")
            handlePowerDone()
        }

        const renderedGankingButttons = (isBefore) => {

            return Array.from(
                playerNames.slice(0, numberOfPlayers)
                , (name, index) => (
                    <button
                        key={index}
                        onClick={() => handleGankingButtonClick(index)}
                        disabled={
                            (clickedGankingButton !== -1) ||
                            index === playerNow
                        }
                        hidden={isBefore ? !playerPlayed.includes(index) : playerPlayed.includes(index)}
                    >
                        {clickedGankingButton === -1 || clickedGankingButton != index ? name : ("已經偷襲 " + name)}
                    </button>
                ));
        }

        return (
            <div>
                <hr></hr>
                <div>
                    {renderedGankingButttons(true)}
                    <span>
                        <i>（前面玩家）</i>
                    </span>
                </div>
                <hr></hr>
                <div>
                    {renderedGankingButttons(false)}
                    <span>
                        <i>（後面玩家）</i>
                    </span>
                </div>
                <hr></hr>
            </div>
        )
    }

    function PoisonButtonList({ onPlayerPoisoned }) {

        const handlePoisoningButtonClick = (value) => {
            if (value === findBigBrother()) {
                const isConfirmed = window.confirm(
                    "你確定要對" + playerNames[value] + "下藥嗎？他是你隊友！"
                )
                if (!isConfirmed) return;
            }

            setClickedPoisoningButton(value)
            onPlayerPoisoned(value)
            setPoisonUsedTime(poisonUsedTime + 1)
            addGameLog(playerNames[playerNow] + "對" + playerNames[value] + "下藥！")
            handlePowerDone()
        }

        const renderedPoisoningButttons = (isBefore) => {
            return Array.from(
                playerNames.slice(0, numberOfPlayers)
                , (name, index) => (
                    <button
                        key={index}
                        onClick={() => handlePoisoningButtonClick(index)}
                        disabled={
                            (clickedPoisoningButton !== -1) ||
                            index === playerNow ||
                            poisonUsedTime >= 2
                        }
                        hidden={isBefore ? !playerPlayed.includes(index) : playerPlayed.includes(index)}
                    >
                        {clickedPoisoningButton === -1 || clickedPoisoningButton != index ? name : ("已經對 " + name + " 下藥")}
                    </button>
                ))
        }
        return (
            <div>
                <hr></hr>
                <div>
                    {renderedPoisoningButttons(true)}
                    <span>
                        <i>（前面玩家）</i>
                    </span>
                </div>
                <hr></hr>
                <div>
                    {renderedPoisoningButttons(false)}
                    <span>
                        <i>（後面玩家）</i>
                    </span>
                </div>
                <hr></hr>
                {poisonUsedTime >= 2 &&
                    <div>
                        您的毒藥已用盡！
                    </div>}
            </div>
        )
    }

    const handleClickcedGankingPassButton = (index) => {
        setClickedGankingButton(index)

        addGameLog(playerNames[playerNow] + "並沒有使用偷襲的能力。")
        handlePowerDone()
    }

    const handleClickcedPoisoningPassButton = (index) => {
        setClickedPoisoningButton(index)

        addGameLog(playerNames[playerNow] + "並沒有使用下藥的能力。")
        handlePowerDone()
    }

    const PowerGank = () => {
        return (
            <div>
                <div>
                    請選擇要偷襲的對象{isEasterEggDisplayed ? "，雙生毒牙！" : "："}
                    <GankedButtonList onPlayerGanked={handlePlayerGanked}></GankedButtonList>
                    <button
                        key={99}
                        onClick={() => handleClickcedGankingPassButton(99)}
                        disabled={(clickedGankingButton !== -1)}>
                        {clickedGankingButton === -1 || clickedGankingButton != 99 ||
                            poisonUsedTime >= 2 ? '跳過，不進行偷襲' : ("您已經選擇跳過")}
                    </button>
                </div>
            </div>
        )
    }

    const PowerPoison = () => {

        return (
            <div>
                <div>
                    請選擇要投毒的對象：
                    <PoisonButtonList onPlayerPoisoned={handlePlayerPoisoned}></PoisonButtonList>
                    <button
                        key={99}
                        onClick={() => handleClickcedPoisoningPassButton(99)}
                        disabled={(clickedPoisoningButton !== -1)}>
                        {clickedPoisoningButton === -1 || clickedPoisoningButton != 99 || poisonUsedTime >= 2 ? '跳過，不進行下藥' : ("您已經選擇跳過")}
                    </button>
                </div>
            </div>
        )
    }

    const handleAnimalBlocked = (index) => {

        let prevAnimalBlocked = [...animalBlocked]
        prevAnimalBlocked[animalOrders[index + gameTurn * 4]] = true
        setAnimalBlocked(prevAnimalBlocked)

        addGameLog(playerNames[playerNow] + "封鎖了" + ANIMALS[animalOrders[index + gameTurn * 4]] + "！")
    }

    function BlockButtonList({ }) {

        const handleBlockingButtonClick = (value) => {
            setClickedBlockingButton(value)
            handleAnimalBlocked(value)
            handlePowerDone()
        }

        const renderedBlockingButttons = Array.from(
            { length: 4 }
            , (_, index) => (
                <button
                    key={index}
                    onClick={() => handleBlockingButtonClick(index)}
                    disabled={
                        (clikcedBlockingButton !== -1)
                    }>
                    {clikcedBlockingButton === -1 || clikcedBlockingButton != index ?
                        ANIMALS[animalOrders[index + gameTurn * 4]] : ("已經封鎖 " + ANIMALS[animalOrders[index + gameTurn * 4]])}
                </button>
            ));
        return (
            <div>
                {renderedBlockingButttons}
            </div>
        )
    }

    const handleClickcedBlockingPassButton = (index) => {
        setClickedBlockingButton(index)
        addGameLog(playerNames[playerNow] + "並沒有使用封鎖的能力。")

        handlePowerDone()
    }

    const PowerBlock = () => {
        return (
            <div>
                <div>
                    請選擇要封鎖的獸首：
                    <BlockButtonList></BlockButtonList>
                    <button
                        key={99}
                        onClick={() => handleClickcedBlockingPassButton(99)}
                        disabled={(clikcedBlockingButton !== -1)}>
                        {clikcedBlockingButton === -1 || clikcedBlockingButton != 99 ? '跳過，不進行封鎖' : ("您已經選擇跳過")}
                    </button>
                </div>
            </div>
        )
    }


    const handlePowerAlterChange = () => {
        setAlterSwitch(!alterSwitch);
    }

    const PowerAlter = () => {
        return (
            <div>
                老朝奉，是否改變除了姬雲浮和藥來以外的許願陣營玩家之後的鑑定結果？
                <label className="toggle-switch">
                    <input type="checkbox" onChange={handlePowerAlterChange} checked={alterSwitch}></input>
                    <div className="switch-track">
                        <div className="switch-thumb"></div>
                    </div>

                </label>
            </div>
        )
    }

    const PowerNothing = () => {
        return (
            <div>
                您沒有其他特殊能力。
            </div>
        )
    }
    const handlePowerDone = () => {
        setPlayerPowerConfirm(true)
    }

    useEffect(() => {

        if (getCharacterName(playerNow) === "魔藥不然" && poisonUsedTime) {
            handlePowerDone();
        }
        if (getCharacterName(playerNow) != "魔藥不然" && getCharacterName(playerNow) != "藥不然" && getCharacterName(playerNow) != "鄭國渠") {
            handlePowerDone();
        }
        if (getCharacterName(playerNow) === "老朝奉") {
            let prevAnimalRealAltered = [...animalRealAltered]
            prevAnimalRealAltered[gameTurn] = alterSwitch
            setAnimalRealAltered(prevAnimalRealAltered)
        }

    }, [])

    const handlePlayerPowerFinish = () => {
        if (preAlterSwitch === false && alterSwitch === true && characterList[characters[playerNow]] === "老朝奉") {
            addGameLog(playerNames[playerNow] + "發動了老朝奉的能力！")
            setPrevAlterSwitch(true)
        } else if (characterList[characters[playerNow]] === "老朝奉") {
            addGameLog(playerNames[playerNow] + "並沒有發動老朝奉的能力。")
        }
        onPlayerPowerFinish()

    }

    return (
        <div>
            <div>
                {getCharacterName(playerNow) === "藥不然" && <PowerGank></PowerGank>}
                {getCharacterName(playerNow) === "魔藥不然" && <PowerPoison></PowerPoison>}
                {getCharacterName(playerNow) === "鄭國渠" && <PowerBlock></PowerBlock>}
                {getCharacterName(playerNow) === "老朝奉" && <PowerAlter></PowerAlter>}
                {getCharacterName(playerNow) !== "老朝奉" &&
                    getCharacterName(playerNow) !== "鄭國渠" &&
                    getCharacterName(playerNow) !== "藥不然" &&
                    getCharacterName(playerNow) !== "魔藥不然" &&
                    <PowerNothing></PowerNothing>}
            </div>
            <div>
                <button disabled={!plyaerPowerConfirm} onClick={handlePlayerPowerFinish}>確認</button>
            </div>
        </div>

    )
}

export default PlayerPower;
