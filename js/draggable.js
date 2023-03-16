export { draggable };

function draggable(handle, element) {
    let moving = false;
    let offsetX = 0;
    let offsetY = 0;

    for (const child of handle.children) {
        child.addEventListener('mousedown', function (event) {
            event.stopPropagation();
        });
    }

    document.addEventListener('mousemove', function (event) {
        if (moving) {
            element.style.left = `${event.clientX - offsetX}px`;
            element.style.top = `${event.clientY - offsetY}px`;
        }
    });

    handle.addEventListener('mousedown', function (event) {
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;
        moving = true;
    });

    handle.addEventListener('mouseup', function (event) {
        moving = false;
    });
}
