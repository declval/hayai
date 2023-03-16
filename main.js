DEFAULT_TEXT = "Touch typing (also called blind typing, or touch keyboarding) is a style of typing.";
CHUNK_SIZE = 32

let moving = false;
let offsetX = 0;
let offsetY = 0;

let chunks = chunked(DEFAULT_TEXT, CHUNK_SIZE);

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

    event.preventDefault();

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

    text_cursor_move(event.key);
}

function text_cursor_move(key) {
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
                    text_init(chunk);
                } else {
                    const text = document.getElementsByClassName("text")[0];

                    text.classList.add("text-rotate");

                    setTimeout(function () {
                        text.classList.remove("text-rotate");

                        chunks = chunked(DEFAULT_TEXT, CHUNK_SIZE);
                        text_init(chunks.next().value);
                    }, 800);
                }
            }
            break;
        }
    }
}

function text_init(string) {
    string = string.replace(/[^ -~]+/g, "");

    text_remove();

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

function text_remove() {
    const text = document.getElementsByClassName("text")[0];

    while (text.firstChild) {
        text.firstChild.remove();
    }
}

function main(event) {
    text_init(chunks.next().value);

    const keys = document.getElementsByClassName("keyboard-key");

    document.addEventListener("keydown", function (event) {
        keydown(event, keys);
    });

    const settings = document.getElementsByClassName("settings")[0];

    const settings_titlebar = document.getElementsByClassName("settings-titlebar")[0];

    settings_titlebar.addEventListener("mousedown", function (event) {
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

    settings_titlebar.addEventListener("mouseup", function (event) {
        moving = false;
    });

    const settings_button = document.getElementsByClassName("settings-button")[0];

    settings_button.addEventListener("click", function (event) {
        settings.classList.toggle("settings-show");
    });

    settings_button.addEventListener("mouseenter", function (event) {
        event.target.classList.add("settings-button-rotate-right");

        setTimeout(function () {
            event.target.classList.remove("settings-button-rotate-right");
        }, 500);
    });

    settings_button.addEventListener("mouseleave", function (event) {
        event.target.classList.add("settings-button-rotate-left");

        setTimeout(function () {
            event.target.classList.remove("settings-button-rotate-left");
        }, 500);
    });

    const settings_close = document.getElementsByClassName("settings-close")[0];

    settings_close.addEventListener("click", function (event) {
        settings.classList.remove("settings-show");
    });

    // Do not move settings window if move started with mouse over close button
    settings_close.addEventListener("mousedown", function (event) {
        event.stopPropagation();
    });

    const settings_form = document.getElementsByClassName("settings-form")[0];

    settings_form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (document.getElementsByClassName("settings-usertext")[0].value.length) {
            DEFAULT_TEXT = document.getElementsByClassName("settings-usertext")[0].value;
        }
        chunks = chunked(DEFAULT_TEXT, CHUNK_SIZE);
        text_init(chunks.next().value);

        settings.classList.remove("settings-show");
    });
}