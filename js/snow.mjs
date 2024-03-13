export { makeItNotSnow, makeItSnow };

import { createElement, randomIntWithUnit } from "./helpers.mjs";

const makeItNotSnow = element => {
    const snowflakes = [...element.getElementsByClassName('snowflake')];
    for (const snowflake of snowflakes) {
        snowflake.remove();
    }
};

const makeItSnow = ({
    element,
    sizeRange,
    fallDurationRange = [10000, 20000],
    fallDelayRange = [1, 10000],
    offsetRange = [1, 100],
    offsetDurationRange = [10000, 20000],
    rotateDurationRange = [3000, 10000]
}) => {
    for (let i = 0; i < Math.floor(element.clientWidth / 10); ++i) {
        const left = randomIntWithUnit(0, element.clientWidth, 'px'),
              size = randomIntWithUnit(sizeRange[0], sizeRange[1], 'px'),
              fallDuration = randomIntWithUnit(fallDurationRange[0],
                                       fallDurationRange[1], 'ms'),
              fallDelay = randomIntWithUnit(fallDelayRange[0],
                                    fallDelayRange[1], 'ms'),
              offset = randomIntWithUnit(offsetRange[0], offsetRange[1], 'px'),
              offsetDuration = randomIntWithUnit(offsetDurationRange[0],
                                         offsetDurationRange[1], 'ms'),
              rotateDuration = randomIntWithUnit(rotateDurationRange[0],
                                         rotateDurationRange[1], 'ms');

        const snowflake = createElement({
            name: 'div',
            classNames: ['snowflake']
        });
        snowflake.style.setProperty('--snowflake-left', left);
        snowflake.style.setProperty('--snowflake-offset', offset);
        snowflake.style.setProperty('--snowflake-size', size);
        snowflake.style.animation =
            `fall ${fallDuration} ${fallDelay} linear infinite, ` +
            `offset-${i % 2 === 0 ? 'left' : 'right'} ${offsetDuration} ease-in-out infinite, ` +
            `rotate-${i % 2 === 0 ? 'left' : 'right'} ${rotateDuration} linear infinite`;

        element.appendChild(snowflake);
    }
};
