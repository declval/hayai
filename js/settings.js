export { Settings };

import { Draggable } from './draggable.js';
import { Text } from './text.js';
import { textAndChunkSize } from './main.js';

class Settings {
    constructor() {
        this.mediaQuery = window.matchMedia('(max-width: 900px)');
        this.settings = document.getElementById('settings');

        const settingsTitlebar = document.getElementById('settings-title-bar');

        const draggable = new Draggable(settingsTitlebar, this.settings);

        const mediaQueryHandler = event => {
            if (event.matches) {
                draggable.deactivate();
            } else {
                draggable.activate();
            }
        };

        this.mediaQuery.addEventListener('change', mediaQueryHandler);

        mediaQueryHandler(this.mediaQuery);

        const settingsClose = document.getElementById('settings-close');

        settingsClose.addEventListener('click', () => {
            this.toggle();
        });

        const settingsForm = document.getElementById('settings-form');

        settingsForm.addEventListener('submit', event => {
            event.preventDefault();

            let errors = false;

            const customText = document.getElementById('settings-custom-text');
            let newCustomText = '';

            if (customText.value.length) {
                newCustomText = customText.value.replace(/[^ -~]+/g, '');

                if (newCustomText.length) {
                    customText.classList.remove('settings-invalid');
                } else {
                    customText.classList.add('settings-invalid');
                    errors = true;
                }
            } else {
                customText.classList.add('settings-invalid');
                errors = true;
            }

            if (errors) {
                return;
            }

            const chunkSize = document.getElementById('settings-chunk-size-list-toggle');
            let newChunkSize = null;

            if (!chunkSize.textContent.length) {
                return;
            }

            newChunkSize = parseInt(chunkSize.textContent, 10);

            if (!(Number.isFinite(newChunkSize) &&
                    newChunkSize >= Text.chunkSizeMin &&
                    newChunkSize <= Text.chunkSizeMax &&
                    newChunkSize <= newCustomText.length)) {
                return;
            }

            textAndChunkSize.chunkSize = newChunkSize;
            textAndChunkSize.text = newCustomText;

            document.getElementsByClassName('lesson')[0].click();

            this.toggle();
        });

        const keyboard = document.getElementById('keyboard');
        const settingsGuide = document.getElementById('settings-guide');

        const guide = localStorage.getItem('guide');

        if (guide === 'on') {
            keyboard.classList.add('keyboard-guide-show');
            settingsGuide.checked = true;
        }

        settingsGuide.addEventListener('input', event => {
            if (event.target.checked) {
                keyboard.classList.add('keyboard-guide-show');
                localStorage.setItem('guide', 'on');
            } else {
                keyboard.classList.remove('keyboard-guide-show');
                localStorage.setItem('guide', '');
            }
        });

        const settingsCustomText = document.getElementById('settings-custom-text');

        settingsCustomText.addEventListener('input', event => {
            event.target.classList.remove('settings-invalid');
        });

        const settingsNewsListToggleIcon = document.getElementById('settings-news-list-toggle-icon');
        const settingsNewsListToggle = document.getElementById('settings-news-list-toggle');
        const settingsNewsListContainer = document.getElementById('settings-news-list-container');
        const settingsNewsList = document.getElementById('settings-news-list');

        settingsNewsListToggle.addEventListener('click', event => {
            event.stopPropagation();

            const close = event => {
                if (event.target !== settingsNewsListContainer) {
                    document.removeEventListener('click', close);
                    settingsNewsListContainer.classList.remove('open');
                    settingsNewsListToggleIcon.textContent = 'keyboard_arrow_up';
                }
            };

            if (settingsNewsListContainer.classList.contains('open')) {
                document.removeEventListener('click', close);
                settingsNewsListContainer.classList.remove('open');
                settingsNewsListToggleIcon.textContent = 'keyboard_arrow_up';
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
                settingsNewsListContainer.classList.add('open');
                settingsNewsList.scrollTop = 0;
                settingsNewsListToggleIcon.textContent = 'keyboard_arrow_down';
            }
        });

        const customTextFetchNumberMax = 128;
        const customTextFetchNumberMin = 1;

        for (let i = customTextFetchNumberMin; i <= customTextFetchNumberMax; ++i) {
            const button = document.createElement('button');
            button.appendChild(document.createTextNode(i.toString()));
            button.setAttribute('type', 'button');
            button.addEventListener('click', () => {
                settingsNewsListContainer.classList.remove('open');
                settingsNewsListToggle.textContent = i.toString();
            });
            settingsNewsList.appendChild(button);
        }

        const settingsCustomTextFetchButton = document.getElementById('settings-custom-text-fetch-button');

        settingsCustomTextFetchButton.addEventListener('click', async event => {
            event.preventDefault();

            let customTextFetchNumber = null;

            if (!settingsNewsListToggle.textContent.length) {
                return;
            }

            customTextFetchNumber = parseInt(settingsNewsListToggle.textContent, 10);

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

            settingsCustomText.value = customText;
        });

        const settingsChunkSizeListToggleIcon = document.getElementById('settings-chunk-size-list-toggle-icon');
        const settingsChunkSizeListToggle = document.getElementById('settings-chunk-size-list-toggle');
        const settingsChunkSizeListContainer = document.getElementById('settings-chunk-size-list-container');
        const settingsChunkSizeList = document.getElementById('settings-chunk-size-list');

        settingsChunkSizeListToggle.addEventListener('click', event => {
            event.stopPropagation();

            const close = event => {
                if (event.target !== settingsChunkSizeListContainer) {
                    document.removeEventListener('click', close);
                    settingsChunkSizeListContainer.classList.remove('open');
                    settingsChunkSizeListToggleIcon.textContent = 'keyboard_arrow_up';
                }
            };

            if (settingsChunkSizeListContainer.classList.contains('open')) {
                document.removeEventListener('click', close);
                settingsChunkSizeListContainer.classList.remove('open');
                settingsChunkSizeListToggleIcon.textContent = 'keyboard_arrow_up';
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
                settingsChunkSizeListContainer.classList.add('open');
                settingsChunkSizeList.scrollTop = 0;
                settingsChunkSizeListToggleIcon.textContent = 'keyboard_arrow_down';
            }
        });

        for (let i = Text.chunkSizeMin; i <= Text.chunkSizeMax; ++i) {
            const button = document.createElement('button');
            button.appendChild(document.createTextNode(i.toString()));
            button.setAttribute('type', 'button');
            button.addEventListener('click', () => {
                settingsChunkSizeListContainer.classList.remove('open');
                settingsChunkSizeListToggle.textContent = i.toString();
            });
            settingsChunkSizeList.appendChild(button);
        }

        const settingsSave = document.getElementById('settings-save');

        settingsSave.addEventListener('click', () => {
            settingsForm.requestSubmit();
        });
    }

    toggle = () => {
        this.settings.classList.toggle('settings-show');
    }
}
