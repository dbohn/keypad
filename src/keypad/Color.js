export default class Color {
    constructor({r = 0, g = 0, b = 0} = {}) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     *
     * @param {string} hexString
     */
    static fromHex(hexString) {
        const [r, g, b] = hexString.replace("#", "").match(/[a-fA-F0-9]{2}/g);
        return new Color({r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16)});
    }

    toHex() {
        return `#${Object.keys(this).map((k) => this[k].toString(16).padStart(2, "0")).join("")}`;
    }

    toSerial() {
        return `${this.r},${this.g},${this.b}`;
    }

    toJSON() {
        return {
            r: this.r,
            g: this.g,
            b: this.b
        };
    }

    /**
     *
     * @param {Color} color
     */
    equals(color) {
        return this.toSerial() === color.toSerial();
    }
}