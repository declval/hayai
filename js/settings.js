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

                if (!isNaN(newChunkSize) && newChunkSize >= Text.chunkSizeMin && newChunkSize <= Text.chunkSizeMax && newChunkSize <= newCustomText.length) {
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

        const settingsChunkSize = this.settings.getElementsByClassName('settings-chunk-size')[0];

        settingsChunkSize.setAttribute('placeholder', settingsChunkSize.getAttribute('placeholder') + ` (${Text.chunkSizeMin} to ${Text.chunkSizeMax})`);
    }

    toggle() {
        this.settings.classList.toggle('settings-show');
    }
}
