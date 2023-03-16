DEFAULT_TEXT = "Touch typing (also called blind typing, or touch keyboarding) is a style of typing.";

document.addEventListener("DOMContentLoaded", main);

function keydown(event, keys) {
    event.preventDefault();

    for (const key of keys) {
        if (key.dataset.value.toLowerCase() === event.key.toLowerCase()) {
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
                text_reset();
            }
            break;
        }
    }
}

function text_init(string) {
    text_remove();

    const text = document.getElementById("text");

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
    const text = document.getElementById("text");

    while (text.firstChild) {
        text.firstChild.remove();
    }
}

function main(event) {
    text_init(DEFAULT_TEXT);

    const keys = document.getElementsByClassName("keyboard-key");

    document.addEventListener("keydown", function (event) {
        keydown(event, keys);
    });
}