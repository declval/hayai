export { lessonGenerate, permutations, randomNWordsContaining, shuffle };

const randomInt = (min, max) => {
    return Math.floor(min + Math.random() * (max - min));
};

const shuffle = array => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; --i) {
        const j = randomInt(0, i + 1);
        const temp = result[j];
        result[j] = result[i];
        result[i] = temp;
    }
    return result;
};

const lessonGenerate = string => {
    string = string.repeat(4);
    string = shuffle(string).join('');
    const result = [];
    let n = 0;
    for (let i = 0; i < string.length; i += n) {
        n = randomInt(1, 8);
        if (n > string.length - i) {
            n = string.length - i;
        }
        result.push(string.slice(i, i + n));
    }
    return result.join(' ');
};

const permutations = string => {
    const result = [];
    const permutationsHelper = (k, array) => {
        if (k === 1) {
            result.push(array.join(''));
        } else {
            permutationsHelper(k - 1, array);
            for (let i = 0; i < k - 1; ++i) {
                if (k % 2 === 0) {
                    const temp = array[i];
                    array[i] = array[k - 1];
                    array[k - 1] = temp;
                } else {
                    const temp = array[0];
                    array[0] = array[k - 1];
                    array[k - 1] = temp;
                }
                permutationsHelper(k - 1, array);
            }
        }
    };
    permutationsHelper(string.length, [...string]);
    return result;
};

const randomNWordsContaining = (n, words, string) => {
    const re = new RegExp(`^[${string}]+$`);
    let result = words.filter(elem => elem.match(re));
    result = shuffle(result);
    return result.slice(-n).join(' ');
};
