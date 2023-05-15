export { tutorialToggle };

let tutorialOpen = false;

const tutorialToggle = () => {
    const tutorialBackground = document.getElementById('tutorial-background');
    const tutorialHomeRow = document.getElementById('tutorial-home-row');
    const tutorialHomeRowButton = document.getElementById('tutorial-home-row-button');
    const tutorialFingers = document.getElementById('tutorial-fingers');
    const tutorialFingersButton = document.getElementById('tutorial-fingers-button');
    const tutorialSettings = document.getElementById('tutorial-settings');
    const tutorialSettingsButton = document.getElementById('tutorial-settings-button');

    const settings = document.getElementById('settings');
    const settingsButton = document.getElementById('settings-button');
    const keyboard = document.getElementById('keyboard');
    const keyboardGuideKeys = [
        ...document.getElementsByClassName('keyboard-key-pinkie'),
        ...document.getElementsByClassName('keyboard-key-ring'),
        ...document.getElementsByClassName('keyboard-key-middle'),
        ...document.getElementsByClassName('keyboard-key-lindex'),
        ...document.getElementsByClassName('keyboard-key-rindex')
    ];
    const keyboardHomeKeys = document.getElementsByClassName('keyboard-home-key');

    const tutorialClose = () => {
        tutorialSettings.classList.remove('tutorial-show');
        settingsButton.classList.remove('tutorial-settings-button');
        tutorialFingers.classList.remove('tutorial-show');
        if (document.getElementById('settings-guide').checked) {
            keyboard.classList.add('keyboard-guide-show');
        } else {
            keyboard.classList.remove('keyboard-guide-show');
        }
        for (const keyboardGuideKey of keyboardGuideKeys) {
            keyboardGuideKey.classList.remove('tutorial-keyboard-guide-key');
        }
        for (const keyboardHomeKey of keyboardHomeKeys) {
            keyboardHomeKey.classList.remove('tutorial-keyboard-home-key');
        }
        tutorialHomeRow.classList.remove('tutorial-show');
        tutorialBackground.classList.remove('tutorial-background-show');

        tutorialOpen = false;
    };

    if (tutorialOpen) {
        tutorialClose();
        return;
    }

    settings.classList.remove('settings-show');

    tutorialOpen = true;

    keyboard.classList.remove('keyboard-guide-show');

    tutorialBackground.classList.add('tutorial-background-show');
    tutorialHomeRow.classList.add('tutorial-show');

    for (const keyboardHomeKey of keyboardHomeKeys) {
        keyboardHomeKey.classList.add('tutorial-keyboard-home-key');
    }

    tutorialHomeRow.style.top = `${keyboardHomeKeys[0].parentElement.getBoundingClientRect().y}px`;

    tutorialHomeRowButton.addEventListener('click', () => {
        tutorialHomeRow.classList.remove('tutorial-show');
        for (const keyboardHomeKey of keyboardHomeKeys) {
            keyboardHomeKey.classList.remove('tutorial-keyboard-home-key');
        }

        tutorialFingers.style.top = `${keyboard.getBoundingClientRect().y}px`;
        for (const keyboardGuideKey of keyboardGuideKeys) {
            keyboardGuideKey.classList.add('tutorial-keyboard-guide-key');
        }
        keyboard.classList.add('keyboard-guide-show');
        tutorialFingers.classList.add('tutorial-show');
    });

    tutorialFingersButton.addEventListener('click', () => {
        tutorialFingers.classList.remove('tutorial-show');
        for (const keyboardGuideKey of keyboardGuideKeys) {
            keyboardGuideKey.classList.remove('tutorial-keyboard-guide-key');
        }
        keyboard.classList.remove('keyboard-guide-show');

        tutorialSettings.style.top = `${keyboard.getBoundingClientRect().y}px`;
        settingsButton.classList.add('tutorial-settings-button');
        tutorialSettings.classList.add('tutorial-show');
    });

    tutorialSettingsButton.addEventListener('click', () => {
        tutorialSettings.classList.remove('tutorial-show');
        settingsButton.classList.remove('tutorial-settings-button');
        if (document.getElementById('settings-guide').checked) {
            keyboard.classList.add('keyboard-guide-show');
        } else {
            keyboard.classList.remove('keyboard-guide-show');
        }
        tutorialBackground.classList.remove('tutorial-background-show');

        tutorialOpen = false;
    });

    const tutorialCloseButtons = document.getElementsByClassName('tutorial-close-button');

    for (const tutorialCloseButton of tutorialCloseButtons) {
        tutorialCloseButton.addEventListener('click', () => {
            tutorialClose();
        });
    }
};
