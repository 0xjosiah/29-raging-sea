uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

void main() {
    vec3 depth = uDepthColor;
    gl_FragColor = vec4(depth, 1.0);
}