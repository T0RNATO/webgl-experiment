export class Vec3 {
    constructor(public x: number, public y: number, public z: number) {}
    add(vec: Vec3) { return new Vec3(this.x + vec.x, this.y + vec.y, this.z + vec.z); }
    sub(vec: Vec3) { return new Vec3(this.x - vec.x, this.y - vec.y, this.z - vec.z); }
    mul(scalar: number) { return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar); }
    div(scalar: number) { return new Vec3(this.x / scalar, this.y / scalar, this.z / scalar); }
    dot(vec: Vec3) { return this.x * vec.x + this.y * vec.y + this.z * vec.z; }
    cross(vec: Vec3) {
        return new Vec3(
            this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x,
        );
    }

    static sum(...vecs: Vec3[]) {
        return vecs.reduce((a,b) => a.add(b), new Vec3(0,0,0));
    }

    addIP(vec: Vec3) { this.x += vec.x; this.y += vec.y; this.z += vec.z; return this; }
    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}

export class GameObject {
    static All: GameObject[] = [];
    mass: number = 10;
    velocity = new Vec3(0,0,0);
    acceleration = new Vec3(0,0,0);
    constructor(public position: Vec3, public size: Vec3, physics = true) {
        if (physics) {
            GameObject.All.push(this);
        }
    }
}

export class Prism extends GameObject{
    static All: Prism[] = [];
    colour: number[]
    constructor(position: Vec3, size: Vec3, colour?: number[] | number, physics = true) {
        super(position, size, physics);
        if (typeof colour === "number") {
            this.colour = Array(6).fill(colour);
        } else if (colour) {
            this.colour = colour;
        } else {
            this.colour = [1,2,3,4,5,6];
        }
        Prism.All.push(this);
    }
}

export class Player extends GameObject {
    constructor(position: Vec3, public rotation: Vec3) {
        super(position, new Vec3(1,2,1), false);
    }
}