import {Buffers, Gl} from "./types";
import {Prism} from "./classes";
import {nullCheck} from "./utils";

export function initBuffers(gl: Gl): Buffers {
    const positionBuffer = initPositionBuffer(gl);
    const vertexIndexBuffer = initVertexIndexBuffer(gl);
    const colorIndexBuffer = initColorIndexBuffer(gl);
    nullCheck(positionBuffer, "positionBuffer is null.");
    nullCheck(vertexIndexBuffer, "vertexIndexBuffer is null.");
    nullCheck(colorIndexBuffer, "colorIndexBuffer is null.");

    return {
        position: positionBuffer,
        indices: vertexIndexBuffer,
        colorIndex: colorIndexBuffer,
    };
}

function initPositionBuffer(gl: Gl) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = Prism.All.map(generateCubeVertices).flat();

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

export function updatePositionBuffer(gl: Gl, buffers: Buffers) {
    const positions = Prism.All.map(generateCubeVertices).flat();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(positions));
}

function initColorIndexBuffer(gl: Gl) {
    const colorIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorIndexBuffer);

    const colorIndices = Prism.All.map(cube =>
        cube.colour.map(colour =>
            new Array(4).fill(colour))
    ).flat(2);

    gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(colorIndices), gl.STATIC_DRAW);

    return colorIndexBuffer;
}

function initVertexIndexBuffer(gl: Gl) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const indices = Prism.All.map((_, i) => generateCubeVertexIndices(i)).flat();

    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW,
    );

    return indexBuffer;
}

function generateCubeVertices(cube: Prism) {
    const {position, size} = cube;
    const {x: x1, y: y1, z: z1} = position;
    const {x: x2, y: y2, z: z2} = position.add(size);

    return [
        x1, y1, z2, x2, y1, z2, x2, y2, z2, x1, y2, z2, // Front face
        x1, y1, z1, x1, y2, z1, x2, y2, z1, x2, y1, z1, // Back face
        x1, y2, z1, x1, y2, z2, x2, y2, z2, x2, y2, z1, // Top face
        x1, y1, z1, x2, y1, z1, x2, y1, z2, x1, y1, z2, // Bottom face
        x2, y1, z1, x2, y2, z1, x2, y2, z2, x2, y1, z2, // Right face
        x1, y1, z1, x1, y1, z2, x1, y2, z2, x1, y2, z1, // Left face
    ]
}

function generateCubeVertexIndices(i: number) {
    // Defines each face as 6 vertices, two triangles, using vertex ids.
    return [
        0,1,2,0,2,3, // front
        4,5,6,4,6,7, // back
        8,9,10,8,10,11, // top
        12,13,14,12,14,15, // bottom
        16,17,18,16,18,19, // right
        20,21,22,20,22,23, // left
    ].map(index => index + i * 24);
}