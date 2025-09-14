class KeyboardChecker {
    constructor() {
        this.keyCodeElement = document.getElementById('key-code');
        this.keyValueElement = document.getElementById('key-value');
        this.codeValueElement = document.getElementById('code-value');
        this.pressedKeys = new Set();

        this.init();
    }

    init() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        document.addEventListener('DOMContentLoaded', () => {
            this.updateKeyInfo('Press any key', '-', '-');
        });

        window.addEventListener('blur', this.clearAllKeys.bind(this));
    }

    handleKeyDown(event) {
        event.preventDefault();

        const code = event.code;
        const key = event.key;
        const keyCode = event.keyCode || event.which;

        if (!this.pressedKeys.has(code)) {
            this.pressedKeys.add(code);
            this.highlightKey(code, true);
        }

        this.updateKeyInfo(keyCode, key, code);
    }

    handleKeyUp(event) {
        const code = event.code;

        this.pressedKeys.delete(code);
        this.highlightKey(code, false);
    }

    highlightKey(code, isPressed) {
        const keyElement = document.querySelector(`[data-code="${code}"]`);
        if (keyElement) {
            if (isPressed) {
                keyElement.classList.add('pressed');
            } else {
                keyElement.classList.remove('pressed');
            }
        }
    }

    updateKeyInfo(keyCode, key, code) {
        this.keyCodeElement.textContent = keyCode;
        this.keyValueElement.textContent = key === ' ' ? 'Space' : key;
        this.codeValueElement.textContent = code;
    }

    clearAllKeys() {
        this.pressedKeys.clear();
        const allKeys = document.querySelectorAll('.key.pressed');
        allKeys.forEach(key => key.classList.remove('pressed'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KeyboardChecker();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        const checker = window.keyboardChecker;
        if (checker) {
            checker.clearAllKeys();
        }
    }
});