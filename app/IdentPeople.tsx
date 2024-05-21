import React, { useState, useEffect } from 'react';
import { useGameMetaContext } from './GameMetaContext';
import { useGameContext } from './GameContext';
import { resourceUsage } from 'process';
import { fail } from 'assert';

function IdentPeople({ onFinished, onPlayerBeingSkip }) {
    const { playerNow, playerNames, gameTurn, numberOfPlayers } = useGameMetaContext()

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
        identedPeople,
        setIdentedPeople,
        addGameLog,
    } = useGameContext()

    const [identTimeUse, setIdentTimeUse] = useState(0)
    const [beingGanked, setBeingGanked] = useState(false)


    const handleIdentOnePeople = (peopleIndex: number) => {

        // TODO: 增加被偷襲和封鎖等
        if (beingGankedTime[playerNow] > 0) {
            const tempBeingGankedTime = [...beingGankedTime]
            tempBeingGankedTime[playerNow] -= 1 // 姑且當作這個是對的

            setBeingGanked(true)
            setBeingGankedTime(tempBeingGankedTime)
            addGameLog(playerNames[playerNow] + "試著鑒定" + playerNames[peopleIndex] + "，但是被偷襲了")
        } else if (identTimeUse < 1) {
            //console.log(beingGankedTime)
            addGameLog(playerNames[playerNow] + "鑒定了" + playerNames[peopleIndex] + "，並發現其為" +
                IdentPeopleResult(peopleIndex))
            if (characterList[characters[peopleIndex]] === "大眼賊") {
                const tempBeingGankedTime = [...beingGankedTime]
                tempBeingGankedTime[peopleIndex] += 1
                setBeingGankedTime(tempBeingGankedTime)
                addGameLog(playerNames[playerNow] + "的鑒定間接導致了" + playerNames[peopleIndex] + "被偷襲！")
            }
            setIdentedPeople([...identedPeople, peopleIndex])
            setIdentTimeUse(identTimeUse + 1)
        }
    }

    const IdentOnePeopleList = ({ buttonCount }) => {
        // Use Array.from to generate an array of n elements
        const buttons = Array.from({ length: buttonCount }, (_, index) => (
            <IdentOnePoeple key={index} index={index}></IdentOnePoeple>
        ));
        return (
            <div>
                {/* Render the list of buttons */}
                {buttons}
            </div>
        );
    }

    function IdentOnePoeple({ index }) { // 這裡要加{}!!!
        return (
            <p key={index}>
                {playerNames[index] + "："}
                <button
                    key={index}
                    onClick={() => handleIdentOnePeople(index)}
                    disabled={
                        identedPeople.includes(index) ||
                        identTimeUse >= 1 ||
                        beingGanked ||
                        index === playerNow}
                >
                    {
                        identedPeople.includes(index) || index === playerNow ?
                            IdentPeopleResult(index) : "查看陣營"
                    }
                </button>
            </p>
        )
    }

    function IdentPeopleResult(index) {
        const characterName = characterList[characters[index]]

        return (
            (characterName === "老朝奉" ||
                characterName === "藥不然" ||
                characterName === "魔藥不然" ||
                characterName === "鄭國渠") ?
                "老朝奉陣營" : "許願陣營"
        )
    }

    function BeingGankedResult() {
        return (beingGanked ? "你被藥不然偷襲了，所以無法查看玩家陣營！" : "")
    }

    useEffect(() => {
        if (beingGanked) {
            onPlayerBeingSkip()
        }
        if (beingGanked || identTimeUse >= 1) {
            onFinished()
        }
    }, [beingGanked, identTimeUse, onFinished]);

    return (
        <div>
            <div>
                <div>請選擇想鑑定的玩家</div>
                <IdentOnePeopleList buttonCount={numberOfPlayers}></IdentOnePeopleList>
            </div>
            <BeingGankedResult></BeingGankedResult>
        </div>
    )
}

export default IdentPeople;