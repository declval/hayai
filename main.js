const CHUNK_SIZE = 32;

let textToDisplay = "Touch typing (also called blind typing, or touch keyboarding) is a style of typing.";

let moving = false;
let offsetX = 0;
let offsetY = 0;

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

function keydown(event, keys) {
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

    const keys = document.getElementsByClassName("keyboard-key");

    document.addEventListener("keydown", function (event) {
        keydown(event, keys);
    });

    const settings = document.getElementsByClassName("settings")[0];

    const settingsTitlebar = document.getElementsByClassName("settings-titlebar")[0];

    settingsTitlebar.addEventListener("mousedown", function (event) {
        offsetX = event.clientX - settings.offsetLeft;
        offsetY = event.clientY - settings.offsetTop;
        moving = true;
    });

    document.addEventListener("mousemove", function (event) {
        if (moving) {
            settings.style.left = `${event.clientX - offsetX}px`;
            settings.style.top = `${event.clientY - offsetY}px`;
        }
    });

    settingsTitlebar.addEventListener("mouseup", function (event) {
        moving = false;
    });

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

    // Do not move settings window if move started with mouse over close button
    settingsClose.addEventListener("mousedown", function (event) {
        event.stopPropagation();
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