export { Settings };

import { Text } from './text.js';
import { draggable } from './draggable.js';

class Settings {
    constructor(text) {
        this.text = text;

        this.settings = document.getElementById('settings');

        const settingsTitlebar = document.getElementById('settings-title-bar');

        draggable(settingsTitlebar, this.settings);

        const settingsClose = document.getElementById('settings-close');

        const that = this;

        settingsClose.addEventListener('click', function () {
            that.toggle();
        });

        const settingsForm = document.getElementById('settings-form');

        settingsForm.addEventListener('submit', function (event) {
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

            that.text.reset(newCustomText, newChunkSize);
            that.text.render();

            that.toggle();
        });

        const settingsCustomText = document.getElementById('settings-custom-text');

        const settingsCustomTextFetchNumber = document.getElementById('settings-custom-text-fetch-number');

        const customTextFetchNumberMax = 128;
        const customTextFetchNumberMin = 1;

        settingsCustomTextFetchNumber.setAttribute('placeholder', settingsCustomTextFetchNumber.getAttribute('placeholder') + ` (${customTextFetchNumberMin} to ${customTextFetchNumberMax})`);

        const settingsCustomTextFetchButton = document.getElementById('settings-custom-text-fetch-button');

        settingsCustomTextFetchButton.addEventListener('click', async function (event) {
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

            const response = await fetch(`https://api.spaceflightnewsapi.net/v3/articles?_limit=${customTextFetchNumber}`);
            const articles = await response.json();

            let customText = '';

            for (const [i, article] of articles.entries()) {
                customText += article.title.trim();
                customText += i < articles.length - 1 ? '\n' : '';
            }

            settingsCustomText.value = customText;
        });

        const settingsCustomTextClearButton = document.getElementById('settings-custom-text-clear-button');

        settingsCustomTextClearButton.addEventListener('click', function (event) {
            event.preventDefault();

            settingsCustomText.value = '';
        });

        const settingsChunkSize = document.getElementById('settings-chunk-size');

        settingsChunkSize.setAttribute('placeholder', settingsChunkSize.getAttribute('placeholder') + ` (${Text.chunkSizeMin} to ${Text.chunkSizeMax})`);

        const settingsSave = document.getElementById('settings-save');

        settingsSave.addEventListener('click', function () {
            settingsForm.requestSubmit();
        });
    }

    toggle() {
        this.settings.classList.toggle('settings-show');
    }
}
