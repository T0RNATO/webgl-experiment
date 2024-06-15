export class Vec3 {
    constructor(public x: number, public y: number, public z: number) {
    }
    add(vec: Vec3) {
        return new Vec3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}

export class Cube {
    static All: Cube[] = [];
    colour: number[]
    constructor(public position: Vec3, public size: Vec3, colour?: number[] | number) {
        if (typeof colour === "number") {
            this.colour = Array(6).fill(colour);
        } else if (colour) {
            this.colour = colour;
        } else {
            this.colour = [0,1,2,3,4,5];
        }
        Cube.All.push(this);
    }
}