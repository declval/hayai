export { Tutorial };

class Tutorial {
    constructor(keyboard, settings) {
        this.keyboard = keyboard;
        this.settings = settings;
        this.tutorialOpen = false;
        this.tutorialBackgroundElement = document.getElementById(
            "tutorial-background"
        );

        const tutorialCloseButtonElements = document.getElementsByClassName(
            "tutorial-close-button"
        );

        for (const tutorialCloseButtonElement of tutorialCloseButtonElements) {
            tutorialCloseButtonElement.addEventListener("click", () => {
                this.close();
            });
        }
    }

    homeRowShow = () => {
        this.tutorialHomeRowElement =
            document.getElementById("tutorial-home-row");
        this.keyboardHomeKeyElements =
            document.getElementsByClassName("keyboard-home-key");
        this.tutorialHomeRowElement.style.top = `${this.keyboardHomeKeyElements[0].parentElement.getBoundingClientRect().y}px`;

        this.tutorialHomeRowElement.classList.add("tutorial-show");

        for (const keyboardHomeKeyElement of this.keyboardHomeKeyElements) {
            keyboardHomeKeyElement.classList.add("tutorial-keyboard-home-key");
        }

        const tutorialHomeRowButtonElement = document.getElementById(
            "tutorial-home-row-button"
        );

        tutorialHomeRowButtonElement.addEventListener("click", () => {
            this.homeRowHide();
            this.fingersShow();
        });
    };

    homeRowHide = () => {
        this.tutorialHomeRowElement.classList.remove("tutorial-show");

        for (const keyboardHomeKeyElement of this.keyboardHomeKeyElements) {
            keyboardHomeKeyElement.classList.remove(
                "tutorial-keyboard-home-key"
            );
        }
    };

    fingersShow = () => {
        this.tutorialFingersElement =
            document.getElementById("tutorial-fingers");
        const keyboardElement = document.getElementById("keyboard");
        this.tutorialFingersElement.style.top = `${keyboardElement.getBoundingClientRect().y}px`;

        this.keyboard.guideOn();
        this.tutorialFingersElement.classList.add("tutorial-show");

        const tutorialFingersButtonElement = document.getElementById(
            "tutorial-fingers-button"
        );

        tutorialFingersButtonElement.addEventListener("click", () => {
            this.fingersHide();
            this.settingsShow();
        });
    };

    fingersHide = () => {
        this.keyboard.guideOff();
        this.tutorialFingersElement.classList.remove("tutorial-show");
    };

    settingsShow = () => {
        this.tutorialSettingsElement =
            document.getElementById("tutorial-settings");
        const keyboardElement = document.getElementById("keyboard");
        this.tutorialSettingsElement.style.top = `${keyboardElement.getBoundingClientRect().y}px`;

        this.settingsButtonElement = document.getElementById("settings-button");
        this.settingsButtonElement.classList.add("tutorial-settings-button");
        this.tutorialSettingsElement.classList.add("tutorial-show");

        const tutorialSettingsButtonElement = document.getElementById(
            "tutorial-settings-button"
        );

        tutorialSettingsButtonElement.addEventListener("click", () => {
            this.settingsHide();
            this.close();
        });
    };

    settingsHide = () => {
        this.settingsButtonElement.classList.remove("tutorial-settings-button");
        this.tutorialSettingsElement.classList.remove("tutorial-show");

        if (document.getElementById("settings-guide").checked) {
            this.keyboard.guideOn();
        } else {
            this.keyboard.guideOff();
        }
    };

    open = () => {
        if (this.tutorialOpen) {
            this.close();
            return;
        }
        this.tutorialOpen = true;
        this.tutorialBackgroundElement.classList.add(
            "tutorial-background-show"
        );
        this.keyboard.guideOff();
        this.settings.close();
        this.homeRowShow();
    };

    close = () => {
        this.tutorialOpen = false;
        this.tutorialBackgroundElement.classList.remove(
            "tutorial-background-show"
        );
        this.homeRowHide();
        this.fingersHide();
        this.settingsHide();
    };
}
