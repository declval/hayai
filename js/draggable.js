export { draggable };

const draggable = (handle, element) => {
    let moving = false;
    let offsetX = 0;
    let offsetY = 0;

    for (const child of handle.children) {
        child.addEventListener('mousedown', event => {
            event.stopPropagation();
        });
    }

    document.addEventListener('mousemove', event => {
        if (moving) {
            element.style.left = `${event.clientX - offsetX}px`;
            element.style.top = `${event.clientY - offsetY}px`;
        }
    });

    handle.addEventListener('mousedown', event => {
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;
        moving = true;
    });

    handle.addEventListener('mouseup', () => {
        moving = false;
    });
}
