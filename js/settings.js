export { Settings };

import { Draggable } from './draggable.js';
import { Text } from './text.js';

class Settings {
    constructor(text) {
        this.text = text;

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

            this.text.reset(newCustomText, newChunkSize);
            this.text.render();

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

        const settingsNewsListToggleContainer = document.getElementById('settings-news-list-toggle-container');

        const customTextFetchNumberMax = 128;
        const customTextFetchNumberMin = 1;

        const settingsNewsListContainer = document.createElement('div');

        settingsNewsListContainer.classList.add('settings-list-container');

        const settingsNewsListTitle = document.createElement('div');

        settingsNewsListTitle.classList.add('settings-list-title');

        settingsNewsListTitle.appendChild(document.createTextNode('Number of news items'));

        settingsNewsListContainer.appendChild(settingsNewsListTitle);

        const settingsNewsList = document.createElement('div');

        settingsNewsList.classList.add('settings-list');

        settingsNewsListContainer.appendChild(settingsNewsList);

        const settingsNewsListToggleIcon = document.getElementById('settings-news-list-toggle-icon');

        const settingsNewsListToggle = document.getElementById('settings-news-list-toggle');

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

        settingsNewsListToggleContainer.appendChild(settingsNewsListContainer);

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

        const settingsChunkSizeListToggleContainer = document.getElementById('settings-chunk-size-list-toggle-container');

        const settingsChunkSizeListContainer = document.createElement('div');

        settingsChunkSizeListContainer.classList.add('settings-list-container');

        const settingsChunkSizeListTitle = document.createElement('div');

        settingsChunkSizeListTitle.classList.add('settings-list-title');

        settingsChunkSizeListTitle.appendChild(document.createTextNode('Number of characters per screen'));

        settingsChunkSizeListContainer.appendChild(settingsChunkSizeListTitle);

        const settingsChunkSizeList = document.createElement('div');

        settingsChunkSizeList.classList.add('settings-list');

        settingsChunkSizeListContainer.appendChild(settingsChunkSizeList);

        const settingsChunkSizeListToggleIcon = document.getElementById('settings-chunk-size-list-toggle-icon');

        const settingsChunkSizeListToggle = document.getElementById('settings-chunk-size-list-toggle');

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

        settingsChunkSizeListToggleContainer.appendChild(settingsChunkSizeListContainer);

        const settingsSave = document.getElementById('settings-save');

        settingsSave.addEventListener('click', () => {
            settingsForm.requestSubmit();
        });
    }

    toggle = () => {
        this.settings.classList.toggle('settings-show');
    }
}
