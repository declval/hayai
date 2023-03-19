import { open } from 'node:fs/promises';

import { Text } from './text.js';

beforeEach(async function () {
    return open('index.html')
        .then(function (fileHandle) {
            const result = fileHandle.readFile('UTF-8');
            fileHandle.close();
            return result;
        })
        .then(function (buffer) {
            document.body.innerHTML = buffer.replace(/.*<body>/s, '').replace(/<\/body>.*/s, '');
        });
});

describe('Text class', function () {
    test('constructor with an empty text throws an error', function () {
        expect(function () {
            new Text('', 1);
        }).toThrow('Invalid text length');
    });

    test('constructor with a chunk size less than a minimum chunk size throws an error', function () {
        expect(function () {
            new Text('text', Text.chunkSizeMin - 1);
        }).toThrow('Invalid chunk size');
    });

    test('constructor with a chunk size greater than a maximum chunk size throws an error', function () {
        expect(function () {
            new Text('text', Text.chunkSizeMax + 1);
        }).toThrow('Invalid chunk size');
    });

    test('constructor with a chunk size greater than a text length throws an error', function () {
        expect(function () {
            new Text('text', 16);
        }).toThrow('Invalid chunk size');
    });

    test('method clear removes HTML elements', function () {
        const text = new Text('text', 4);

        text.render();
        text.clear();

        const textElement = document.getElementsByClassName('text')[0];

        expect(textElement.innerHTML).toStrictEqual('');
    });

    test('method cursorMove advances the cursor', function () {
        const text = new Text(' text', 4);

        text.render();

        text.cursorMove(' ');
        text.cursorMove('t');
        text.cursorMove('t');

        const textElement = document.getElementsByClassName('text')[0];

        expect(textElement.innerHTML).toStrictEqual(
            '<div class="text-character text-character-space text-character-correct"> </div>' +
            '<div class="text-character text-character-correct">t</div>' +
            '<div class="text-character text-character-incorrect">e</div>' +
            '<div class="text-character text-character-cursor">x</div>'
        );
    });

    test('method cursorMove advances the cursor past the current chunk', function () {
        const text = new Text('text', 2);

        text.render();

        text.cursorMove('t');
        text.cursorMove('e');

        const textElement = document.getElementsByClassName('text')[0];

        expect(textElement.innerHTML).toStrictEqual(
            '<div class="text-character text-character-cursor">x</div>' +
            '<div class="text-character">t</div>'
        );
    });

    test('method cursorMove advances the cursor past the last chunk', function (done) {
        const text = new Text('text', 2);

        text.render();

        text.cursorMove('t');
        text.cursorMove('e');
        text.cursorMove('x');
        text.cursorMove('t');

        const textElement = document.getElementsByClassName('text')[0];

        expect(textElement.innerHTML).toStrictEqual(
            '<div class="text-character text-character-correct">x</div>' +
            '<div class="text-character text-character-correct">t</div>'
        );

        setTimeout(function () {
            expect(textElement.innerHTML).toStrictEqual(
                '<div class="text-character text-character-cursor">t</div>' +
                '<div class="text-character">e</div>'
            );
            done();
        }, 800);
    });

    test('method render creates HTML elements', function () {
        const text = new Text('text', 2);

        text.render();

        const textElement = document.getElementsByClassName('text')[0];

        expect(textElement.innerHTML).toStrictEqual(
            '<div class="text-character text-character-cursor">t</div>' +
            '<div class="text-character">e</div>'
        );
    });

    test('generator method chunked works correcty with a chunk size less than text length', function () {
        const text = new Text('text', 3);

        expect([...text.chunked()]).toStrictEqual(['tex', 't']);
    });

    test('generator method chunked works correcty with a chunk size equal to text length', function () {
        const text = new Text('text', 4);

        expect([...text.chunked()]).toStrictEqual(['text']);
    });

    test('count of correct characters is as expected', function () {
        const text = new Text('text', 4);

        text.render();

        text.cursorMove('t');
        text.cursorMove('a');
        text.cursorMove('x');
        text.cursorMove('t');

        expect(text.nCorrect).toBe(3);
    });

    test('count of incorrect characters is as expected', function () {
        const text = new Text('text', 4);

        text.render();

        text.cursorMove('t');
        text.cursorMove('a');
        text.cursorMove('x');
        text.cursorMove('t');

        expect(text.nIncorrect).toBe(1);
    });
});
