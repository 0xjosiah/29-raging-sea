uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Elevation
    float waveFreqX = sin(modelPosition.x * uBigWavesFrequency.x);
    float waveFreqZ = sin(modelPosition.z * uBigWavesFrequency.y);
    float elevation = waveFreqX * waveFreqZ * uBigWavesElevation;

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}