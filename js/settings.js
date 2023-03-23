export { Settings };

import { Text } from './text.js';
import { draggable } from './draggable.js';

class Settings {
    constructor(text) {
        this.text = text;

        this.settings = document.getElementsByClassName('settings')[0];

        const settingsTitlebar = this.settings.getElementsByClassName('settings-title-bar')[0];

        draggable(settingsTitlebar, this.settings);

        const settingsClose = this.settings.getElementsByClassName('settings-close')[0];

        const that = this;

        settingsClose.addEventListener('click', function () {
            that.toggle();
        });

        const settingsForm = this.settings.getElementsByClassName('settings-form')[0];

        settingsForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let errors = false;

            const customText = that.settings.getElementsByClassName('settings-custom-text')[0];
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

            const chunkSize = that.settings.getElementsByClassName('settings-chunk-size')[0];
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

        const settingsCustomText = this.settings.getElementsByClassName('settings-custom-text')[0];

        const settingsCustomTextFetchNumber = this.settings.getElementsByClassName('settings-custom-text-fetch-number')[0];

        const customTextFetchNumberMax = 128;
        const customTextFetchNumberMin = 1;

        settingsCustomTextFetchNumber.setAttribute('placeholder', settingsCustomTextFetchNumber.getAttribute('placeholder') + ` (${customTextFetchNumberMin} to ${customTextFetchNumberMax})`);

        const settingsCustomTextFetchButton = this.settings.getElementsByClassName('settings-custom-text-fetch-button')[0];

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

        const settingsCustomTextClearButton = this.settings.getElementsByClassName('settings-custom-text-clear-button')[0];

        settingsCustomTextClearButton.addEventListener('click', function (event) {
            event.preventDefault();

            settingsCustomText.value = '';
        });

        const settingsChunkSize = this.settings.getElementsByClassName('settings-chunk-size')[0];

        settingsChunkSize.setAttribute('placeholder', settingsChunkSize.getAttribute('placeholder') + ` (${Text.chunkSizeMin} to ${Text.chunkSizeMax})`);
    }

    toggle() {
        this.settings.classList.toggle('settings-show');
    }
}
