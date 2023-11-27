import React, { useEffect, useState } from 'react';
import { useGameContext } from './GameContext';
import { useGameMetaContext } from './GameMetaContext';

function VotePeople({ onVotePeopleEnd }) {

    const { getPlayerTextBackground, getPlayerTextStyle } =
        useGameMetaContext() ?? { getPlayerTextBackground: () => Object, getPlayerTextStyle: () => Object };



    const { numberOfPlayers, playerNames, playerNow, setPlayerNow = () => { } } =
        useGameMetaContext() ?? {
            numberOfPlayers: 0,
            playerNames: [],
            playerNow: 0,
            setPlayerNow: undefined,
        };
    const { addGameLog, ANIMALS, animalOrders, setAnimalOrders = () => { }, characters, setCharacters = () => { }, characterList,
        bossVoted,
        setBossVoted,
        xuVoted,
        setXuVoted,
        funVoted,
        setFunVoted } =
        useGameContext() ?? {
            ANIMALS: [],
            animalOrders: [],
            setAnimalOrders: undefined,
            characters: [],
            setCharacters: undefined,
            characterList: [],
            bossVoted: [],
            setBossVoted: () => { },
            xuVoted: -1,
            setXuVoted: () => { },
            funVoted: -1,
            setFunVoted: () => { },
            addGameLog: () => { },
        };

    function PeopleVoting() {

        const handleCharacterChoosing = (event) => {
            setPeopleChose(parseInt(event.target.value))
        }

        return (
            <form onSubmit={handlePeopleVotingSubmit}>
                {playerNames.map((c, characterIndex) => (
                    <ul key={characterIndex}>
                        <label style={{ fontSize: "150%", ...getPlayerTextStyle(characterIndex), ...getPlayerTextBackground(characterIndex) }}>
                            <span hidden={characterIndex === playerIndex}>
                                <input
                                    type="radio"
                                    name="characterChoosing"
                                    value={characterIndex}
                                    checked={peopleChose === characterIndex}

                                    onChange={handleCharacterChoosing}
                                />
                                {c}
                            </span>
                        </label >
                    </ul>
                ))}
                <button type="submit">確認</button>
            </form>
        );
    }

    const [playerIndex, setPlayerIndex] = useState(0);
    const [peopleChose, setPeopleChose] = useState((playerIndex + 1) % numberOfPlayers);


    const handlePeopleVotingSubmit = () => {
        //console.log("index", playerIndex)
        //console.log("peopleChose", peopleChose)


        if (characterList[characters[playerIndex]] === "老朝奉") {
            addGameLog(playerNames[playerIndex] + "將心目中的許願人選投給了" + playerNames[peopleChose])
            setXuVoted(peopleChose)
        } else if (characterList[characters[playerIndex]] === "藥不然") {
            addGameLog(playerNames[playerIndex] + "將心目中的方震人選投給了" + playerNames[peopleChose])
            setFunVoted(peopleChose)
        } else if (characterList[characters[playerIndex]] === "鄭國渠") {
            // pass
        } else {
            //console.log("Added!")
            addGameLog(playerNames[playerIndex] + "將心目中的老朝奉人選投給了" + playerNames[peopleChose])
            setBossVoted(
                (prevBossVoted) => {
                    const tempBossVoted = [...prevBossVoted]
                    tempBossVoted[peopleChose] += 1
                    return tempBossVoted
                })
        }

        setPlayerIndex(playerIndex + 1)
    }

    function PeopleVotingMsg() {

        const getCharacterName = () => {
            return characterList[characters[playerIndex]]
        }

        /*
        const msg = (name) => {
            if (name === "老朝奉") {
                return "請找出許願，讓許願陣營無法加2分"
            } else if (name === "藥不然") {
                return "請找出方震，讓許願陣營無法加1分"
            } else if (name === "鄭國渠") {
                return "你可以隨便選一個人，但不會有效果"
            } else {
                return "請投出老朝奉的人選，幫許願陣營加1分"
            }
        }
        */

        const msg = () => {
            return "請投出您心目中的人選"
        }

        return (
            <div>
                玩家
                <span style={{ fontSize: "150%", ...getPlayerTextStyle(playerIndex), ...getPlayerTextBackground(playerIndex) }}>
                    {playerNames[playerIndex]}
                </span>
                ，{msg()}
                <div style={{ fontSize: '50 %' }}>
                    <i>鄭國渠也能投票，但不會有效果</i>
                </div>
            </div>)
    }

    useEffect(() => {
        if (playerIndex >= numberOfPlayers) {
            onVotePeopleEnd()
        }
    })

    useEffect(() => {
        setPeopleChose((playerIndex + 1) % numberOfPlayers)
    }, [playerIndex]
    )

    return (<div>
        鑒人
        <PeopleVotingMsg></PeopleVotingMsg>
        <PeopleVoting ></PeopleVoting>
    </div>)
}
export default VotePeople