import { draggable } from "./draggable.js";

const CHUNK_SIZE = 32;

let textToDisplay = "Touch typing (also called blind typing, or touch keyboarding) is a style of typing.";

let chunks = chunked(textToDisplay, CHUNK_SIZE);

document.addEventListener("DOMContentLoaded", main);

function* chunked(string, length) {
    let start = 0;
    let end = length;

    while (end <= string.length) {
        yield string.substring(start, end);
        start += length;
        end += length;
    }

    if (start < string.length) {
        yield string.substring(start, string.length);
    }
}

function keydown(event) {
    const settings = document.getElementsByClassName("settings")[0];

    if (settings.classList.contains("settings-show")) {
        return;
    }

    const caps = document.getElementsByClassName("keyboard-key-caps-indicator")[0];

    if (event.getModifierState("CapsLock")) {
        caps.classList.add("keyboard-key-caps-indicator-active");
    } else {
        caps.classList.remove("keyboard-key-caps-indicator-active");
    }

    const keys = document.getElementsByClassName("keyboard-key");

    for (const key of keys) {
        if (key.dataset.value === event.key || key.dataset.valueAlt === event.key) {
            key.classList.add("keyboard-key-keydown");

            setTimeout(function () {
                key.classList.remove("keyboard-key-keydown");
            }, 100);
        }
    }

    // Don't move the cursor if event.key is not a single character
    if (event.key.length != 1) {
        return;
    }

    textCursorMove(event.key);
}

function textCursorMove(key) {
    const characters = document.getElementsByClassName("text-character");

    for (const character of characters) {
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
                    }
                }
            }
            character.classList.remove("text-character-cursor");
            try {
                character.nextSibling.classList.add("text-character-cursor");
            } catch (e) {
                const chunk = chunks.next().value;

                if (chunk) {
                    textInit(chunk);
                } else {
                    const text = document.getElementsByClassName("text")[0];

                    text.classList.add("text-rotate");

                    setTimeout(function () {
                        text.classList.remove("text-rotate");

                        chunks = chunked(textToDisplay, CHUNK_SIZE);
                        textInit(chunks.next().value);
                    }, 800);
                }
            }
            break;
        }
    }
}

function textInit(string) {
    string = string.replace(/[^ -~]+/g, "");

    textRemove();

    const text = document.getElementsByClassName("text")[0];

    for (const character of string) {
        const div = document.createElement("div");

        div.classList.add("text-character");

        if (character === " ") {
            div.classList.add("text-character-space");
        }

        div.appendChild(document.createTextNode(character));

        text.appendChild(div);
    }

    text.firstChild.classList.add("text-character-cursor");
}

function textRemove() {
    const text = document.getElementsByClassName("text")[0];

    while (text.firstChild) {
        text.firstChild.remove();
    }
}

function main(event) {
    textInit(chunks.next().value);

    document.addEventListener("keydown", keydown);

    const settings = document.getElementsByClassName("settings")[0];

    const settingsTitlebar = document.getElementsByClassName("settings-titlebar")[0];

    draggable(settingsTitlebar, settings);

    const settingsButton = document.getElementsByClassName("settings-button")[0];

    settingsButton.addEventListener("click", function (event) {
        settings.classList.toggle("settings-show");
    });

    settingsButton.addEventListener("mouseenter", function (event) {
        event.target.classList.add("settings-button-rotate-right");

        setTimeout(function () {
            event.target.classList.remove("settings-button-rotate-right");
        }, 500);
    });

    settingsButton.addEventListener("mouseleave", function (event) {
        event.target.classList.add("settings-button-rotate-left");

        setTimeout(function () {
            event.target.classList.remove("settings-button-rotate-left");
        }, 500);
    });

    const settingsClose = document.getElementsByClassName("settings-close")[0];

    settingsClose.addEventListener("click", function (event) {
        settings.classList.remove("settings-show");
    });

    const settingsForm = document.getElementsByClassName("settings-form")[0];

    settingsForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (document.getElementsByClassName("settings-usertext")[0].value.length) {
            textToDisplay = document.getElementsByClassName("settings-usertext")[0].value;
        }
        chunks = chunked(textToDisplay, CHUNK_SIZE);
        textInit(chunks.next().value);

        settings.classList.remove("settings-show");
    });
}
