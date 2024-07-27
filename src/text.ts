import Settings from "./settings.ts";
import { ui } from "./main.ts";

export default class Text {
    readonly element;
    readonly settings;

    chunk;
    chunks: Iterator<string> | null;
    correctCount;
    count;
    firstPress;
    startTime;

    constructor(settings: Settings) {
        this.element = document.querySelector(".text");
        this.settings = settings;

        this.chunk = "";
        this.chunks = null;
        this.correctCount = 0;
        this.count = 0;
        this.firstPress = false;
        this.startTime = 0;

        this.reset();
    }

    clear() {
        while (this.element?.firstChild) {
            this.element?.firstChild.remove();
        }
    }

    cursorMove(key: string) {
        const cursor = document.querySelector(".text-character-cursor");

        if (!this.firstPress) {
            this.firstPress = true;

            this.count = 0;
            this.correctCount = 0;
            this.startTime = Date.now();
        }

        ++this.count;

        if (cursor?.textContent === key) {
            ++this.correctCount;

            cursor?.classList.add("text-character-correct");
        } else {
            cursor?.classList.add("text-character-incorrect");
        }

        cursor?.classList.remove("text-character-cursor");

        if (this.count === this.settings.statInterval) {
            const timeDifference = (Date.now() - this.startTime) / 1000 / 60;

            const speedElement = document.querySelector(".speed");

            const speed = Math.floor(
                this.settings.statInterval / 5 / timeDifference
            );

            if (speedElement) {
                if (Number.isFinite(speed)) {
                    speedElement.textContent = `${speed}WPM`;
                } else {
                    speedElement.textContent = "N/A";
                }
            }

            const accuracyElement = document.querySelector(".accuracy");

            const accuracy = Math.floor(
                (this.correctCount / this.settings.statInterval) * 100
            );

            if (accuracyElement) {
                if (Number.isFinite(accuracy)) {
                    accuracyElement.textContent = `${accuracy}%`;
                } else {
                    accuracyElement.textContent = "N/A";
                }
            }

            this.correctCount = 0;
            this.count = 0;
            this.startTime = Date.now();
        }

        const next = cursor?.nextElementSibling;

        if (next !== null) {
            next?.classList.add("text-character-cursor");

            ui.keyboard.highlightNext();
        } else {
            this.chunk = this.chunks!.next().value;

            if (!this.chunk) {
                this.chunks = this.chunked();
                this.chunk = this.chunks.next().value;
            }

            this.render();
        }
    }

    render() {
        this.clear();

        for (const character of this.chunk) {
            const div = document.createElement("div");
            div.textContent = character;
            div.classList.add("text-character");
            if (character === " ") {
                div.classList.add("text-character-space");
            }
            this.element?.appendChild(div);
        }

        this.element?.firstElementChild?.classList.add("text-character-cursor");

        ui.keyboard.highlightNext();
    }

    reset() {
        this.chunks = this.chunked();
        this.chunk = this.chunks?.next().value;
        this.correctCount = 0;
        this.count = 0;
        this.firstPress = false;
        this.startTime = 0;
    }

    *chunked() {
        let start = 0;
        let end = this.settings.size;

        while (end <= this.settings.text.length) {
            yield this.settings.text.slice(start, end);
            start += this.settings.size;
            end += this.settings.size;
        }

        if (start < this.settings.text.length) {
            yield this.settings.text.slice(start, this.settings.text.length);
        }
    }
}
