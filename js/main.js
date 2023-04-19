import { Settings } from './settings.js';
import { Text } from './text.js';
import { tutorialToggle } from './tutorial.js';

const main = () => {
    let text = new Text();

    text.render();

    document.addEventListener('keydown', event => {
        const settings = document.getElementById('settings');

        if (settings.classList.contains('settings-show')) {
            return;
        }

        const caps = document.getElementById('keyboard-key-caps-indicator');

        if (event.getModifierState('CapsLock')) {
            caps.classList.add('keyboard-key-caps-indicator-active');
        } else {
            caps.classList.remove('keyboard-key-caps-indicator-active');
        }

        const keys = document.getElementsByClassName('keyboard-key');

        for (const key of keys) {
            if (key.dataset.value === event.key || key.dataset.valueAlt === event.key) {
                key.classList.add('keyboard-key-keydown');

                setTimeout(() => {
                    key.classList.remove('keyboard-key-keydown');
                }, 100);
            }
        }

        // Don't move the cursor if event.key is not a single character
        if (event.key.length != 1) {
            return;
        }

        text.cursorMove(event.key);
    });

    const tutorialButton = document.getElementById('tutorial-button');

    tutorialButton.addEventListener('click', () => {
        tutorialToggle();
    });

    const darkModeButton = document.getElementById('dark-mode-button');

    const darkMode = localStorage.getItem('darkMode');

    if (darkMode === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : darkMode) {
        darkModeButton.classList.toggle('dark-mode-button-enabled');
        darkModeButton.textContent = 'light_mode';
    }

    darkModeButton.addEventListener('click', event => {
        if (event.target.classList.contains('dark-mode-button-enabled')) {
            localStorage.setItem('darkMode', '');
            darkModeButton.textContent = 'dark_mode';
        } else {
            localStorage.setItem('darkMode', 'on');
            darkModeButton.textContent = 'light_mode';
        }
        event.target.classList.toggle('dark-mode-button-enabled');
        document.documentElement.classList.toggle('dark-mode');
    });

    const settings = new Settings(text);

    const settingsButton = document.getElementById('settings-button');

    settingsButton.addEventListener('click', () => {
        settings.toggle();
    });

    settingsButton.addEventListener('mouseenter', event => {
        event.target.classList.add('settings-button-rotate-right');

        setTimeout(() => {
            event.target.classList.remove('settings-button-rotate-right');
        }, 800);
    });

    settingsButton.addEventListener('mouseleave', event => {
        event.target.classList.add('settings-button-rotate-left');

        setTimeout(() => {
            event.target.classList.remove('settings-button-rotate-left');
        }, 800);
    });
}

document.addEventListener('DOMContentLoaded', main);
