export { textAndChunkSize };

import { Settings } from './settings.js';
import { Text } from './text.js';
import { lessonGenerate, permutations } from './helpers.js';
import { tutorialToggle } from './tutorial.js';

const english = [
    'etao', 'insh', 'rdlc', 'umwf', 'gypb', 'vkjx', 'qz49', '1527', '3860',
    '([.+', ':><`', '\',/"', ';{?-', '~@_}', ')$^!', '|#=&', ']%*\\'
];
const lessons = document.getElementsByClassName('lesson');
const textAndChunkSize = {};

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

        const finished = text.cursorMove(event.key);

        if (finished) {
            const lessonCurrent = document.getElementsByClassName('lesson-current')[0];
            const index = parseInt(lessonCurrent.dataset.index);
            let nextLesson = null;

            if (index >= 0 && index < english.length - 1) {
                nextLesson = lessonCurrent.nextElementSibling;
            } else {
                nextLesson = lessons[0];
            }

            setTimeout(() => {
                nextLesson.click();
            }, 800);
        }
    });

    for (const lesson of lessons) {
        lesson.addEventListener('click', event => {
            for (const lesson of lessons) {
                if (lesson === event.target) {
                    lesson.classList.add('lesson-current');
                    const index = parseInt(event.target.dataset.index);
                    if (index === -1) {
                        if (textAndChunkSize.chunkSize && textAndChunkSize.text) {
                            text.reset(textAndChunkSize.text, textAndChunkSize.chunkSize)
                        } else {
                            text.reset();
                        }
                    } else {
                        const perviousChars = lessonGenerate(english.slice(0, index + 1).join(''));
                        text.reset(
                            `${permutations(english[index]).join(' ')} ${perviousChars}`,
                            34
                        );
                    }
                    text.render();
                } else {
                    lesson.classList.remove('lesson-current');
                }
            }
        });
    }

    const tutorialButton = document.getElementById('tutorial-button');

    tutorialButton.addEventListener('click', () => {
        tutorialToggle();
    });

    const darkModeButton = document.getElementById('dark-mode-button');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const mediaQueryHandler = event => {
        const darkMode = localStorage.getItem('darkMode');

        if (darkMode === null) {
            if (event.matches) {
                document.documentElement.classList.add('dark-mode');
                darkModeButton.classList.add('dark-mode-button-enabled');
                darkModeButton.textContent = 'light_mode';
            } else {
                document.documentElement.classList.remove('dark-mode');
                darkModeButton.classList.remove('dark-mode-button-enabled');
                darkModeButton.textContent = 'dark_mode';
            }
        } else if (darkMode) {
            document.documentElement.classList.add('dark-mode');
            darkModeButton.classList.add('dark-mode-button-enabled');
            darkModeButton.textContent = 'light_mode';
        } else {
            document.documentElement.classList.remove('dark-mode');
            darkModeButton.classList.remove('dark-mode-button-enabled');
            darkModeButton.textContent = 'dark_mode';
        }
    };

    mediaQuery.addEventListener('change', mediaQueryHandler);

    mediaQueryHandler(mediaQuery);

    darkModeButton.addEventListener('click', event => {
        if (event.target.classList.contains('dark-mode-button-enabled')) {
            localStorage.setItem('darkMode', '');
            darkModeButton.textContent = 'dark_mode';
        } else {
            localStorage.setItem('darkMode', 'on');
            darkModeButton.textContent = 'light_mode';
        }
        document.documentElement.classList.toggle('dark-mode');
        event.target.classList.toggle('dark-mode-button-enabled');
    });

    const settings = new Settings();

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
