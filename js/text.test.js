import { open } from 'node:fs/promises';

import { Text } from './text.js';

beforeEach(async () => {
    return open('index.html')
        .then(fileHandle => {
            const result = fileHandle.readFile('UTF-8');
            fileHandle.close();
            return result;
        })
        .then(buffer => {
            document.body.innerHTML = buffer.replace(/.*<body>/s, '').replace(/<\/body>.*/s, '');
        });
});

describe('Text class', () => {
    test('constructor with text consisting only of unsupported characters throws an error', () => {
        expect(() => {
            new Text({text: 'こんにちは', chunkSize: Text.chunkSizeMin});
        }).toThrow('Invalid text length');
    });

    test('constructor with a chunk size greater than a maximum chunk size throws an error', () => {
        expect(() => {
            new Text({text: 'text', chunkSize: Text.chunkSizeMax + 1});
        }).toThrow('Invalid chunk size');
    });

    test('method clear removes HTML elements', () => {
        const text = new Text({text: 'text', chunkSize: 4});

        text.render();
        text.clear();

        const textElement = document.getElementById('text');

        expect(textElement.innerHTML).toStrictEqual('');
    });

    test('method cursorMove advances the cursor', () => {
        const text = new Text({text: ' text', chunkSize: 4});

        text.render();

        text.cursorMove(' ');
        text.cursorMove('t');
        text.cursorMove('t');

        const textElement = document.getElementById('text');

        expect(textElement.innerHTML).toStrictEqual(
            '<div class="text-character text-character-space text-character-correct"> </div>' +
            '<div class="text-character text-character-correct">t</div>' +
            '<div class="text-character text-character-incorrect">e</div>' +
            '<div class="text-character text-character-cursor">x</div>'
        );
    });

    test('method cursorMove advances the cursor past the current chunk', () => {
        const text = new Text({text: 'text', chunkSize: 2});

        text.render();

        text.cursorMove('t');
        text.cursorMove('e');

        const textElement = document.getElementById('text');

        expect(textElement.innerHTML).toStrictEqual(
            '<div class="text-character text-character-cursor">x</div>' +
            '<div class="text-character">t</div>'
        );
    });

    test('method cursorMove advances the cursor past the last chunk', () => {
        const text = new Text({text: 'text', chunkSize: 2});

        text.render();

        text.cursorMove('t');
        text.cursorMove('e');
        text.cursorMove('x');
        text.cursorMove('t');

        const textElement = document.getElementById('text');

        expect(textElement.innerHTML).toStrictEqual(
            '<div class="text-character text-character-correct">x</div>' +
            '<div class="text-character text-character-correct">t</div>'
        );

        setTimeout(() => {
            expect(textElement.innerHTML).toStrictEqual(
                '<div class="text-character text-character-cursor">t</div>' +
                '<div class="text-character">e</div>'
            );
        }, 800);
    }, 800);

    test('method render creates HTML elements', () => {
        const text = new Text({text: 'text', chunkSize: 2});

        text.render();

        const textElement = document.getElementById('text');

        expect(textElement.innerHTML).toStrictEqual(
            '<div class="text-character text-character-cursor">t</div>' +
            '<div class="text-character">e</div>'
        );
    });

    test('generator method chunked works correcty with a chunk size less than text length', () => {
        const text = new Text({text: 'text', chunkSize: 3});

        expect([...text.chunked()]).toStrictEqual(['tex', 't']);
    });

    test('generator method chunked works correcty with a chunk size equal to text length', () => {
        const text = new Text({text: 'text', chunkSize: 4});

        expect([...text.chunked()]).toStrictEqual(['text']);
    });

    test('count of correct characters is as expected', () => {
        const text = new Text({text: 'text', chunkSize: 4});

        text.render();

        text.cursorMove('t');
        text.cursorMove('a');
        text.cursorMove('x');
        text.cursorMove('t');

        expect(text.correctCount).toBe(3);
    });
});
