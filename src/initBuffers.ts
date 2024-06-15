import {Buffers, Gl} from "./types";

export function initBuffers(gl: Gl): Buffers {
    return {
        position: initPositionBuffer(gl),
        indices: initVertexIndexBuffer(gl),
        colorIndex: initColorIndexBuffer(gl),
    };
}

function initPositionBuffer(gl: Gl) {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the square.
    const positions = [
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,     // Front face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, // Back face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,     // Top face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // Bottom face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,     // Right face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, // Left face
    ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

function initColorIndexBuffer(gl: Gl) {
    const colorIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorIndexBuffer);

    const colorIndices = [
        0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(colorIndices), gl.STATIC_DRAW);

    return colorIndexBuffer;
}

function initVertexIndexBuffer(gl: Gl) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    // Allows reusing of the vertices
    const indices = [
        0,1,2,0,2,3, // front
        4,5,6,4,6,7, // back
        8,9,10,8,10,11, // top
        12,13,14,12,14,15, // bottom
        16,17,18,16,18,19, // right
        20,21,22,20,22,23, // left
    ];

    // Now send the element array to GL

    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW,
    );

    return indexBuffer;
}