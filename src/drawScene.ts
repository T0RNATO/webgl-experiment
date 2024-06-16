import {Buffers, Gl} from "./types";
import {mat4} from "gl-matrix";
import {Prism, Vec3} from "./classes";
import {toRGB} from "./utils";
import {programInfo} from "./main";

export function drawScene(gl: Gl, buffers: Buffers, rotation: Vec3, position: Vec3) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const canvas = gl.canvas as HTMLCanvasElement;

    const fieldOfView = (80 * Math.PI) / 180; // in radians
    const aspect = canvas.clientWidth / canvas.clientHeight;
    // only see objects between 0.1 units and 100 units away from the camera.
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();

    function rotateMatrix(matrix: mat4, rotation: number, axis: [number, number, number]) {
        mat4.rotate(matrix, matrix, rotation, axis);
    }

    rotateMatrix(modelViewMatrix, rotation.x, [1,0,0]);
    rotateMatrix(modelViewMatrix, rotation.y, [0,1,0]);
    rotateMatrix(modelViewMatrix, rotation.z, [0,0,1]);

    mat4.translate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [...position] as [number, number, number]
    );

    setPositionAttribute(gl, buffers);
    setColorIndexAttribute(gl, buffers);

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniforms.uProjectionMatrix,
        false,
        projectionMatrix,
    );
    gl.uniformMatrix4fv(
        programInfo.uniforms.uModelViewMatrix,
        false,
        modelViewMatrix,
    );
    gl.uniform4fv(programInfo.uniforms.uColorBuffer, new Float32Array([
        "#1e1e1e",
        "#b20000",
        "#009dff",
        "#8fff45",
        "#8328d7",
        "#de6009",
        "#debb09",
    ].map(toRGB).flat()))

    {
        const vertexCount = 36 * Prism.All.length;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl: Gl, buffers: Buffers) {
    const numComponents = 3; // pull out 3 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attributes.aVertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attributes.aVertexPosition);
}

function setColorIndexAttribute(gl: Gl, buffers: Buffers) {
    const numComponents = 2;
    const type = gl.UNSIGNED_BYTE;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorIndex);
    gl.vertexAttribPointer(
        programInfo.attributes.aVertexColorIndex,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attributes.aVertexColorIndex);
}