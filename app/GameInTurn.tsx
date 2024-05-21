import React from 'react';
import TurnStart from './TurnStart';
import Player from './Player';
import { useGameMetaContext } from './GameMetaContext';
import TurnVoting from './TurnVoting';
import { useSsrLocalStorage } from './util/useSsrLocalStorage';

enum GameInTurnPhase {
    turnStart = 'turnStart',
    turnGoing = 'turnGoing',
    turnVoting = 'turnVoting'

}


function GameInTurn({ onGameInTurnFinish }) {
    const [gameInTurnPhase, setGameInTurnPhase] = useSsrLocalStorage<GameInTurnPhase>('gameInTurnPhase', GameInTurnPhase.turnStart);

    const { gameTurn, setGameTurn } = useGameMetaContext()

    const handleTurnStartFinish = () => {
        setGameInTurnPhase(GameInTurnPhase.turnGoing)
    };

    const handlePlayerFinish = () => {
        setGameInTurnPhase(GameInTurnPhase.turnVoting)
    };

    const handleTurnVotingFinish = () => {
        if (gameTurn != 2) {
            setGameInTurnPhase(GameInTurnPhase.turnStart)
            const prevGameTurn = gameTurn ?? 0
            setGameTurn(prevGameTurn + 1)
        } else {
            onGameInTurnFinish()
        }
    };

    const turnInChinese = ['一', '二', '三']

    return (
        <div>
            <div><span style={{ fontSize: "150%", backgroundColor: "lightgray" }} >第{turnInChinese[gameTurn]}回合</span></div>
            {gameInTurnPhase === 'turnStart' && (
                <TurnStart
                    turnNumber={gameTurn}
                    onTurnStartEnd={handleTurnStartFinish} />
            )}
            {gameInTurnPhase === 'turnGoing' && (
                <div>

                    <Player onPlayerFinish={handlePlayerFinish} />
                </div>
            )}
            {
                gameInTurnPhase === 'turnVoting' && (
                    <div>
                        <TurnVoting onTurnVotingEnd={handleTurnVotingFinish}></TurnVoting>
                    </div>
                )
            }
        </div >
    )
}

export default GameInTurn;