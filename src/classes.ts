export class Vec3 {
    constructor(public x: number, public y: number, public z: number) {
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}

export class Cube {
    static All: Cube[] = [];
    constructor(public position: Vec3) {
        Cube.All.push(this);
    }
}