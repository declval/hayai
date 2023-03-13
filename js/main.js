import { Text } from "./text.js";
import { draggable } from "./draggable.js";

document.addEventListener("DOMContentLoaded", main);

function main(event) {
    let text = new Text();

    text.render();

    document.addEventListener("keydown", function (event) {
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

        text.cursorMove(event.key);
    });

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

        let initialText;
        let chunkSize;

        if (document.getElementsByClassName("settings-usertext")[0].value.length) {
            initialText = document.getElementsByClassName("settings-usertext")[0].value;
        }

        if (document.getElementsByClassName("settings-chunk-size")[0].value.length) {
            const int = parseInt(document.getElementsByClassName("settings-chunk-size")[0].value, 10);

            if (!isNaN(int) && int >= Text.chunkSizeMin && int <= Text.chunkSizeMax) {
                chunkSize = int;
            }
        }

        text = new Text(initialText, chunkSize);

        settings.classList.remove("settings-show");
    });

    const settingsChunkSize = settingsForm.getElementsByClassName("settings-chunk-size")[0];

    settingsChunkSize.setAttribute("placeholder", settingsChunkSize.getAttribute("placeholder") + ` (${Text.chunkSizeMin} to ${Text.chunkSizeMax})`);
}
