attribute vec4 aVertexPosition;
attribute float aVertexColorIndex;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec4 uColorBuffer[7];

varying lowp vec4 vColor;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = uColorBuffer[int(aVertexColorIndex)];
}