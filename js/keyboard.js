export { Keyboard };

import { Settings } from './settings.js';

class Keyboard {
    constructor() {
        this.keyboardElement = document.getElementById('keyboard');
        this.keyElements = document.getElementsByClassName('keyboard-key');
        this.capsIndicatorElement = document.getElementById('keyboard-key-caps-indicator');
        this.shifts = document.getElementsByClassName('keyboard-key-shift');
    }

    capsOn = () => {
        this.capsIndicatorElement.classList.add('keyboard-key-caps-indicator-active');
    }

    capsOff = () => {
        this.capsIndicatorElement.classList.remove('keyboard-key-caps-indicator-active');
    }

    guideOn = () => {
        this.keyboardElement.classList.add('keyboard-guide-show');
    }

    guideOff = () => {
        this.keyboardElement.classList.remove('keyboard-guide-show');
    }

    highlightKeysToPressFor = key => {
        const highlightedKeyElements = [
            ...document.getElementsByClassName('keyboard-key-highlight'),
            ...document.getElementsByClassName('keyboard-key-text-highlight')
        ];

        for (const highlightedKeyElement of highlightedKeyElements) {
            highlightedKeyElement.classList.remove('keyboard-key-highlight');
            highlightedKeyElement.classList.remove('keyboard-key-text-highlight');
        }

        const lessonCurrentElement = document.getElementsByClassName('lesson-current')[0];

        if (lessonCurrentElement.dataset.index === '-1') {
            if (!Settings.highlight) {
                return;
            }
        }

        for (const keyElement of this.keyElements) {
            if (keyElement.dataset.value === key ||
                    keyElement.dataset.valueAlt === key) {
                keyElement.classList.add('keyboard-key-highlight');

                if (keyElement.dataset.value === key) {
                    keyElement.classList.add('keyboard-key-text-highlight');
                } else {
                    try {
                        keyElement.getElementsByClassName('keyboard-key-alt')[0]
                            .classList.add('keyboard-key-text-highlight');
                    } catch (e) {
                        keyElement.classList.add('keyboard-key-text-highlight');
                    }

                    if (keyElement.classList.contains('keyboard-key-lpinkie') ||
                            keyElement.classList.contains('keyboard-key-lring') ||
                            keyElement.classList.contains('keyboard-key-lmiddle') ||
                            keyElement.classList.contains('keyboard-key-lindex')) {
                        this.shifts[1].classList.add('keyboard-key-highlight', 'keyboard-key-text-highlight');
                    } else {
                        this.shifts[0].classList.add('keyboard-key-highlight', 'keyboard-key-text-highlight');
                    }
                }

                break;
            }
        }
    }

    press = key => {
        for (const keyElement of this.keyElements) {
            if (keyElement.dataset.value === key ||
                    keyElement.dataset.valueAlt === key) {
                keyElement.classList.add('keyboard-key-keydown');

                setTimeout(() => {
                    keyElement.classList.remove('keyboard-key-keydown');
                }, 100);
            }
            break;
        }
    }
}
