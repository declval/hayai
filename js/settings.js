export { Settings };

import { Draggable } from './draggable.js';
import { Text } from './text.js';
import { createElement } from './helpers.js';
import { keyboard } from './main.js';

class Settings {
    constructor() {
        this.mediaQuery = window.matchMedia('(max-width: 900px)');
        this.settingsElement = document.getElementById('settings');

        const settingsTitleBarElement = document.getElementById('settings-title-bar');

        const draggable = new Draggable(settingsTitleBarElement, this.settingsElement);

        const mediaQueryHandler = event => {
            if (event.matches) {
                draggable.deactivate();
            } else {
                draggable.activate();
            }
        };

        this.mediaQuery.addEventListener('change', mediaQueryHandler);

        mediaQueryHandler(this.mediaQuery);

        const settingsCloseElement = document.getElementById('settings-close');

        settingsCloseElement.addEventListener('click', () => {
            this.toggle();
        });

        const settingsFormElement = document.getElementById('settings-form');

        settingsFormElement.addEventListener('submit', event => {
            event.preventDefault();

            const chunkSizeElement = document.getElementById('settings-chunk-size-list-toggle');

            if (!chunkSizeElement.textContent.length) {
                return;
            }

            const newChunkSize = parseInt(chunkSizeElement.textContent, 10);

            if (!(Number.isFinite(newChunkSize) &&
                    newChunkSize >= Text.chunkSizeMin &&
                    newChunkSize <= Text.chunkSizeMax)) {
                return;
            }

            const customTextElement = document.getElementById('settings-custom-text');
            const newCustomText = customTextElement.value.replace(/\n/g, ' ');

            Settings.chunkSize = newChunkSize;
            Settings.text = newCustomText;

            document.getElementsByClassName('lesson')[0].click();

            this.toggle();
        });

        const settingsGuideElement = document.getElementById('settings-guide');

        const guide = localStorage.getItem('guide');

        if (guide === 'on') {
            keyboard.guideOn();
            settingsGuideElement.checked = true;
        }

        settingsGuideElement.addEventListener('input', event => {
            if (event.target.checked) {
                keyboard.guideOn();
                localStorage.setItem('guide', 'on');
            } else {
                keyboard.guideOff();
                localStorage.setItem('guide', '');
            }
        });

        const settingsHighlightElement = document.getElementById('settings-highlight');

        const highlight = localStorage.getItem('highlight');

        if (highlight === 'on') {
            Settings.highlight = true;
            settingsHighlightElement.checked = true;
        }

        settingsHighlightElement.addEventListener('input', event => {
            if (event.target.checked) {
                Settings.highlight = true;
                localStorage.setItem('highlight', 'on');
            } else {
                Settings.highlight = false;
                localStorage.setItem('highlight', '');
            }
            const cursorElement = document.getElementsByClassName('text-character-cursor')[0];
            keyboard.highlightKeysToPressFor(cursorElement.textContent);
        });

        const settingsNewsListToggleIconElement =
            document.getElementById('settings-news-list-toggle-icon');
        const settingsNewsListToggleElement =
            document.getElementById('settings-news-list-toggle');
        const settingsNewsListContainerElement =
            document.getElementById('settings-news-list-container');
        const settingsNewsListElement =
            document.getElementById('settings-news-list');

        settingsNewsListToggleElement.addEventListener('click', event => {
            event.stopPropagation();

            const close = event => {
                if (event.target !== settingsNewsListContainerElement) {
                    document.removeEventListener('click', close);
                    settingsNewsListContainerElement.classList.remove('open');
                    settingsNewsListToggleIconElement.textContent = 'keyboard_arrow_up';
                }
            };

            if (settingsNewsListContainerElement.classList.contains('open')) {
                document.removeEventListener('click', close);
                settingsNewsListContainerElement.classList.remove('open');
                settingsNewsListToggleIconElement.textContent = 'keyboard_arrow_up';
            } else {
                for (const settingsListContainer of
                        document.getElementsByClassName('settings-list-container')) {
                    settingsListContainer.classList.remove('open');
                }
                for (const settingsListToggleIcon of
                        document.getElementsByClassName('settings-list-toggle-icon')) {
                    settingsListToggleIcon.textContent = 'keyboard_arrow_up';
                }
                document.addEventListener('click', close);
                settingsNewsListContainerElement.classList.add('open');
                settingsNewsListElement.scrollTop = 0;
                settingsNewsListToggleIconElement.textContent = 'keyboard_arrow_down';
            }
        });

        const customTextFetchNumberMax = 128;
        const customTextFetchNumberMin = 1;

        for (let i = customTextFetchNumberMin; i <= customTextFetchNumberMax; ++i) {
            const buttonElement = createElement({
                name: 'button',
                text: i.toString(),
                attributes: [['type', 'button']],
                eventHandlers: [['click', () => {
                    settingsNewsListContainerElement.classList.remove('open');
                    settingsNewsListToggleElement.textContent = i.toString();
                }]]
            });
            settingsNewsListElement.appendChild(buttonElement);
        }

        const settingsCustomTextFetchButtonElement =
            document.getElementById('settings-custom-text-fetch-button');

        settingsCustomTextFetchButtonElement.addEventListener('click', async event => {
            event.preventDefault();

            if (!settingsNewsListToggleElement.textContent.length) {
                return;
            }

            const customTextFetchNumber = parseInt(settingsNewsListToggleElement.textContent, 10);

            if (!(Number.isFinite(customTextFetchNumber) &&
                    customTextFetchNumber >= customTextFetchNumberMin &&
                    customTextFetchNumber <= customTextFetchNumberMax)) {
                return;
            }

            event.target.classList.add('settings-custom-text-fetch-button-waiting');

            let articles = null;

            try {
                const url = `https://api.spaceflightnewsapi.net/v4/articles?limit=${customTextFetchNumber}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed fetching data from ${url}`);
                }
                articles = await response.json();
            } catch (e) {
                console.log(e);
                event.target.classList.remove('settings-custom-text-fetch-button-waiting');
                return;
            }

            event.target.classList.remove('settings-custom-text-fetch-button-waiting');

            let customText = '';

            for (const [i, article] of articles.results.entries()) {
                customText += article.summary.trim();
                customText += i < articles.results.length - 1 ? '\n' : '';
            }

            const settingsCustomTextElement = document.getElementById('settings-custom-text');

            settingsCustomTextElement.value = customText;
        });

        const settingsChunkSizeListToggleIconElement =
            document.getElementById('settings-chunk-size-list-toggle-icon');
        const settingsChunkSizeListToggleElement =
            document.getElementById('settings-chunk-size-list-toggle');
        const settingsChunkSizeListContainerElement =
            document.getElementById('settings-chunk-size-list-container');
        const settingsChunkSizeListElement =
            document.getElementById('settings-chunk-size-list');

        settingsChunkSizeListToggleElement.addEventListener('click', event => {
            event.stopPropagation();

            const close = event => {
                if (event.target !== settingsChunkSizeListContainerElement) {
                    document.removeEventListener('click', close);
                    settingsChunkSizeListContainerElement.classList.remove('open');
                    settingsChunkSizeListToggleIconElement.textContent = 'keyboard_arrow_up';
                }
            };

            if (settingsChunkSizeListContainerElement.classList.contains('open')) {
                document.removeEventListener('click', close);
                settingsChunkSizeListContainerElement.classList.remove('open');
                settingsChunkSizeListToggleIconElement.textContent = 'keyboard_arrow_up';
            } else {
                for (const settingsListContainer of
                        document.getElementsByClassName('settings-list-container')) {
                    settingsListContainer.classList.remove('open');
                }
                for (const settingsListToggleIcon of
                        document.getElementsByClassName('settings-list-toggle-icon')) {
                    settingsListToggleIcon.textContent = 'keyboard_arrow_up';
                }
                document.addEventListener('click', close);
                settingsChunkSizeListContainerElement.classList.add('open');
                settingsChunkSizeListElement.scrollTop = 0;
                settingsChunkSizeListToggleIconElement.textContent = 'keyboard_arrow_down';
            }
        });

        for (let i = Text.chunkSizeMin; i <= Text.chunkSizeMax; ++i) {
            const buttonElement = createElement({
                name: 'button',
                text: i.toString(),
                attributes: [['type', 'button']],
                eventHandlers: [['click', () => {
                    settingsChunkSizeListContainerElement.classList.remove('open');
                    settingsChunkSizeListToggleElement.textContent = i.toString();
                }]]
            });
            settingsChunkSizeListElement.appendChild(buttonElement);
        }

        const settingsSaveElement = document.getElementById('settings-save');

        settingsSaveElement.addEventListener('click', () => {
            settingsFormElement.requestSubmit();
        });
    }

    close = () => {
        this.settingsElement.classList.remove('settings-show');
    }

    shown = () => {
        return this.settingsElement.classList.contains('settings-show');
    }

    toggle = () => {
        this.settingsElement.classList.toggle('settings-show');
    }

    static chunkSize = null;
    static highlight = false;
    static text = null;
}
