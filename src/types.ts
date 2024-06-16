export type Gl = WebGLRenderingContext;

export type ProgramInfo = {
    program: WebGLProgram;
    attributes: {
        [key: string]: number
    };
    uniforms: {
        [key: string]: WebGLUniformLocation;
    };
};

export type Buffers = {
    [key: string]: WebGLBuffer;
}