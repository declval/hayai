export { keyboard };

import { Course } from "./course.mjs";
import { Keyboard } from "./keyboard.mjs";
import { Settings } from "./settings.mjs";
import { Text } from "./text.mjs";
import { Tutorial } from "./tutorial.mjs";
import { darkMode } from "./helpers.mjs";
import { makeItNotSnow, makeItSnow } from "./snow.mjs";

const keyboard = new Keyboard();
const text = new Text({ keyboard });
const course = new Course(text);
const settings = new Settings();
const tutorial = new Tutorial(keyboard, settings);

const main = () => {
    text.render();

    document.addEventListener("keydown", event => {
        if (settings.shown()) {
            return;
        }

        if (event.key === "CapsLock") {
            if (event.getModifierState("CapsLock")) {
                keyboard.capsOff();
            } else {
                keyboard.capsOn();
            }
            return;
        }

        keyboard.press(event.key);

        // Don't move the cursor if event.key is not a single character
        if (event.key.length !== 1) {
            return;
        }

        const finished = text.cursorMove(event.key);

        if (finished) {
            course.nextLesson();
        }
    });

    const tutorialButtonElement = document.getElementById("tutorial-button");

    tutorialButtonElement.addEventListener("click", () => {
        tutorial.open();
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const mediaQueryHandler = event => {
        const darkModeItem = localStorage.getItem("darkMode");

        if (darkModeItem === null) {
            if (event.matches) {
                darkMode(true);
            } else {
                darkMode(false);
            }
        } else if (darkModeItem) {
            darkMode(true);
        } else {
            darkMode(false);
        }
    };

    mediaQuery.addEventListener("change", mediaQueryHandler);

    mediaQueryHandler(mediaQuery);

    const darkModeButtonElement = document.getElementById("dark-mode-button");

    darkModeButtonElement.addEventListener("click", event => {
        if (event.target.classList.contains("dark-mode-button-enabled")) {
            localStorage.setItem("darkMode", "");
            darkMode(false);
        } else {
            localStorage.setItem("darkMode", "on");
            darkMode(true);
        }
    });

    const settingsButtonElement = document.getElementById("settings-button");

    settingsButtonElement.addEventListener("click", () => {
        settings.toggle();
    });

    window.addEventListener("resize", () => {
        const snow = localStorage.getItem("snow");

        if (snow === null) {
            const currentMonth = new Date().getMonth();

            if ([0, 1, 11].includes(currentMonth)) {
                makeItSnow({ element: document.body, sizeRange: [4, 8] });
            }
        } else if (snow) {
            makeItSnow({ element: document.body, sizeRange: [4, 8] });
        } else {
            makeItNotSnow(document.body);
        }
    });
};

document.addEventListener("DOMContentLoaded", main);
