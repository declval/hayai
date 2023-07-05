export { Course };

import { Settings } from './settings.js';
import { lessonGenerate, permutations, randomNWordsContaining, shuffle } from './helpers.js';
import { words } from './words.js';

class Course {
    constructor(text) {
        this.text = text;

        this.reset();

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

        this.lessons = document.getElementsByClassName('lesson');

        for (const lesson of this.lessons) {
            lesson.addEventListener('click', event => {
                this.currentLesson().classList.remove('lesson-current');
                event.target.classList.add('lesson-current');

                const index = parseInt(event.target.dataset.index);

                if (index === -1) {
                    this.reset();

                    if (Settings.chunkSize && Settings.text) {
                        this.text.reset(Settings.text, Settings.chunkSize)
                    } else {
                        this.text.reset();
                    }
                } else {
                    this.sublesson = 'newChars';

                    this.renderSublessonName();

                    this.text.reset(
                        Course.english[index].newChars,
                        Course.chunkSize
                    );
                }

                this.text.render();
            });
        }
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
                this.renderSublessonName();
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
                this.renderSublessonName();
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

        let nextLesson = null;

        if (index >= 0 && index < Course.english.length - 1) {
            nextLesson = this.currentLesson().nextElementSibling;
        } else {
            nextLesson = this.lessons[0];
        }

        setTimeout(() => {
            nextLesson.click();
        }, 800);
    }

    clearSublessonName = () => {
        document.getElementById('sublesson-number').textContent = '';
        document.getElementById('sublesson-name').textContent = '';
    }

    renderSublessonName = () => {
        const index = this.currentLessonIndex();

        const sublessonDescription =
            [...Course.sublessonPropertyNameToDescription[this.sublesson]];
        if (index === 0) {
            if (this.sublesson === 'newAndPreviousChars') {
                sublessonDescription[1] = 'Randomized new characters';
            } else if (this.sublesson === 'wordsContainingNewAndPreviousChars') {
                sublessonDescription[1] = 'Words containing new characters';
            }
        }
        document.getElementById('sublesson-number').textContent =
            `Lesson ${index + 1}.${sublessonDescription[0]}`;
        document.getElementById('sublesson-name').textContent =
            `${sublessonDescription[1]}`;
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
        newChars: ['A', 'New characters'],
        newAndPreviousChars: ['B', 'Randomized new and previous characters'],
        wordsContainingNewAndPreviousChars: ['C', 'Words containing new and previous characters']
    };
}
