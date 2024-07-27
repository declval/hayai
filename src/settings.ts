import { ui } from "./main.ts";

export function setupDarkMode(element: HTMLButtonElement) {
    let isDarkMode =
        localStorage.getItem("isDarkMode") === null
            ? null
            : localStorage.getItem("isDarkMode") === "true";

    function on() {
        document.documentElement.classList.add("darkmode");
        element.textContent = "light_mode";
    }

    function off() {
        document.documentElement.classList.remove("darkmode");
        element.textContent = "dark_mode";
    }

    function toggle() {
        if (isDarkMode === true) {
            isDarkMode = false;
            localStorage.setItem("isDarkMode", "false");
            off();
        } else {
            isDarkMode = true;
            localStorage.setItem("isDarkMode", "true");
            on();
        }
    }

    if (isDarkMode === null) {
        const mediaQueryList = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );
        if (mediaQueryList.matches) {
            isDarkMode = true;
            on();
        } else {
            isDarkMode = false;
            off();
        }
    } else if (isDarkMode === true) {
        on();
    } else {
        off();
    }

    element.addEventListener("click", () => toggle());
}

export function setupKeyboardVisibility(element: HTMLButtonElement) {
    let isKeyboardVisible =
        localStorage.getItem("isKeyboardVisible") === null
            ? null
            : localStorage.getItem("isKeyboardVisible") === "true";

    const checkboxContainer = document.querySelector(
        ".settings-checkbox-container"
    )!;
    const highlight = document.querySelector("#settings-highlight")!;

    function on() {
        isKeyboardVisible = true;
        document.querySelector(".keyboard")!.classList.add("show");
        element.textContent = "keyboard_off";

        checkboxContainer.classList.remove("disabled");
        if (highlight.hasAttribute("disabled")) {
            highlight.attributes.removeNamedItem("disabled");
        }
    }

    function off() {
        isKeyboardVisible = false;
        document.querySelector(".keyboard")!.classList.remove("show");
        element.textContent = "keyboard";

        checkboxContainer.classList.add("disabled");
        highlight.attributes.setNamedItem(document.createAttribute("disabled"));
    }

    function toggle() {
        if (isKeyboardVisible === true) {
            localStorage.setItem("isKeyboardVisible", "false");
            off();
        } else {
            localStorage.setItem("isKeyboardVisible", "true");
            on();
        }
    }

    if (isKeyboardVisible === null) {
        on();
    } else if (isKeyboardVisible === true) {
        on();
    } else {
        off();
    }

    element.addEventListener("click", () => toggle());
}

export default class Settings {
    readonly sizeMax = 256;
    readonly sizeMin = 1;
    readonly element = document.querySelector(".settings")!;
    readonly initialSize = 64;
    readonly initialHighlight = false;
    readonly initialText =
        "Touch typing (also called blind typing, or touch keyboarding) is a style of typing. Although the phrase refers to typing without using the sense of sight to find the keys - specifically, a touch typist will know their location on the keyboard through muscle memory - the term is often used to refer to a specific form of touch typing that involves placing the eight fingers in a horizontal row along the middle of the keyboard (the home row) and having them reach for specific other keys. (Under this usage, typists who do not look at the keyboard but do not use home row either are referred to as hybrid typists.) Both two-handed touch typing and one-handed touch typing are possible.";
    readonly statInterval = 32;

    constructor() {
        document
            .querySelector(".settings-background")!
            .addEventListener("click", () => {
                this.close();
            });

        document
            .querySelector(".settings-toggle")!
            .addEventListener("click", () => {
                this.toggle();
            });

        const highlightElement = document.querySelector<HTMLInputElement>(
            ".settings-highlight"
        );

        highlightElement!.checked = this.highlight;
        highlightElement?.addEventListener("input", () => this.save());

        const sizeElement =
            document.querySelector<HTMLInputElement>(".settings-input");

        sizeElement!.value = this.size.toString();
        sizeElement?.addEventListener("input", () => this.save());

        const textElement =
            document.querySelector<HTMLInputElement>(".settings-textarea");

        textElement!.value = this.text;
        textElement?.addEventListener("input", () => this.save());

        document
            .querySelector(".settings-reset")!
            .addEventListener("click", () => {
                localStorage.removeItem("highlight");
                highlightElement!.checked = this.initialHighlight;
                this.highlight = this.initialHighlight;

                localStorage.removeItem("size");
                sizeElement!.value = this.initialSize.toString();
                this.size = this.initialSize;

                localStorage.removeItem("text");
                textElement!.value = this.initialText;
                this.text = this.initialText;

                ui.text.reset();
                ui.text.render();
            });

        this.element
            .querySelector<HTMLFormElement>(".settings-form")!
            .addEventListener("submit", (event) => {
                event.preventDefault();
                this.close();
            });
    }

    get highlight() {
        const highlight = localStorage.getItem("highlight");
        if (highlight === null) {
            return this.initialHighlight;
        } else if (highlight === "true") {
            return true;
        } else if (highlight === "false") {
            return false;
        } else {
            throw new Error("Invalid value for highlight");
        }
    }

    set highlight(value: boolean) {
        localStorage.setItem("highlight", value ? "true" : "false");
    }

    get size() {
        const size = localStorage.getItem("size");
        if (size === null) {
            return this.initialSize;
        } else if (Number.isFinite(Number.parseInt(size, 10))) {
            return Number.parseInt(size, 10);
        } else {
            throw new Error("Invalid value for size");
        }
    }

    set size(value: number) {
        if (!Number.isFinite(value)) {
            value = this.initialSize;
        }
        if (value < this.sizeMin) {
            value = this.sizeMin;
        } else if (value > this.sizeMax) {
            value = this.sizeMax;
        } else if (value > this.text!.length) {
            value = this.text!.length;
        }
        localStorage.setItem("size", value.toString());
    }

    get text() {
        const text = localStorage.getItem("text");
        if (text === null || text.length === 0) {
            return this.initialText;
        }
        return text;
    }

    set text(value: string) {
        value = value.replace(/[\n]+/g, " ").replace(/[^ -~]+/g, "");
        if (value.length === 0) {
            value = this.initialText;
        }
        localStorage.setItem("text", value);
    }

    close() {
        this.element.classList.remove("show");
    }

    isOpen() {
        return this.element.classList.contains("show");
    }

    toggle() {
        this.element.classList.toggle("show");
    }

    save() {
        const highlightElement = document.querySelector<HTMLInputElement>(
            ".settings-highlight"
        );

        this.highlight = highlightElement!.checked;

        const sizeElement =
            document.querySelector<HTMLInputElement>(".settings-input");

        this.size = Number.parseInt(sizeElement!.value, 10);

        const textElement =
            document.querySelector<HTMLInputElement>(".settings-textarea");

        this.text = textElement!.value;

        ui.text.reset();
        ui.text.render();
    }
}
