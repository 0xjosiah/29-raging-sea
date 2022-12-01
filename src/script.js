import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterFragShader from './shaders/water/fragment.glsl'
import waterVertexShader from './shaders/water/vertex.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Color
debugObject.depthColor = 0x186691
debugObject.surfaceColor = 0x9bd8ff

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragShader,
    uniforms: {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: .75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3.0 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIterations: { value: 4.0 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: .08 },
        uColorMultiplier: { value: 5 },
    }
})
const waveParamsFolder = gui.addFolder('Wave Params')
waveParamsFolder.add(waterMaterial.uniforms.uBigWavesElevation, 'value', 0, 1, .001).name('elevation')
waveParamsFolder.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x', 0, 20, .1).name('x frequency')
waveParamsFolder.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y', 0, 20, .1).name('z frequency')
waveParamsFolder.add(waterMaterial.uniforms.uBigWavesSpeed, 'value', 0, 5, .01).name('speed')

waveParamsFolder.addColor(debugObject, 'depthColor').onChange(() => waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor))
waveParamsFolder.addColor(debugObject, 'surfaceColor').onChange(() => waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor))

waveParamsFolder.add(waterMaterial.uniforms.uColorOffset, 'value', 0, 1, .001).name('color offset')
waveParamsFolder.add(waterMaterial.uniforms.uColorMultiplier, 'value', 0, 10, .01).name('color multiplier')

waveParamsFolder.add(waterMaterial.uniforms.uSmallWavesElevation, 'value', 0, 1, .001).name('small elevation')
waveParamsFolder.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value', 0, 30, .001).name('small frequency')
waveParamsFolder.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value', 0, 5, .001).name('small speed')
waveParamsFolder.add(waterMaterial.uniforms.uSmallWavesIterations, 'value', 0, 15, 1).name('small iterations')


// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update uniforms in water shaders
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()