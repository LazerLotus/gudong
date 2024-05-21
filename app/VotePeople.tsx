import React, { useEffect, useState } from 'react';
import { useGameContext } from './GameContext';
import { useGameMetaContext } from './GameMetaContext';

function VotePeople({ onVotePeopleEnd }) {

    const { numberOfPlayers, playerNames, getPlayerTextBackground, getPlayerTextStyle } = useGameMetaContext()
    const { addGameLog,characters, characterList,
        bossVoted,
        setBossVoted,
        setXuVoted,
        setFunVoted } =
        useGameContext() 

    function PeopleVoting() {

        const handleCharacterChoosing = (event) => {
            setPeopleChose(parseInt(event.target.value))
            setIsVottingTeammate(false)
        }

        return (
            <form onSubmit={handlePeopleVotingSubmit}>
                {playerNames.map((c, characterIndex) => (
                    <ul key={characterIndex} hidden={characterIndex >= numberOfPlayers}>
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
                <button type="submit" disabled={isVottingTeammate}>確認</button>
            </form>
        );
    }

    const [playerIndex, setPlayerIndex] = useState(0);
    const [peopleChose, setPeopleChose] = useState((playerIndex + 1) % numberOfPlayers);
    const [isVottingTeammate, setIsVottingTeammate] = useState(false)
    const [triedVottingTeammate, setTriedVottingTeammate] = useState(false)


    const handlePeopleVotingSubmit = () => {
        //console.log("index", playerIndex)
        //console.log("peopleChose", peopleChose)

        alert("您已經投票！請將裝置給下一位玩家")

        if (characterList[characters[playerIndex]] === "老朝奉" && characterList[characters[peopleChose]] === "藥不然" ||
            characterList[characters[playerIndex]] === "藥不然" && characterList[characters[peopleChose]] === "老朝奉" ||
            characterList[characters[playerIndex]] === "魔藥不然" && characterList[characters[peopleChose]] === "老朝奉" ||
            characterList[characters[playerIndex]] === "老朝奉" && characterList[characters[peopleChose]] === "魔藥不然"
        ) {
            setIsVottingTeammate(true);
            setTriedVottingTeammate(true)
            return;
        }
        if (characterList[characters[playerIndex]] === "劉局" &&
            (characterList[characters[peopleChose]] === "許願" || characterList[characters[peopleChose]] === "方震")

        ) {
            setIsVottingTeammate(true);
            setTriedVottingTeammate(true)
            return;
        }



        if (characterList[characters[playerIndex]] === "老朝奉") {
            addGameLog(playerNames[playerIndex] + "將心目中的許願人選投給了" + playerNames[peopleChose])
            setXuVoted(peopleChose)
        } else if (characterList[characters[playerIndex]] === "藥不然" || characterList[characters[playerIndex]] === "魔藥不然") {
            addGameLog(playerNames[playerIndex] + "將心目中的方震人選投給了" + playerNames[peopleChose])
            setFunVoted(peopleChose)
        } else if (characterList[characters[playerIndex]] === "鄭國渠") {
            // pass
        } else {
            //console.log("Added!")
            addGameLog(playerNames[playerIndex] + "將心目中的老朝奉人選投給了" + playerNames[peopleChose])
            const tempBossVoted = [...bossVoted]
            tempBossVoted[peopleChose] += 1

            setBossVoted(tempBossVoted)
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
                <div style={{ fontSize: '25 %', color: 'gray' }}>
                    <p><i>鄭國渠也能投票，但不會有效果</i></p>
                    <p><i>無論鑒寶階段幾分，都會進入鑒人環節</i></p>
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
        <span style={{ fontSize: "150%", backgroundColor: "lightgray" }}>鑒人</span>
        <PeopleVotingMsg></PeopleVotingMsg>
        <PeopleVoting ></PeopleVoting>
        {isVottingTeammate && <h2>你不能投給{playerNames[peopleChose]}，因為他是你隊友！</h2>}
        <PeopleVotingMsg></PeopleVotingMsg>
    </div>)
}
export default VotePeople