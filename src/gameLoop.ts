import {GameObject, Player, Prism, Vec3} from "./classes";
import {drawScene} from "./drawScene";
import {Buffers, Gl} from "./types";
import {updatePositionBuffer} from "./initBuffers";

document.addEventListener('click', () => {
    document.body.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement) {
        document.addEventListener('mousemove', updatePosition, false);
    } else {
        document.removeEventListener('mousemove', updatePosition, false);
    }
});

document.body.addEventListener("keydown", (e) => {
    heldKeys[e.key] = true;
})
document.body.addEventListener("keyup", (e) => {
    heldKeys[e.key] = false;
})

function updatePosition(e: MouseEvent) {
    player.rotation.x += e.movementY * mouseSense * 0.001;
    player.rotation.y += e.movementX * mouseSense * 0.001;
}

const movementSpeed = 15;
const mouseSense = 1.8;

let deltaTime = 0;

const player = new Player(new Vec3(8, -4, -12), new Vec3(-.1, 0.5, 0))

const heldKeys: {[key: string]: boolean} = {};

new Prism(new Vec3(3, 0, 0), new Vec3(2,2,2));
new Prism(new Vec3(0, 0, 0), new Vec3(1,1,1), 3);
new Prism(new Vec3(-5, 0, 0), new Vec3(3,6,3), [1,1,1,2,2,2]);
new Prism(new Vec3(-20, 0, -20), new Vec3(40,0,40), [0,0,0,0,0,0], false);

function tick() {
    const x = Math.sin(-player.rotation.y) * deltaTime * movementSpeed;
    const z = Math.cos(-player.rotation.y) * deltaTime * movementSpeed;

    if (heldKeys["w"]) {
        player.position.x += x;
        player.position.z += z;
    }
    if (heldKeys["s"]) {
        player.position.x -= x;
        player.position.z -= z;
    }
    if (heldKeys["a"]) {
        player.position.x += z;
        player.position.z -= x;
    }
    if (heldKeys["d"]) {
        player.position.x -= z;
        player.position.z += x;
    }
    if (heldKeys[" "]) {
        player.position.y -= deltaTime * movementSpeed;
    }
    if (heldKeys["Shift"]) {
        player.position.y += deltaTime * movementSpeed;
    }

    const airDensity = 1.225;
    const dragCoefficient = 1;

    for (const obj of GameObject.All) {
        const dragArea = obj.size.x * obj.size.z;

        console.log(obj.velocity.mul(-0.5 * airDensity * dragArea * obj.velocity.length * dragCoefficient));

        const force = Vec3.sum(
            new Vec3(0,obj.mass * -9.81,0), //gravity
            obj.velocity.mul(-0.5 * airDensity * dragArea * obj.velocity.length * dragCoefficient), //drag
        )
        const last_acceleration = obj.acceleration;
        obj.position.addIP(obj.velocity.mul(deltaTime).add(last_acceleration.mul(deltaTime**2 * 0.5)))
        const new_acceleration = force.div(obj.mass);
        const avg_acceleration = last_acceleration.add(new_acceleration).div(2)
        obj.velocity.addIP(avg_acceleration.mul(deltaTime));
        obj.acceleration = new_acceleration;
    }
}

export function startGameLoop(gl: Gl, buffers: Buffers) {
    let then = 0;

    function gameLoop(now: number) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;

        tick();
        updatePositionBuffer(gl, buffers);
        drawScene(gl as WebGLRenderingContext, buffers, player.rotation, player.position);

        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
}