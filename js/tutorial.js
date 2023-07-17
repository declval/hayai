export { tutorialToggle };

import { keyboard } from './main.js';

let tutorialOpen = false;

const tutorialToggle = () => {
    const tutorialBackgroundElement =
        document.getElementById('tutorial-background');
    const tutorialHomeRowElement =
        document.getElementById('tutorial-home-row');
    const tutorialHomeRowButtonElement =
        document.getElementById('tutorial-home-row-button');
    const tutorialFingersElement =
        document.getElementById('tutorial-fingers');
    const tutorialFingersButtonElement =
        document.getElementById('tutorial-fingers-button');
    const tutorialSettingsElement =
        document.getElementById('tutorial-settings');
    const tutorialSettingsButtonElement =
        document.getElementById('tutorial-settings-button');

    const settingsElement = document.getElementById('settings');
    const settingsButtonElement = document.getElementById('settings-button');
    const keyboardElement = document.getElementById('keyboard');
    const keyboardHomeKeyElements =
        document.getElementsByClassName('keyboard-home-key');

    const tutorialClose = () => {
        tutorialSettingsElement.classList.remove('tutorial-show');
        settingsButtonElement.classList.remove('tutorial-settings-button');
        tutorialFingersElement.classList.remove('tutorial-show');
        if (document.getElementById('settings-guide').checked) {
            keyboard.guideOn();
        } else {
            keyboard.guideOff();
        }
        for (const keyboardHomeKeyElement of keyboardHomeKeyElements) {
            keyboardHomeKeyElement.classList.remove('tutorial-keyboard-home-key');
        }
        tutorialHomeRowElement.classList.remove('tutorial-show');
        tutorialBackgroundElement.classList.remove('tutorial-background-show');

        tutorialOpen = false;
    };

    if (tutorialOpen) {
        tutorialClose();
        return;
    }

    settingsElement.classList.remove('settings-show');

    tutorialOpen = true;

    keyboard.guideOff();

    tutorialBackgroundElement.classList.add('tutorial-background-show');
    tutorialHomeRowElement.classList.add('tutorial-show');

    for (const keyboardHomeKeyElement of keyboardHomeKeyElements) {
        keyboardHomeKeyElement.classList.add('tutorial-keyboard-home-key');
    }

    tutorialHomeRowElement.style.top =
        `${keyboardHomeKeyElements[0].parentElement.getBoundingClientRect().y}px`;

    tutorialHomeRowButtonElement.addEventListener('click', () => {
        tutorialHomeRowElement.classList.remove('tutorial-show');
        for (const keyboardHomeKeyElement of keyboardHomeKeyElements) {
            keyboardHomeKeyElement.classList.remove('tutorial-keyboard-home-key');
        }

        tutorialFingersElement.style.top = `${keyboardElement.getBoundingClientRect().y}px`;
        keyboard.guideOn();
        tutorialFingersElement.classList.add('tutorial-show');
    });

    tutorialFingersButtonElement.addEventListener('click', () => {
        tutorialFingersElement.classList.remove('tutorial-show');
        keyboard.guideOff();

        tutorialSettingsElement.style.top =
            `${keyboardElement.getBoundingClientRect().y}px`;
        settingsButtonElement.classList.add('tutorial-settings-button');
        tutorialSettingsElement.classList.add('tutorial-show');
    });

    tutorialSettingsButtonElement.addEventListener('click', () => {
        tutorialSettingsElement.classList.remove('tutorial-show');
        settingsButtonElement.classList.remove('tutorial-settings-button');
        if (document.getElementById('settings-guide').checked) {
            keyboard.guideOn();
        } else {
            keyboard.guideOff();
        }
        tutorialBackgroundElement.classList.remove('tutorial-background-show');

        tutorialOpen = false;
    });

    const tutorialCloseButtonElements =
        document.getElementsByClassName('tutorial-close-button');

    for (const tutorialCloseButtonElement of tutorialCloseButtonElements) {
        tutorialCloseButtonElement.addEventListener('click', () => {
            tutorialClose();
        });
    }
};
