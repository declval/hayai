export { lessonGenerate, permutations };

const randomInt = (min, max) => {
    return Math.floor(min + Math.random() * (max - min));
};

const shuffle = chars => {
    const result = [...chars];
    for (let i = result.length - 1; i > 0; --i) {
        const j = randomInt(0, i + 1);
        const temp = result[j];
        result[j] = result[i];
        result[i] = temp;
    }
    return result.join('');
};

const lessonGenerate = chars => {
    chars = chars.repeat(16);
    chars = shuffle(chars);
    const result = [];
    let n = 0;
    for (let i = 0; i < chars.length; i += n) {
        n = randomInt(1, 8);
        if (n > chars.length - i) {
            n = chars.length - i;
        }
        result.push(chars.slice(i, i + n));
    }
    return result.join(' ');
};

const permutations = chars => {
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
    permutationsHelper(chars.length, [...chars]);
    return result;
};
