export function shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function shuffleArray2DnTimes(array: boolean[][], n: number) {
    let newArray = array.map(row => [...row]); // Create a deep copy
    for (let i = 0; i < n; i++) {
        newArray = shuffleArray2D(newArray)
    }
    return newArray
}

export function shuffleArray2D(array: boolean[][]) {
    const newArray = array.map(row => [...row]); // Create a deep copy
    for (let i = newArray.length - 1; i > 0; i--) {
        for (let j = newArray[i].length - 1; j > 0; j--) {
            const m = Math.floor(Math.random() * (j + 1));
            //console.log(j, m);
            //console.log(newArray);
            [newArray[i][j], newArray[i][m]] = [newArray[i][m], newArray[i][j]];
            //console.log(newArray)
        }
        const n = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[n]] = [newArray[n], newArray[i]]
    }

    return newArray;
}

export function sortGroups(array, groupSize) {
    const result: number[] = []
    for (let i = 0; i < array.length; i += groupSize) {
        const group: number[] = array.slice(i, i + groupSize);
        group.sort((a, b) => a - b)
        result.push(...group)
    }
    return result
}

export function generateNumbersUpToN(n: number) {
    const numbers: number[] = [];
    for (let i = 0; i <= n; i++) {
        numbers.push(i);
    }
    return numbers;
}
