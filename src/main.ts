import "./style.scss";

import Keyboard from "./keyboard.ts";
import Settings, {
    setupDarkMode,
    setupKeyboardVisibility
} from "./settings.ts";
import Text from "./text.ts";
import wikipediaPath from "./wikipedia.svg";

const settings = new Settings();
const keyboard = new Keyboard(settings);
const text = new Text(settings);

export const ui = { keyboard, text };

document.addEventListener("DOMContentLoaded", () => {
    setupDarkMode(document.querySelector(".darkmode-toggle")!);
    setupKeyboardVisibility(document.querySelector(".keyboard-toggle")!);

    text.render();

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (settings.isOpen()) {
                settings.close();
            } else {
                text.reset();
                text.render();
            }
            return;
        }

        if (settings.isOpen()) {
            return;
        }

        keyboard.press(event);

        if ([" ", "'"].includes(event.key)) {
            event.preventDefault();
        }

        if (
            [
                "Alt",
                "CapsLock",
                "Control",
                "Enter",
                "Meta",
                "Shift",
                "Tab"
            ].includes(event.key)
        ) {
            return;
        }

        text.cursorMove(event.key);
    });

    document.querySelector<HTMLImageElement>(".wiki-logo")!.src = wikipediaPath;
});
