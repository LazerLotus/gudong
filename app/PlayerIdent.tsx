import React, { useState, memo } from 'react';
import { useGameMetaContext } from './GameMetaContext';
import { useGameContext } from './GameContext';
import IdentTreasure from './IdentTreasure';
import IdentPeople from './IdentPeople';
import FactionInfo from './FactionInfo';
import IdentTreasureBigEye from './IdentTreasureBigEye';

function PlayerIdent({ onPlayerIdentFinish, onPlayerBeingSkip }) {
    const { playerNow, playerNames } = useGameMetaContext()
    const { characters, characterList } = useGameContext()

    const [identDone, setIdentDone] = useState(false)

    const handleIdentDone = () => {
        setIdentDone(true)
    }

    // 這裡把if判斷式給刪掉，因為似乎會造成if內的東西再identDone 被更改時re-render. 判斷identTime和identTruly則在IdentTreasure裡面

    return (
        <div>
            <div>
                {
                    characterList[characters[playerNow]] != "方震" && characterList[characters[playerNow]] != "大眼賊" &&
                    <IdentTreasure onFinished={handleIdentDone} onPlayerBeingSkip={onPlayerBeingSkip} />
                }
                {
                    characterList[characters[playerNow]] === "大眼賊" &&
                    <IdentTreasureBigEye onFinished={handleIdentDone} onPlayerBeingSkip={onPlayerBeingSkip}></IdentTreasureBigEye>
                }
                {
                    characterList[characters[playerNow]] === "方震" &&
                    <IdentPeople onFinished={handleIdentDone} onPlayerBeingSkip={onPlayerBeingSkip} />
                }
            </div>
            <div>
                <div><span style={{ fontSize: "150%", backgroundColor: "white" }} >陣營資訊：</span></div>
                <FactionInfo></FactionInfo>
            </div>
            <div>
                <button disabled={identDone === false} onClick={onPlayerIdentFinish}>確認</button>
            </div>
        </div>
    )
}

export default PlayerIdent;