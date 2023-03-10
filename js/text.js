export { Text };

class Text {
    constructor(text = Text.initialText, chunkSize = Text.chunkSize) {
        this.text = text.replace(/[^ -~]+/g, "");
        this.chunkSize = chunkSize;

        this.characters = null;
        this.chunks = this.chunked();
        this.chunk = this.chunks.next().value;
        this.textElement = null;
    }

    clear() {
        while (this.textElement.firstChild) {
            this.textElement.firstChild.remove();
        }
    }

    cursorMove(key) {
        for (const character of this.characters) {
            if (character.classList.contains("text-character-cursor")) {
                if (character.textContent === key) {
                    character.classList.add("text-character-correct");
                } else {
                    character.classList.add("text-character-incorrect");

                    const keys = document.getElementsByClassName("keyboard-key");

                    for (const key of keys) {
                        if (key.dataset.value === character.textContent || key.dataset.valueAlt === character.textContent) {
                            key.classList.add("keyboard-key-highlight");

                            setTimeout(function () {
                                key.classList.remove("keyboard-key-highlight");
                            }, 300);

                            break;
                        }
                    }
                }

                character.classList.remove("text-character-cursor");

                try {
                    character.nextSibling.classList.add("text-character-cursor");
                } catch (e) {
                    this.chunk = this.chunks.next().value;

                    if (this.chunk) {
                        this.render();
                    } else {
                        this.chunks = this.chunked();
                        this.chunk = this.chunks.next().value;

                        this.textElement.classList.add("text-rotate");

                        const that = this;
                        setTimeout(function () {
                            that.textElement.classList.remove("text-rotate");
                            that.render();
                        }, 800);
                    }
                }

                break;
            }
        }
    }

    render() {
        this.textElement = document.getElementsByClassName("text")[0];

        this.clear();

        for (const character of this.chunk) {
            const div = document.createElement("div");

            div.classList.add("text-character");

            if (character === " ") {
                div.classList.add("text-character-space");
            }

            div.appendChild(document.createTextNode(character));

            this.textElement.appendChild(div);
        }

        this.characters = this.textElement.getElementsByClassName("text-character");
        this.textElement.firstChild.classList.add("text-character-cursor");
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

    static chunkSize = 32;
    static chunkSizeMax = 128;
    static chunkSizeMin = 1;
    static initialText = "Touch typing (also called blind typing, or touch keyboarding) is a style of typing.";
}
