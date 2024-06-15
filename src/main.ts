import "~/style.css";
import fsh from "~/shaders/shader.fsh?raw";
import vsh from "~/shaders/shader.vsh?raw";
import {Gl, ProgramInfo} from "./types";
import {initBuffers} from "./initBuffers";
import {drawScene} from "./drawScene";
import {Player, Prism, Vec3} from "./classes";

const movementSpeed = 4;
const mouseSense = 1.8;

let deltaTime = 0;

const player = new Player(new Vec3(8, -4, -12), new Vec3(-.1, 0.5, 0))

const heldKeys: {[key: string]: boolean} = {};

new Prism(new Vec3(3, 0, 0), new Vec3(2,2,2));
new Prism(new Vec3(0, 0, 0), new Vec3(1,1,1), 3);
new Prism(new Vec3(-5, 0, 0), new Vec3(3,6,3), [1,1,1,2,2,2]);
new Prism(new Vec3(-20, 0, -20), new Vec3(40,0,40), [0,0,0,0,0,0]);

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
            vertexColorIndex: gl.getAttribLocation(shaderProgram, "aVertexColorIndex"),
        },
        uniformLocations: {
            vertexColor: gl.getUniformLocation(shaderProgram, "uColorBuffer"),
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

        drawScene(gl, programInfo, buffers, player.rotation, player.position);

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