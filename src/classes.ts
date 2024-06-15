export class Vec3 {
    constructor(public x: number, public y: number, public z: number) {
    }
    add(v: Vec3) {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v: Vec3) {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(s: number) {
        return new Vec3(this.x * s, this.y * s, this.z * s);
    }
    div(s: number) {
        return new Vec3(this.x / s, this.y / s, this.z / s);
    }
    dot(v: Vec3) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v: Vec3) {
        return new Vec3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }
    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalize() {
        return this.div(this.len());
    }
    toString() {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}