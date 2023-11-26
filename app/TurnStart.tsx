import React from 'react';
import { useGameContext } from './GameContext';
import { useGameMetaContext } from './GameMetaContext';

function TurnStart({ turnNumber, onTurnStartEnd }) {
    const { ANIMALS, animalOrders, } =
        useGameContext() ?? {
            ANIMALS: [],
            animalOrders: [],
            animalReals: [],
        };

    const { playerNow, playerNames } =
        useGameMetaContext() ?? {
            playerNow: 0,
            playerNames: []
        }
    const ANIMAL_DISPLAY_IN_ONE_TURN = 4

    const renderedElements = Array.from({
        length: ANIMAL_DISPLAY_IN_ONE_TURN
    }, (_, index) => (
        <div className="word" key={index}>
            {ANIMALS[
                animalOrders[
                index + turnNumber * ANIMAL_DISPLAY_IN_ONE_TURN
                ]
            ]}
        </div>
    ));

    return (
        <div>

            <div className="parallel-words">
                {renderedElements}
            </div>
            <div>將裝置傳給 {playerNames[playerNow]} 開始回合</div>
            <div><button onClick={onTurnStartEnd}>開始回合</button></div>
        </div>
    )
}

export default TurnStart;