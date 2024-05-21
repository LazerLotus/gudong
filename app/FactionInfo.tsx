import React from 'react';
import { useGameMetaContext } from './GameMetaContext';
import { useGameContext } from './GameContext';


function FactionInfo() {
    const { playerNow, playerNames, numberOfPlayers,getPlayerTextBackground, getPlayerTextStyle } = useGameMetaContext()

    const { characters, characterList, isXuDisplayFirstDirectorFactionInfo } = useGameContext()

    const getCharacterName = (index) => { return characterList[characters[index]] }

    function findBigBrother(): number {
        for (let i = 0; i < numberOfPlayers; i++) {
            if (getCharacterName(i) === "老朝奉") {
                return i
            }
        }
        return -1
    }

    function findSecondBrother(): number {
        for (let i = 0; i < numberOfPlayers; i++) {
            if (getCharacterName(i) === "藥不然" || getCharacterName(i) === "魔藥不然") {
                return i
            }
        }
        return -1
    }
    function findXu(): number {
        for (let i = 0; i < numberOfPlayers; i++) {
            if (getCharacterName(i) === "許願") {
                return i
            }
        }
        return -1
    }
    function findFun(): number {
        for (let i = 0; i < numberOfPlayers; i++) {
            if (getCharacterName(i) === "方震") {
                return i
            }
        }
        return -1
    }
    function FactionBadInfo() {

        return (
            <div>
                <div>
                    <span style={{ fontSize: "150%", ...getPlayerTextStyle(findBigBrother()), ...getPlayerTextBackground(findBigBrother()) }}>
                        {playerNames[findBigBrother()]}: (老朝奉)
                    </span>
                </div>
                <div>
                    <span style={{ fontSize: "150%", ...getPlayerTextStyle(findSecondBrother()), ...getPlayerTextBackground(findSecondBrother()) }}>
                        {playerNames[findSecondBrother()]}: (藥不然)
                    </span>
                </div>
            </div>
        )
    }

    function FactionDirectorInfo() {

        if (isXuDisplayFirstDirectorFactionInfo) {
            return (
                <div>
                    <div>
                        <span style={{ fontSize: "150%", ...getPlayerTextStyle(findXu()), ...getPlayerTextBackground(findXu()) }}>
                            {playerNames[findXu()]}: (許願或方震)
                        </span>
                    </div>
                    <div>
                        <span style={{ fontSize: "150%", ...getPlayerTextStyle(findFun()), ...getPlayerTextBackground(findFun()) }}>
                            {playerNames[findFun()]}: (方震或許願)
                        </span>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div>
                        <span style={{ fontSize: "150%", ...getPlayerTextStyle(findFun()), ...getPlayerTextBackground(findFun()) }}>
                            {playerNames[findFun()]}: (許願或方震)
                        </span>
                    </div>
                    <div>
                        <span style={{ fontSize: "150%", ...getPlayerTextStyle(findXu()), ...getPlayerTextBackground(findXu()) }}>
                            {playerNames[findXu()]}: (方震或許願)
                        </span>
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            {(getCharacterName(playerNow) === "老朝奉" || getCharacterName(playerNow) === "藥不然" || getCharacterName(playerNow) === "魔藥不然") &&
                <FactionBadInfo></FactionBadInfo>}
            {(getCharacterName(playerNow) === "鄭國渠") &&
                "鄭國渠並不會和隊友相認。"
            }
            {(getCharacterName(playerNow) === "劉局") &&
                <FactionDirectorInfo></FactionDirectorInfo>
            }
            {(getCharacterName(playerNow) !== "老朝奉" &&
                getCharacterName(playerNow) !== "藥不然" &&
                getCharacterName(playerNow) !== "鄭國渠" &&
                getCharacterName(playerNow) !== "劉局") &&
                "不適用。"
            }
        </div>
    )
}
export default FactionInfo