export { Text };

class Text {
    constructor(text = Text.initialText, chunkSize = Text.initialChunkSize) {
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

                    const keys = document.getElementsByClassName('keyboard-key');

                    for (const key of keys) {
                        if (key.dataset.value === character.textContent || key.dataset.valueAlt === character.textContent) {
                            key.classList.add('keyboard-key-highlight');

                            setTimeout(() => {
                                key.classList.remove('keyboard-key-highlight');
                            }, 300);

                            break;
                        }
                    }
                }

                character.classList.remove('text-character-cursor');

                try {
                    character.nextSibling.classList.add('text-character-cursor');
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
                            this.render();
                        }, 800);
                    }
                }

                break;
            }
        }
    }

    render = () => {
        this.clear();

        this.firstKeyPressed = false;

        const previousSpeed = parseInt(this.speedElement.textContent, 10);

        if (Number.isFinite(this.speed)) {
            if (Number.isFinite(previousSpeed)) {
                if (previousSpeed < this.speed) {
                    this.speedElement.classList.add('statistics-better');
                    this.speedElement.classList.remove('statistics-worse');
                } else if (previousSpeed === this.speed) {
                    this.speedElement.classList.remove('statistics-better');
                    this.speedElement.classList.remove('statistics-worse');
                } else {
                    this.speedElement.classList.remove('statistics-better');
                    this.speedElement.classList.add('statistics-worse');
                }
            }

            this.speedElement.textContent = `${this.speed} WPM`;
        } else {
            this.speedElement.textContent = 'N/A';
        }

        const previousAccuracy = parseInt(this.accuracyElement.textContent, 10);

        if (Number.isFinite(this.accuracy)) {
            if (Number.isFinite(previousAccuracy)) {
                if (previousAccuracy < this.accuracy) {
                    this.accuracyElement.classList.add('statistics-better');
                    this.accuracyElement.classList.remove('statistics-worse');
                } else if (previousAccuracy === this.accuracy) {
                    this.accuracyElement.classList.remove('statistics-better');
                    this.accuracyElement.classList.remove('statistics-worse');
                } else {
                    this.accuracyElement.classList.remove('statistics-better');
                    this.accuracyElement.classList.add('statistics-worse');
                }
            }

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

        this.characters = this.textElement.getElementsByClassName('text-character');
    }

    reset = (text, chunkSize) => {
        this.text = text.replace(/[^ -~]+/g, '');
        this.chunkSize = chunkSize;

        if (this.text.length === 0) {
            throw new Error('Invalid text length');
        }

        if (this.chunkSize < Text.chunkSizeMin ||
            this.chunkSize > Text.chunkSizeMax ||
            this.chunkSize > this.text.length) {
            throw new Error('Invalid chunk size');
        }

        this.accuracy = null;
        this.chunks = this.chunked();
        this.chunk = this.chunks.next().value;
        this.firstKeyPressed = false;
        this.nCorrect = 0;
        this.speed = null;
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
    static chunkSizeMin = 1;
    static initialChunkSize = 32;
    static initialText = 'Touch typing (also called blind typing, or touch keyboarding) is a style of typing.';
}
