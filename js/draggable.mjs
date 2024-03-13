export { Draggable };

class Draggable {
    constructor(handle, element) {
        this.activated = false;
        this.moving = false;

        let offsetX = 0;
        let offsetY = 0;

        for (const childElement of handle.children) {
            childElement.addEventListener("mousedown", event => {
                event.stopPropagation();
            });
        }

        document.addEventListener("mousemove", event => {
            if (this.activated && this.moving) {
                let left = event.clientX - offsetX;
                if (left < 0) {
                    left = 0;
                } else if (left > window.innerWidth - element.offsetWidth) {
                    left = window.innerWidth - element.offsetWidth;
                }
                element.style.left = `${left}px`;

                let top = event.clientY - offsetY;
                if (top < 0) {
                    top = 0;
                } else if (top > window.innerHeight - element.offsetHeight) {
                    top = window.innerHeight - element.offsetHeight;
                }
                element.style.top = `${top}px`;
            }
        });

        document.addEventListener("mouseup", () => {
            this.moving = false;
        });

        handle.addEventListener("mousedown", event => {
            offsetX = event.clientX - element.offsetLeft;
            offsetY = event.clientY - element.offsetTop;
            this.moving = true;
        });
    }

    activate = () => {
        this.activated = true;
    };

    deactivate = () => {
        this.activated = false;
    };
}
