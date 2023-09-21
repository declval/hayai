export { Text };

import { createElement } from './helpers.js';

class Text {
    constructor({
        text = Text.initialText,
        chunkSize = Text.initialChunkSize,
        keyboard = null
    }) {
        this.keyboard = keyboard;
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
        const cursorElement = document.getElementsByClassName('text-character-cursor')[0];

        if (!cursorElement) {
            return false;
        }

        if (!this.firstKeyPressed) {
            this.firstKeyPressed = true;

            this.startTime = Date.now();
            this.correctCount = 0;
        }

        if (cursorElement.textContent === key) {
            this.correctCount++;

            cursorElement.classList.add('text-character-correct');
        } else {
            cursorElement.classList.add('text-character-incorrect');
        }

        cursorElement.classList.remove('text-character-cursor');

        try {
            cursorElement.nextSibling.classList.add('text-character-cursor');
            if (this.keyboard) {
                this.keyboard.highlightKeysToPressFor(cursorElement.nextSibling.textContent);
            }
        } catch (e) {
            this.chunk = this.chunks.next().value;

            if (this.chunk) {
                this.render();
            } else {
                const timeDifference = (Date.now() - this.startTime) / 1000 / 60;

                this.speed = Math.floor(this.text.length / 5 / timeDifference);
                this.accuracy = Math.floor(this.correctCount / this.text.length * 100);

                this.chunks = this.chunked();
                this.chunk = this.chunks.next().value;

                this.textElement.classList.add('text-rotate');

                setTimeout(() => {
                    this.textElement.classList.remove('text-rotate');
                }, 800);

                return true;
            }
        }

        return false;
    }

    render = () => {
        if (Number.isFinite(this.speed)) {
            this.speedElement.textContent = `${this.speed}WPM`;
        } else {
            this.speedElement.textContent = 'N/A';
        }

        if (Number.isFinite(this.accuracy)) {
            this.accuracyElement.textContent = `${this.accuracy}%`;
        } else {
            this.accuracyElement.textContent = 'N/A';
        }

        this.clear();

        for (const character of this.chunk) {
            const divElement = createElement({
                name: 'div',
                text: character,
                classNames: character === ' ' ?
                    ['text-character', 'text-character-space'] : ['text-character']
            });
            this.textElement.appendChild(divElement);
        }

        this.textElement.firstChild.classList.add('text-character-cursor');
        if (this.keyboard) {
            this.keyboard.highlightKeysToPressFor(this.textElement.firstChild.textContent);
        }
    }

    reset = (text, chunkSize) => {
        if (!chunkSize) {
            chunkSize = Text.initialChunkSize;
        }

        if (!text) {
            text = Text.initialText;
        }

        this.text = text.replace(/[^ -~]+/g, '');
        this.chunkSize = chunkSize;

        if (this.text.length === 0) {
            throw new Error('Invalid text length: 0');
        }

        if (this.chunkSize < Text.chunkSizeMin || this.chunkSize > Text.chunkSizeMax) {
            throw new Error(`Invalid chunk size: ${this.chunkSize}`);
        }

        if (this.chunkSize > this.text.length) {
            this.chunkSize = this.text.length;
        }

        this.chunks = this.chunked();
        this.chunk = this.chunks.next().value;
        this.correctCount = 0;
        this.firstKeyPressed = false;
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

    static chunkSizeMax = 256;
    static chunkSizeMin = 1;
    static initialChunkSize = 32;
    static initialText = 'Touch typing (also called blind typing, or touch keyboarding) is a style of typing.';
}
