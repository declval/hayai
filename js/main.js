import { Course } from './course.js';
import { Settings } from './settings.js';
import { Text } from './text.js';
import { tutorialToggle } from './tutorial.js';

const text = new Text();
const course = new Course(text);
const settings = new Settings();

const main = () => {
    text.render();

    document.addEventListener('keydown', event => {
        const settingsElement = document.getElementById('settings');

        if (settingsElement.classList.contains('settings-show')) {
            return;
        }

        const capsIndicatorElement = document.getElementById('keyboard-key-caps-indicator');

        if (event.getModifierState('CapsLock')) {
            capsIndicatorElement.classList.add('keyboard-key-caps-indicator-active');
        } else {
            capsIndicatorElement.classList.remove('keyboard-key-caps-indicator-active');
        }

        const keyElements = document.getElementsByClassName('keyboard-key');

        for (const keyElement of keyElements) {
            if (keyElement.dataset.value === event.key ||
                    keyElement.dataset.valueAlt === event.key) {
                keyElement.classList.add('keyboard-key-keydown');

                setTimeout(() => {
                    keyElement.classList.remove('keyboard-key-keydown');
                }, 100);
            }

            break;
        }

        // Don't move the cursor if event.key is not a single character
        if (event.key.length != 1) {
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

    settingsButtonElement.addEventListener('mouseenter', event => {
        event.target.classList.add('settings-button-rotate-right');

        setTimeout(() => {
            event.target.classList.remove('settings-button-rotate-right');
        }, 800);
    });

    settingsButtonElement.addEventListener('mouseleave', event => {
        event.target.classList.add('settings-button-rotate-left');

        setTimeout(() => {
            event.target.classList.remove('settings-button-rotate-left');
        }, 800);
    });
}

document.addEventListener('DOMContentLoaded', main);
