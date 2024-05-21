import React, { useState, useEffect } from 'react'
import { useGameContext } from './GameContext';
import { useGameMetaContext } from './GameMetaContext';
import FileDownloadButton from './FileDonwloadButton';

function GameEnd() {
    const { numberOfPlayers, playerNames, playerNow, setPlayerNow = () => { }} = useGameMetaContext()
    const { ANIMALS, animalOrders, setAnimalOrders = () => { }, characters, setCharacters = () => { }, characterList,
        bossVoted,
        setBossVoted,
        xuVoted,
        setXuVoted,
        funVoted,
        setFunVoted,
        animalReals,
        votedAnimals,
        addGameLog,
        gameLog } = useGameContext()

    function OneAnimal({ animalText, isReal, isVoted }) {
        return (
            <p className="word-with-subscripts">
                <span>{animalText}</span>
                <sub className='under-sub'>{isReal ? "真品" : "贗品"}</sub>
                <sub>{isVoted ? "已選" : ""}</sub>
            </p>
        )
    }

    function DisplayOneAnimal({ turnNumber, index }) {
        const animalIndex = index + turnNumber * 4
        // (要加在return之後
        return (<OneAnimal
            animalText={ANIMALS[animalOrders[animalIndex]]}
            isReal={animalReals[turnNumber][index]}
            isVoted={votedAnimals[animalOrders[animalIndex]]}></OneAnimal>)
    }

    function DispalyOneTurnAnimal({ gameTurn_i }) {
        return (
            <div className='parallel-words'>
                <DisplayOneAnimal key={gameTurn_i * 4 + 0} turnNumber={gameTurn_i} index={0}></DisplayOneAnimal>
                <DisplayOneAnimal key={gameTurn_i * 4 + 1} turnNumber={gameTurn_i} index={1}></DisplayOneAnimal>
                <DisplayOneAnimal key={gameTurn_i * 4 + 2} turnNumber={gameTurn_i} index={2}></DisplayOneAnimal>
                <DisplayOneAnimal key={gameTurn_i * 4 + 3} turnNumber={gameTurn_i} index={3}></DisplayOneAnimal>
            </div>
        )
    }

    function getAnimalScore() {
        let score = 0
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                const animalIndex = j + i * 4
                let isReal = animalReals[i][j]
                let isVoted = votedAnimals[animalOrders[animalIndex]]
                score += (isReal && isVoted) ? 1 : 0
            }
        }
        return score
    }

    const getCharacterName = (index) => { return characterList[characters[index]] }

    function findCharacter(characterName): number {
        for (let i = 0; i < numberOfPlayers; i++) {
            if (getCharacterName(i) === characterName) {
                return i
            }
        }
        return -1
    }

    function isXuFound() {
        return findCharacter("許願") === xuVoted
    }

    function getXuScore() {
        return isXuFound() ? 0 : 2
    }

    function DisplayIsXuFound() {
        if (isXuFound()) {
            return "許願被找到了，許願方陣營加0分"
        } else {
            return "許願沒有被找到，許願方陣營加2分"
        }
    }

    function isFunFound() {
        return findCharacter("方震") === funVoted
    }

    function getFunScore() {
        return isFunFound() ? 0 : 1
    }

    function DisplayIsFunFound() {
        if (isFunFound()) {
            return "方震被找到了，許願方陣營加0分"
        } else {
            return "方震沒有被找到，許願方陣營加1分"
        }
    }

    function isBossFound() {
        let tempBossVoted = -1
        let voteNeeded = 3
        if (numberOfPlayers === 7) {
            voteNeeded = 2
        } else if (numberOfPlayers === 6) {
            voteNeeded = 2
        }
        for (let i = 0; i < numberOfPlayers; i++) {
            if (bossVoted[i] >= voteNeeded) {
                tempBossVoted = i;
            }
        }
        //投票規則未明瞭
        return findCharacter("老朝奉") === tempBossVoted
    }

    function getBossScore() {
        return isBossFound() ? 1 : 0
    }

    function DisplayIsBossFound() {
        if (isBossFound()) {
            return "老朝奉被找到了，許願方陣營加1分"
        } else {
            return "老朝奉沒有被找到，許願方陣營加0分"
        }
    }

    function DisplayAnimalScore() {
        return (
            "鑒寶環節共得到" + getAnimalScore() + "分"
        )
    }

    function getTotalScore() {
        return getXuScore() + getFunScore() + getBossScore() + getAnimalScore()
    }

    function WinningMsg() {
        if (getTotalScore() >= 6) {
            return "許願陣營最終得到" + getTotalScore() + "分，由許願陣營獲勝"
        } else {
            return "許願陣營最終得到" + getTotalScore() + "分，由老朝奉陣營獲勝"
        }
    }

    function addTurnAnimalsLog(turnNumber) {
        addGameLog(Array.from({ length: 4 }, (_, index) => (
            ANIMALS[animalOrders[index + turnNumber * 4]] +
            (votedAnimals[animalOrders[index + turnNumber * 4]] ? "(已選)" : "") +
            "是" +
            (animalReals[turnNumber][index] ? "真的" : "假的")
        )).join(" ")
        )
    }

    function addAllAnimalsLog() {
        for (let i = 0; i < 3; i++) {
            addGameLog("第" + (i + 1) + "回合的鑒定結果：")
            addTurnAnimalsLog(i);
        }
    }

    function addGameEndToGameLog() {
        addGameLog("投票結束！")
        addAllAnimalsLog()
        addGameLog(DisplayIsXuFound())
        addGameLog(DisplayIsFunFound())
        addGameLog(DisplayIsBossFound())
        addGameLog(WinningMsg())
    }

    const [isGameLogAdded, setIsGameLogAdded] = useState(false)

    useEffect(() => {
        if (!isGameLogAdded && animalOrders.length != 0) {
            setIsGameLogAdded(true)
            addGameEndToGameLog()
        }
    }, [isGameLogAdded])

    const [displayGameLog, setDisplayGameLog] = useState(true)

    //console.log(animalReals)
    function ShowGameLog() {
        return (
            <div>
                <div style={{ backgroundColor: "lightgray" }}>
                    {displayGameLog && (
                        <div style={{ fontSize: '200%', height: '500px', overflow: 'auto' }}>
                            {Array.from(gameLog, (log, i) => { return <div key={i}><p>{(i + 1) + ")" + log}</p><p>--</p></div> })}
                        </div>
                    )}
                </div>
            </div>
        )
    }
    return (
        <div>
            <div><h2><WinningMsg></WinningMsg></h2></div>
            <div>
                <DispalyOneTurnAnimal gameTurn_i={0}></DispalyOneTurnAnimal>
                <div><DispalyOneTurnAnimal gameTurn_i={1}></DispalyOneTurnAnimal></div>
                <div><DispalyOneTurnAnimal gameTurn_i={2}></DispalyOneTurnAnimal></div>
            </div>
            <div>　</div>
            <div>
                <div><h2>{DisplayAnimalScore()}</h2></div>
                <div><h2>{DisplayIsXuFound()}</h2></div>
                <div><h2>{DisplayIsFunFound()}</h2></div>
                <div><h2>{DisplayIsBossFound()}</h2></div>
            </div>
            <div>
                <FileDownloadButton fileContent={gameLog} fileName="古董局中局遊戲紀錄.txt" /><ShowGameLog></ShowGameLog>
            </div>
        </div>
    )
}

export default GameEnd