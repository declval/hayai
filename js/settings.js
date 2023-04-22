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

            const chunkSize = document.getElementById('settings-chunk-size');
            let newChunkSize = null;

            if (chunkSize.value.length) {
                newChunkSize = parseInt(chunkSize.value, 10);

                if (Number.isFinite(newChunkSize) &&
                        newChunkSize >= Text.chunkSizeMin &&
                        newChunkSize <= Text.chunkSizeMax &&
                        newChunkSize <= newCustomText.length) {
                    chunkSize.classList.remove('settings-invalid');
                } else {
                    chunkSize.classList.add('settings-invalid');
                    errors = true;
                }
            } else {
                chunkSize.classList.add('settings-invalid');
                errors = true;
            }

            if (errors) {
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

        const settingsCustomTextFetchNumber = document.getElementById('settings-custom-text-fetch-number');

        const customTextFetchNumberMax = 128;
        const customTextFetchNumberMin = 1;

        settingsCustomTextFetchNumber.setAttribute('placeholder', settingsCustomTextFetchNumber.getAttribute('placeholder') + ` (${customTextFetchNumberMin} to ${customTextFetchNumberMax})`);

        const settingsCustomTextFetchButton = document.getElementById('settings-custom-text-fetch-button');

        settingsCustomTextFetchButton.addEventListener('click', async event => {
            event.preventDefault();

            let errors = false;

            let customTextFetchNumber = null;

            if (settingsCustomTextFetchNumber.value.length) {
                customTextFetchNumber = parseInt(settingsCustomTextFetchNumber.value, 10);

                if (Number.isFinite(customTextFetchNumber) &&
                        customTextFetchNumber >= customTextFetchNumberMin &&
                        customTextFetchNumber <= customTextFetchNumberMax) {
                    settingsCustomTextFetchNumber.classList.remove('settings-invalid');
                } else {
                    settingsCustomTextFetchNumber.classList.add('settings-invalid');
                    errors = true;
                }
            } else {
                settingsCustomTextFetchNumber.classList.add('settings-invalid');
                errors = true;
            }

            if (errors) {
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

        const settingsCustomTextClearButton = document.getElementById('settings-custom-text-clear-button');

        settingsCustomTextClearButton.addEventListener('click', event => {
            event.preventDefault();

            settingsCustomText.value = '';
        });

        const settingsChunkSize = document.getElementById('settings-chunk-size');

        settingsChunkSize.setAttribute('placeholder', settingsChunkSize.getAttribute('placeholder') + ` (${Text.chunkSizeMin} to ${Text.chunkSizeMax})`);

        const settingsSave = document.getElementById('settings-save');

        settingsSave.addEventListener('click', () => {
            settingsForm.requestSubmit();
        });
    }

    toggle = () => {
        this.settings.classList.toggle('settings-show');
    }
}
