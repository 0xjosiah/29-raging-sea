uniform float uBigWavesElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(modelPosition.x * 2.0) * uBigWavesElevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}