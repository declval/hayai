export function randomInt(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min));
}

export function shuffle(s: string) {
    const result = [...s];
    for (let i = result.length - 1; i > 0; --i) {
        const j = randomInt(0, i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result.join("");
}
