import "~/style.css";
import fsh from "~/shaders/shader.fsh?raw";
import vsh from "~/shaders/shader.vsh?raw";
import {Gl, ProgramInfo} from "./types";
import {initBuffers} from "./initBuffers";
import {drawScene} from "./drawScene";
import {Player, Prism, Vec3} from "./classes";
import {nullCheck} from "./utils";

const movementSpeed = 4;
const mouseSense = 1.8;

let deltaTime = 0;

const player = new Player(new Vec3(8, -4, -12), new Vec3(-.1, 0.5, 0))

const heldKeys: {[key: string]: boolean} = {};

new Prism(new Vec3(3, 0, 0), new Vec3(2,2,2));
new Prism(new Vec3(0, 0, 0), new Vec3(1,1,1), 3);
new Prism(new Vec3(-5, 0, 0), new Vec3(3,6,3), [1,1,1,2,2,2]);
new Prism(new Vec3(-20, 0, -20), new Vec3(40,0,40), [0,0,0,0,0,0]);

export const programInfo: ProgramInfo = {
    program: undefined as unknown as WebGLProgram,
    attributes: {},
    uniforms: {},
};

function addAttribute(gl: Gl, name: string) {
    programInfo.attributes[name] = gl.getAttribLocation(programInfo.program, name);
}

function addUniform(gl: Gl, name: string) {
    const uniform = gl.getUniformLocation(programInfo.program, name);
    nullCheck(uniform, `Failed to get uniform location for ${name}`);
    programInfo.uniforms[name] = uniform;
}

main();

document.addEventListener('click', () => {
    document.body.requestPointerLock();
});

function updatePosition(e: MouseEvent) {
    player.rotation.x += e.movementY * mouseSense * 0.001;
    player.rotation.y += e.movementX * mouseSense * 0.001;
}

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

function main() {
    // @ts-ignore, trust me bro
    const canvas: HTMLCanvasElement = document.querySelector("#canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gl = canvas.getContext("webgl");
    nullCheck(gl, "Failed to initialize WebGL");

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(gl, vsh, fsh);
    nullCheck(shaderProgram, "Failed to initialize shader program");

    programInfo.program = shaderProgram;
    addAttribute(gl, "aVertexPosition");
    addAttribute(gl, "aVertexColorIndex");

    addUniform(gl, "uProjectionMatrix");
    addUniform(gl, "uModelViewMatrix");
    addUniform(gl, "uColorBuffer");

    const buffers = initBuffers(gl);
    let then = 0;

    function render(now: number) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;

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

        drawScene(gl as WebGLRenderingContext, buffers, player.rotation, player.position);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function initShaderProgram(gl: Gl, vsSource: string, fsSource: string) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    nullCheck(vertexShader, "Failed to initialize vertex shader");
    nullCheck(fragmentShader, "Failed to initialize fragment shader");

    const shaderProgram = gl.createProgram();
    nullCheck(shaderProgram, "Failed to initialize shader program");

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    }

    return shaderProgram;
}

// Creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl: Gl, type: number, source: string) {
    const shader = gl.createShader(type);

    if (!shader) {
        return null;
    }

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}