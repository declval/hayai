import Settings from "./settings.ts";

export default class Keyboard {
    readonly #keys;
    readonly #lshift;
    readonly #rshift;
    readonly #lctrl;
    readonly #rctrl;
    readonly #lalt;
    readonly #ralt;
    readonly #rightShiftKeys;
    readonly #settings;

    constructor(settings: Settings) {
        const element = document.querySelector(".keyboard")!;

        this.#keys = element.querySelectorAll<HTMLDivElement>(".keyboard-key");
        this.#lshift = element.querySelector(".keyboard-key-lshift")!;
        this.#rshift = element.querySelector(".keyboard-key-rshift")!;
        this.#lctrl = element.querySelector(".keyboard-key-lctrl")!;
        this.#rctrl = element.querySelector(".keyboard-key-rctrl")!;
        this.#lalt = element.querySelector(".keyboard-key-lalt")!;
        this.#ralt = element.querySelector(".keyboard-key-ralt")!;
        this.#rightShiftKeys = new Set("~!@#$%QWERTASDFGZXCVB");
        this.#settings = settings;
    }

    highlightNext() {
        for (let i = 0; i < this.#keys.length; ++i) {
            this.#keys[i].classList.remove("keyboard-key-highlight");
        }

        if (!this.#settings.highlight) {
            return;
        }

        const key = document.querySelector(
            ".text-character-cursor"
        )?.textContent!;

        for (let i = 0; i < this.#keys.length; ++i) {
            if (
                this.#keys[i].dataset.value === key ||
                this.#keys[i].dataset.valueAlt === key
            ) {
                this.#keys[i].classList.add("keyboard-key-highlight");
                if (this.#keys[i].dataset.valueAlt === key) {
                    if (this.#rightShiftKeys.has(key)) {
                        this.#rshift.classList.add("keyboard-key-highlight");
                    } else {
                        this.#lshift.classList.add("keyboard-key-highlight");
                    }
                }
            }
        }
    }

    press(event: KeyboardEvent) {
        if (event.key === "Shift") {
            if (event.location === event.DOM_KEY_LOCATION_LEFT) {
                this.#keyDown(this.#lshift);
            } else if (event.location === event.DOM_KEY_LOCATION_RIGHT) {
                this.#keyDown(this.#rshift);
            }
        } else if (event.key === "Control") {
            if (event.location === event.DOM_KEY_LOCATION_LEFT) {
                this.#keyDown(this.#lctrl);
            } else if (event.location === event.DOM_KEY_LOCATION_RIGHT) {
                this.#keyDown(this.#rctrl);
            }
        } else if (event.key === "Alt") {
            if (event.location === event.DOM_KEY_LOCATION_LEFT) {
                this.#keyDown(this.#lalt);
            } else if (event.location === event.DOM_KEY_LOCATION_RIGHT) {
                this.#keyDown(this.#ralt);
            }
        } else {
            for (let i = 0; i < this.#keys.length; ++i) {
                if (
                    this.#keys[i].dataset.value === event.key ||
                    this.#keys[i].dataset.valueAlt === event.key
                ) {
                    this.#keyDown(this.#keys[i]);
                    break;
                }
            }
        }
    }

    #keyDown(element: Element) {
        element.classList.add("keyboard-key-keydown");
        setTimeout(() => {
            element.classList.remove("keyboard-key-keydown");
        }, 400);
    }
}
