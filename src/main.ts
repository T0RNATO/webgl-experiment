import "~/style.css";
import fsh from "~/shaders/shader.fsh?raw";
import vsh from "~/shaders/shader.vsh?raw";
import {Gl, ProgramInfo} from "./types";
import {nullCheck} from "./utils";
import {startGameLoop} from "./gameLoop";
import {initBuffers} from "./initBuffers";

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
    startGameLoop(gl, buffers);
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