import "~/style.css";
import fsh from "~/shaders/shader.fsh?raw";
import vsh from "~/shaders/shader.vsh?raw";
import {Gl, ProgramInfo} from "./types";
import {initBuffers} from "./initBuffers";
import {drawScene} from "./drawScene";
import {Vec3} from "./classes";

const movementSpeed = 4;
const mouseSense = 1.8;

let deltaTime = 0;

const rotation = new Vec3(0, 0, 0);
const position = new Vec3(0, 0, -6);
const heldKeys: {[key: string]: boolean} = {};

main();

document.addEventListener('click', () => {
    document.body.requestPointerLock();
});

function updatePosition(e: MouseEvent) {
    rotation.x += e.movementY * mouseSense * 0.001;
    rotation.y += e.movementX * mouseSense * 0.001;
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

    const gl: WebGLRenderingContext = canvas.getContext("webgl");

    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    const shaderProgram: WebGLProgram = initShaderProgram(gl, vsh, fsh);

    // Collect all the info needed to use the shader program.
    // Look up which attributes our shader program is using
    // for aVertexPosition, aVertexColor and also
    // look up uniform locations.
    const programInfo: ProgramInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

    const buffers = initBuffers(gl);
    let then = 0;

    // Draw the scene repeatedly
    function render(now: number) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;

        const x = Math.sin(-rotation.y) * deltaTime * movementSpeed;
        const z = Math.cos(-rotation.y) * deltaTime * movementSpeed;

        if (heldKeys["w"]) {
            position.x += x;
            position.z += z;
        }
        if (heldKeys["s"]) {
            position.x -= x;
            position.z -= z;
        }
        if (heldKeys["a"]) {
            position.x += z;
            position.z -= x;
        }
        if (heldKeys["d"]) {
            position.x -= z;
            position.z += x;
        }
        if (heldKeys[" "]) {
            position.y -= deltaTime * movementSpeed;
        }
        if (heldKeys["Shift"]) {
            position.y += deltaTime * movementSpeed;
        }

        drawScene(gl, programInfo, buffers, rotation, position);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function initShaderProgram(gl: Gl, vsSource: string, fsSource: string) {
    const vertexShader: WebGLShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader: WebGLShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();

    if (!shaderProgram) {
        return null;
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    }

    return shaderProgram;
}

// Creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl: Gl, type: number, source: string) {
    const shader = gl.createShader(type);

    if (!shader) {
        return null;
    }
    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}