export { Draggable };

class Draggable {
    constructor(handle, element) {
        this.activated = false;
        this.moving = false;

        let offsetX = 0;
        let offsetY = 0;

        for (const child of handle.children) {
            child.addEventListener('mousedown', event => {
                event.stopPropagation();
            });
        }

        document.addEventListener('mousemove', event => {
            if (this.activated && this.moving) {
                element.style.left = `${event.clientX - offsetX}px`;
                element.style.top = `${event.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            this.moving = false;
        });

        handle.addEventListener('mousedown', event => {
            offsetX = event.clientX - element.offsetLeft;
            offsetY = event.clientY - element.offsetTop;
            this.moving = true;
        });
    }

    activate = () => {
        this.activated = true;
    }

    deactivate = () => {
        this.activated = false;
    }
}
