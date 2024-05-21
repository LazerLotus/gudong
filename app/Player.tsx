import React, { useEffect, useState } from 'react';
import { useGameMetaContext } from './GameMetaContext';
import PlayerMoving from './PlayerMoving';
import PlayerPass from './PlayerPass';
import { useSsrLocalStorage } from './util/useSsrLocalStorage';

enum PlayerPhase {
    playerConfirm = 'playerConfirm',
    playerMoving = 'playerMoving',
    playerPass = 'playerPass'

}


function Player({ onPlayerFinish }) {
    const { playerNow, playerNames, setPlayerNow, playerPlayed, setPlayerPlayed, getPlayerTextBackground, getPlayerTextStyle  } = useGameMetaContext()

    const [playerPhase, setPlayerPhase] = useSsrLocalStorage<PlayerPhase>('playerPhase',PlayerPhase.playerConfirm);

    const handlePlayerConfirmFinish = () => {
        setPlayerPhase(PlayerPhase.playerMoving)
    };
    const handlePlayerMovingFinish = () => {
        setPlayerPhase(PlayerPhase.playerPass)
    }
    const handlePlayerPassFinish = (index) => {
        if (index != -1) {
            setPlayerNow(index);
            setPlayerPhase(PlayerPhase.playerConfirm)
        } else {
            setPlayerPlayed([playerNow])
            onPlayerFinish()
        }
    }

    useEffect(() => {

    })

    return (
        <div>
            請 <span style={{ ...getPlayerTextStyle(playerNow), ...getPlayerTextBackground(playerNow) }}>{playerNames[playerNow]}
            </span>    進行回合
            {playerPhase === PlayerPhase.playerConfirm && (
                <div>
                    <div>請{" "}
                        <span style={{ ...getPlayerTextStyle(playerNow), ...getPlayerTextBackground(playerNow) }}>{playerNames[playerNow]}</span>
                        {" "}確認現在是自己的回合</div>
                    <button onClick={handlePlayerConfirmFinish}>確認</button>
                </div>
            )}
            {playerPhase === PlayerPhase.playerMoving && (
                <div>
                    <PlayerMoving onPlayerMovingEnd={handlePlayerMovingFinish} />
                </div>
            )}
            {playerPhase === PlayerPhase.playerPass && (
                <div>
                    <PlayerPass onPlayerPassFinish={handlePlayerPassFinish}></PlayerPass>
                </div>
            )}

        </div >
    )
}

export default Player;