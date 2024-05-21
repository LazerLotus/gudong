import React, { useEffect, useState } from 'react';
import { useGameContext } from './GameContext';
import { useGameMetaContext } from './GameMetaContext';

function TurnVoting({ onTurnVotingEnd }) {
    const { gameTurn } = useGameMetaContext()
    const { ANIMALS,
        animalOrders,
        animalReals,
        votedAnimals,
        setVotedAnimals,
        addGameLog
    } = useGameContext() 

    const [voteNumber, setVoteNumber] = useState([0, 0, 0, 0])
    const [largestVoteIndex, setLargestVoteIndex] = useState(-1)
    const [secondLargestVoteIndex, setSecondLargestVoteIndex] = useState(-1)
    const [voteFinished, setVoteFinished] = useState(false)

    const handleInputChange = (event, index) => {
        // Ensure only numeric values are allowed (you can customize this validation)
        let inputValue = event.target.value.replace(/[^0-9]/g, '');
        if (inputValue === '') {
            inputValue = 0
        }
        const newInputValue = [...voteNumber]
        newInputValue[index] = parseInt(inputValue)
        setVoteNumber(newInputValue);
    };

    useEffect(() => {
        //console.log(votedAnimals)
        //console.log(animalReals)
    })

    function DisplayAnimalReal({ isDisplayed, isHidden, isReal }) {
        if (!isDisplayed) {
            return <div></div>
        }
        if (isHidden) {
            return <div><h3>隱藏</h3></div>
        }
        if (isReal) {
            return <div><h3>真品</h3></div>
        }
        return <div><h3>贗品</h3></div>
    }

    function VoteOneAnimal({ index }) { // 這裡要加{ }!!!
        return (
            <div>
                <div>
                    <h2>
                        {ANIMALS[animalOrders[index + gameTurn * 4]]}
                    </h2>
                </div>

                <DisplayAnimalReal isDisplayed={voteFinished && (largestVoteIndex === index || secondLargestVoteIndex === index)} isHidden={largestVoteIndex === index}
                    isReal={animalReals[gameTurn][index]}></DisplayAnimalReal>

                <div>
                    <input placeholder="請投票"
                        disabled={voteFinished}
                        type="number" min="0" step="1" value={voteNumber[index]} onChange={(event) => handleInputChange(event, index)}></input>
                </div>
            </div>
        )
    }

    const handleSubmit = () => {
        const isConfirmed = window.confirm(
            "確定要進行投票嗎？" + "\n" +
            ANIMALS[animalOrders[0 + gameTurn * 4]] + ":" + voteNumber[0] + "\n" +
            ANIMALS[animalOrders[1 + gameTurn * 4]] + ":" + voteNumber[1] + "\n" +
            ANIMALS[animalOrders[2 + gameTurn * 4]] + ":" + voteNumber[2] + "\n" +
            ANIMALS[animalOrders[3 + gameTurn * 4]] + ":" + voteNumber[3]
        )

        // Check the user's response
        if (isConfirmed) {

            const tempVoteNumber = [...voteNumber]

            // find largest
            let largestVoting = tempVoteNumber[0]
            let largestIndex = 0

            for (let i = 1; i < 4; i++) {
                if (tempVoteNumber[i] > tempVoteNumber[largestIndex]) {
                    largestVoting = tempVoteNumber[i]
                    largestIndex = i
                }
            }
            tempVoteNumber[largestIndex] = -1

            let secondLargestVoting = tempVoteNumber[0]
            let secondLargestIndex = 0

            for (let i = 1; i < 4; i++) {
                if (tempVoteNumber[i] > tempVoteNumber[secondLargestIndex]) {
                    secondLargestVoting = tempVoteNumber[i]
                    secondLargestIndex = i
                }
            }
            setLargestVoteIndex(largestIndex)
            setSecondLargestVoteIndex(secondLargestIndex)
            let prevVotedAnimals = [...votedAnimals]
            prevVotedAnimals[animalOrders[largestIndex + gameTurn * 4]] = true
            prevVotedAnimals[animalOrders[secondLargestIndex + gameTurn * 4]] = true
            setVotedAnimals(prevVotedAnimals)

            addGameLog("第" + (gameTurn + 1) + "回合投票")
            for (let i = 0; i < 4; i++) {
                addGameLog(ANIMALS[animalOrders[i + gameTurn * 4]] + "獲得了" + voteNumber[i] + "票")
            }
            addGameLog(ANIMALS[animalOrders[secondLargestIndex + gameTurn * 4]] + "是" + (animalReals[gameTurn][secondLargestIndex] ? "真" : "假") + "的！")
            setVoteFinished(true)
        }
    }

    return (
        <div>
            <div>請進行投票鑒寶：</div>
            <VoteOneAnimal index={0}></VoteOneAnimal>
            <VoteOneAnimal index={1}></VoteOneAnimal>
            <VoteOneAnimal index={2}></VoteOneAnimal>
            <VoteOneAnimal index={3}></VoteOneAnimal>
            <button onClick={handleSubmit} disabled={voteFinished}>確認投票</button>
            <button onClick={onTurnVotingEnd} disabled={!voteFinished}>結束本回合</button>
        </div>)
}

export default TurnVoting