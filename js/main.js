export { keyboard };

import { Course } from './course.js';
import { Keyboard } from './keyboard.js';
import { Settings } from './settings.js';
import { Text } from './text.js';
import { Tutorial } from './tutorial.js';
import { darkMode } from './helpers.js';

const keyboard = new Keyboard();
const text = new Text({keyboard});
const course = new Course(text);
const settings = new Settings();
const tutorial = new Tutorial(keyboard, settings);

const main = () => {
    text.render();

    document.addEventListener('keydown', event => {
        if (settings.shown()) {
            return;
        }

        if (event.getModifierState('CapsLock')) {
            keyboard.capsOn();
        } else {
            keyboard.capsOff();
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

    const tutorialButtonElement = document.getElementById('tutorial-button');

    tutorialButtonElement.addEventListener('click', () => {
        tutorial.open();
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const mediaQueryHandler = event => {
        const darkModeItem = localStorage.getItem('darkMode');

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

    mediaQuery.addEventListener('change', mediaQueryHandler);

    mediaQueryHandler(mediaQuery);

    const darkModeButtonElement = document.getElementById('dark-mode-button');

    darkModeButtonElement.addEventListener('click', event => {
        if (event.target.classList.contains('dark-mode-button-enabled')) {
            localStorage.setItem('darkMode', '');
            darkMode(false);
        } else {
            localStorage.setItem('darkMode', 'on');
            darkMode(true);
        }
    });

    const settingsButtonElement = document.getElementById('settings-button');

    settingsButtonElement.addEventListener('click', () => {
        settings.toggle();
    });
}

document.addEventListener('DOMContentLoaded', main);
