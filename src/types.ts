export type Gl = WebGLRenderingContext;

export type ProgramInfo = {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: number;
        vertexColorIndex: number;
    };
    uniformLocations: {
        vertexColor: WebGLUniformLocation;
        projectionMatrix: WebGLUniformLocation;
        modelViewMatrix: WebGLUniformLocation;
    };
};

export type Buffers = {
    [key: string]: WebGLBuffer;
}