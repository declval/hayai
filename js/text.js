export { Text };

class Text {
    constructor(text = Text.initialText, chunkSize = Text.initialChunkSize) {
        this.accuracy = null;
        this.speed = null;

        this.reset(text, chunkSize);

        this.accuracyElement = document.getElementById('accuracy');
        this.speedElement = document.getElementById('speed');
        this.textElement = document.getElementById('text');
    }

    clear = () => {
        while (this.textElement.firstChild) {
            this.textElement.firstChild.remove();
        }
    }

    cursorMove = key => {
        if (!this.firstKeyPressed) {
            this.firstKeyPressed = true;

            this.startTime = Date.now();
            this.nCorrect = 0;
        }

        for (const character of this.characters) {
            if (character.classList.contains('text-character-cursor')) {
                if (character.textContent === key) {
                    character.classList.add('text-character-correct');

                    this.nCorrect++;
                } else {
                    character.classList.add('text-character-incorrect');
                }

                character.classList.remove('text-character-cursor');

                try {
                    character.nextSibling.classList.add('text-character-cursor');
                    this.highlightKeysToPress(character.nextSibling);
                } catch (e) {
                    const timeDifference = (Date.now() - this.startTime) / 1000 / 60;

                    this.speed = Math.floor(this.chunk.length / 5 / timeDifference);
                    this.accuracy = Math.floor(this.nCorrect / this.chunk.length * 100);

                    this.chunk = this.chunks.next().value;

                    if (this.chunk) {
                        this.render();
                    } else {
                        this.chunks = this.chunked();
                        this.chunk = this.chunks.next().value;

                        this.textElement.classList.add('text-rotate');

                        setTimeout(() => {
                            this.textElement.classList.remove('text-rotate');
                        }, 800);

                        return true;
                    }
                }

                break;
            }
        }

        return false;
    }

    highlightKeysToPress = cursor => {
        // Unhighlight previously highlighted keys if any
        const highlightedKeys = document.getElementsByClassName('keyboard-key-highlight');
        while (highlightedKeys.length) {
            highlightedKeys[0].classList.remove('keyboard-key-highlight');
        }

        const highlightedKeyTexts = document.getElementsByClassName('keyboard-key-text-highlight');
        while (highlightedKeyTexts.length) {
            highlightedKeyTexts[0].classList.remove('keyboard-key-text-highlight');
        }

        const lessonCurrent = document.getElementsByClassName('lesson-current')[0];

        if (lessonCurrent.dataset.index === '-1') {
            return;
        }

        const keys = document.getElementsByClassName('keyboard-key');

        for (const key of keys) {
            if (key.dataset.value === cursor.textContent ||
                    key.dataset.valueAlt === cursor.textContent) {
                key.classList.add('keyboard-key-highlight');

                if (key.dataset.value === cursor.textContent) {
                    key.classList.add('keyboard-key-text-highlight');
                } else {
                    key.getElementsByClassName('keyboard-key-alt')[0]
                        .classList.add('keyboard-key-text-highlight');

                    const shifts = document.getElementsByClassName('keyboard-key-shift');
                    let shiftIndex = null;

                    if (key.classList.contains('keyboard-key-lpinkie') ||
                            key.classList.contains('keyboard-key-lring') ||
                            key.classList.contains('keyboard-key-lmiddle') ||
                            key.classList.contains('keyboard-key-lindex')) {
                        shiftIndex = 1;
                    } else {
                        shiftIndex = 0;
                    }

                    shifts[shiftIndex].classList.add('keyboard-key-highlight');
                    shifts[shiftIndex].classList.add('keyboard-key-text-highlight');
                }
            }
        }
    }

    render = () => {
        this.clear();

        this.firstKeyPressed = false;

        if (Number.isFinite(this.speed)) {
            this.speedElement.textContent = `${this.speed} WPM`;
        } else {
            this.speedElement.textContent = 'N/A';
        }

        if (Number.isFinite(this.accuracy)) {
            this.accuracyElement.textContent = `${this.accuracy}%`;
        } else {
            this.accuracyElement.textContent = 'N/A';
        }

        for (const character of this.chunk) {
            const div = document.createElement('div');

            div.classList.add('text-character');

            if (character === ' ') {
                div.classList.add('text-character-space');
            }

            div.appendChild(document.createTextNode(character));

            this.textElement.appendChild(div);
        }

        this.textElement.firstChild.classList.add('text-character-cursor');
        this.highlightKeysToPress(this.textElement.firstChild);

        this.characters = this.textElement.getElementsByClassName('text-character');
    }

    reset = (text, chunkSize) => {
        if (text === undefined && chunkSize === undefined) {
            text = Text.initialText;
            chunkSize = Text.initialChunkSize;
        }

        this.text = text.replace(/[^ -~]+/g, '');
        this.chunkSize = chunkSize;

        if (this.text.length === 0) {
            throw new Error('Invalid text length');
        }

        if (this.chunkSize < Text.chunkSizeMin ||
            this.chunkSize > Text.chunkSizeMax ||
            this.chunkSize > this.text.length) {
            throw new Error(`Invalid chunk size: ${this.chunkSize}`);
        }

        this.chunks = this.chunked();
        this.chunk = this.chunks.next().value;
        this.firstKeyPressed = false;
        this.nCorrect = 0;
        this.startTime = null;
    }

    *chunked() {
        let start = 0;
        let end = this.chunkSize;

        while (end <= this.text.length) {
            yield this.text.substring(start, end);
            start += this.chunkSize;
            end += this.chunkSize;
        }

        if (start < this.text.length) {
            yield this.text.substring(start, this.text.length);
        }
    }

    static chunkSizeMax = 128;
    static chunkSizeMin = 16;
    static initialChunkSize = 32;
    static initialText = 'Touch typing (also called blind typing, or touch keyboarding) is a style of typing.';
}
