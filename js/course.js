export { Course };

import { Settings } from './settings.js';
import { lessonGenerate, permutations, randomNWordsContaining, shuffle } from './helpers.js';
import { words } from './words.js';

class Course {
    constructor(text) {
        this.text = text;

        this.reset();

        this.lessonElements = document.getElementsByClassName('lesson');

        for (const lessonElement of this.lessonElements) {
            const index = parseInt(lessonElement.dataset.index);
            if (index !== -1) {
                lessonElement.dataset.chars = [...Course.english[index].newChars].join(' ');
            }

            lessonElement.addEventListener('click', event => {
                this.currentLesson().classList.remove('lesson-current');
                event.target.classList.add('lesson-current');

                const index = parseInt(event.target.dataset.index);

                if (index === -1) {
                    this.reset();
                    this.text.reset(Settings.text, Settings.chunkSize)
                } else {
                    this.sublesson = 'newChars';

                    this.renderSublessonName(this.sublesson);

                    this.text.reset(
                        Course.english[index].newChars,
                        Course.chunkSize
                    );
                }

                this.text.render();
            });
        }

        for (let i = 0; i < Course.english.length; ++i) {
            Course.english[i].newAndPreviousChars = lessonGenerate(
                Course.english.slice(0, i + 1).map(elem => elem.newChars).join('')
            );
        }

        for (let i = 0; i < 7; ++i) {
            Course.english[i].wordsContainingNewAndPreviousChars =
                randomNWordsContaining(20, words, Course.english[i].newAndPreviousChars);
        }

        for (let i = 0; i < Course.english.length; ++i) {
            Course.english[i].newChars =
                shuffle(permutations(Course.english[i].newChars)).join(' ');
        }
    }

    clearSublessonName = () => {
        document.getElementById('sublesson-number').textContent = '';
        document.getElementById('sublesson-name').textContent = '';
    }

    currentLesson = () => {
        return document.getElementsByClassName('lesson-current')[0];
    }

    currentLessonIndex = () => {
        return parseInt(this.currentLesson().dataset.index);
    }

    nextLesson = () => {
        const index = this.currentLessonIndex();

        if (this.sublesson === 'newChars') {
            this.sublesson = 'newAndPreviousChars';

            setTimeout(() => {
                this.renderSublessonName(this.sublesson);
            }, 800);

            this.text.reset(
                Course.english[index].newAndPreviousChars,
                Math.min(Course.chunkSize, Course.english[index].newAndPreviousChars.length)
            );

            setTimeout(() => {
                this.text.render();
            }, 800);

            return;
        } else if (this.sublesson === 'newAndPreviousChars') {
            this.sublesson = 'wordsContainingNewAndPreviousChars';

            if (!Course.english[index].wordsContainingNewAndPreviousChars) {
                this.nextLesson();
                return;
            }

            setTimeout(() => {
                this.renderSublessonName(this.sublesson);
            }, 800);

            this.text.reset(
                Course.english[index].wordsContainingNewAndPreviousChars,
                Course.english[index].wordsContainingNewAndPreviousChars.length
            );

            setTimeout(() => {
                this.text.render();
            }, 800);

            return;
        }

        let nextLessonElement = null;

        if (index >= 0 && index < Course.english.length - 1) {
            nextLessonElement = this.currentLesson().nextElementSibling;
        } else {
            nextLessonElement = this.lessonElements[0];
        }

        setTimeout(() => {
            nextLessonElement.click();
        }, 800);
    }

    renderSublessonName = sublesson => {
        const index = this.currentLessonIndex();
        const sublessonDescription =
            Course.sublessonPropertyNameToDescription[sublesson];

        let sublessonDescriptionIndex = 1;

        if (index === 0) {
            if (sublessonDescription.length === 3) {
                sublessonDescriptionIndex = 2;
            }
        }

        document.getElementById('sublesson-number').textContent =
            `Lesson ${index + 1}.${sublessonDescription[0]}`;
        document.getElementById('sublesson-name').textContent =
            `${sublessonDescription[sublessonDescriptionIndex]}`;
    }

    reset = () => {
        this.sublesson = '';
        this.clearSublessonName();
    }

    static chunkSize = 34;
    static english = [
        { newChars: 'etao' },
        { newChars: 'insh' },
        { newChars: 'rdlc' },
        { newChars: 'umwf' },
        { newChars: 'gypb' },
        { newChars: 'vkjx' },
        { newChars: 'qz49' },
        { newChars: '1527' },
        { newChars: '3860' },
        { newChars: '([.+' },
        { newChars: ':><`' },
        { newChars: '\',/"' },
        { newChars: ';{?-' },
        { newChars: '~@_}' },
        { newChars: ')$^!' },
        { newChars: '|#=&' },
        { newChars: ']%*\\'}
    ];
    static sublessonPropertyNameToDescription = {
        newChars: [
            'A',
            'New characters'
        ],
        newAndPreviousChars: [
            'B',
            'Randomized new and previous characters',
            'Randomized new characters'
        ],
        wordsContainingNewAndPreviousChars: [
            'C',
            'Words containing new and previous characters',
            'Words containing new characters'
        ]
    };
}
