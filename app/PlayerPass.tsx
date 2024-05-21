import React from 'react';
import { useGameMetaContext } from './GameMetaContext';

function PlayerPass({ onPlayerPassFinish }) {

    const {  playerNames, numberOfPlayers, playerPlayed, setPlayerPlayed } =useGameMetaContext()

    const handleChooseNextPlayerButtonClick = (index: number) => {
        setPlayerPlayed( [...playerPlayed, index] )

        onPlayerPassFinish(index)
    }

    function ChooseNextPlayerButtonList({ }) {

        const renderedChooseNextPlayerButttons = Array.from(
            { length: numberOfPlayers }
            , (_, index) => (
                <button
                    key={index}
                    onClick={() => { handleChooseNextPlayerButtonClick(index) }}
                    hidden={playerPlayed.includes(index)}
                >
                    {playerNames[index]}
                </button >
            ));

        return (
            <div>
                {renderedChooseNextPlayerButttons}
            </div>
        )
    }


    return (
        <div>
            {playerPlayed.length < numberOfPlayers &&
                <div>
                    <div>請選擇下一位玩家：</div>
                    <ChooseNextPlayerButtonList></ChooseNextPlayerButtonList>
                </div>
            }
            {playerPlayed.length >= numberOfPlayers &&
                <div>
                    <div>您是本回合最後一位玩家！</div>
                    <button
                        key={-1}
                        onClick={() => { handleChooseNextPlayerButtonClick(-1) }}
                    >
                        前往鑑寶
                    </button >
                </div>
            }
        </div>)
}


export default PlayerPass;