export { keyboard };

import { Course } from './course.js';
import { Keyboard } from './keyboard.js';
import { Settings } from './settings.js';
import { Text } from './text.js';
import { tutorialToggle } from './tutorial.js';

const text = new Text();
const course = new Course(text);
const keyboard = new Keyboard();
const settings = new Settings();

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
        tutorialToggle();
    });

    const darkModeButtonElement = document.getElementById('dark-mode-button');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const mediaQueryHandler = event => {
        const darkMode = localStorage.getItem('darkMode');

        if (darkMode === null) {
            if (event.matches) {
                document.documentElement.classList.add('dark-mode');
                darkModeButtonElement.classList.add('dark-mode-button-enabled');
                darkModeButtonElement.textContent = 'light_mode';
            } else {
                document.documentElement.classList.remove('dark-mode');
                darkModeButtonElement.classList.remove('dark-mode-button-enabled');
                darkModeButtonElement.textContent = 'dark_mode';
            }
        } else if (darkMode) {
            document.documentElement.classList.add('dark-mode');
            darkModeButtonElement.classList.add('dark-mode-button-enabled');
            darkModeButtonElement.textContent = 'light_mode';
        } else {
            document.documentElement.classList.remove('dark-mode');
            darkModeButtonElement.classList.remove('dark-mode-button-enabled');
            darkModeButtonElement.textContent = 'dark_mode';
        }
    };

    mediaQuery.addEventListener('change', mediaQueryHandler);

    mediaQueryHandler(mediaQuery);

    darkModeButtonElement.addEventListener('click', event => {
        if (event.target.classList.contains('dark-mode-button-enabled')) {
            localStorage.setItem('darkMode', '');
            event.target.textContent = 'dark_mode';
        } else {
            localStorage.setItem('darkMode', 'on');
            event.target.textContent = 'light_mode';
        }
        document.documentElement.classList.toggle('dark-mode');
        event.target.classList.toggle('dark-mode-button-enabled');
    });

    const settingsButtonElement = document.getElementById('settings-button');

    settingsButtonElement.addEventListener('click', () => {
        settings.toggle();
    });
}

document.addEventListener('DOMContentLoaded', main);
