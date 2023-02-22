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

// backdrop
const backgroundColor = new THREE.Color(0xf5d5d5)
scene.background = backgroundColor

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(15, 15, 512, 512)
// const waterGeometry = new THREE.SphereGeometry(2, 512, 512)
// const waterGeometry = new THREE.BoxGeometry(10, 10, .1, 512, 512)
// const waterGeometry = new THREE.CylinderGeometry(5, .1, 15, 512, 512)

// Color
debugObject.depthColor = 0x365187
debugObject.surfaceColor = 0xf291a0

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragShader,
    side: THREE.DoubleSide,
    // wireframe: true,
    uniforms: {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.283 },
        uBigWavesFrequency: { value: new THREE.Vector2( 0.72, 0.369 ) },
        uBigWavesSpeed: { value: 0.33 },

        uSmallWavesElevation: { value: 0.167 },
        uSmallWavesFrequency: { value: 1.765 },
        uSmallWavesSpeed: { value: 0.178 },
        uSmallWavesIterations: { value: 2.0 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.051 },
        uColorMultiplier: { value: 3.76 },
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
// console.log(water.geometry.attributes.position.array)

/**
 * Boats
 */
const testBoat = new THREE.Mesh(
    new THREE.SphereGeometry(.1),
    new THREE.MeshBasicMaterial()
)
// scene.add(testBoat)
// console.log(testBoat)

// const waterPos = water.geometry.attributes.position.array
// const boatPos = testBoat.geometry.attributes.position.array
// console.log(boatPos);
// for (let i = 0; i < waterPos.length; i+=3) {
//     let x = waterPos[i]
//     let y = waterPos[i + 1]
//     let z = waterPos[i + 2]
//     let boatX = testBoat.position.x//boatPos[i]
//     let boatY = testBoat.position.y//boatPos[i + 1]
//     let boatZ = testBoat.position.z//boatPos[i + 2]
//     if(x == boatX && y == boatY) console.log(x, y)
// }

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
camera.position.set( 1.1469, 0.4058, 1.2328 )
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

    // Update boat
    // const waterPos = water.geometry.attributes.position.array
    // // const boatPos = testBoat.geometry.attributes.position.array
    // for (let i = 0; i < waterPos.length; i+=3) {
    //     let x = waterPos[i]
    //     let y = waterPos[i + 1]
    //     let z = waterPos[i + 2]
    //     let boatX = testBoat.position.x//boatPos[i]
    //     let boatY = testBoat.position.y//boatPos[i + 1]
    //     // let boatZ = testBoat.position.z//boatPos[i + 2]
    //     if(x == boatX && y == boatY) {
    //         testBoat.position.set(x,y,z)
    //         console.log(x,y,z);
    //     }
    // }
    const {uBigWavesElevation, uBigWavesFrequency, uBigWavesSpeed} = waterMaterial.uniforms
    const waveFreqX = Math.sin(testBoat.position.x * uBigWavesFrequency.x + elapsedTime * uBigWavesSpeed);
    const waveFreqZ = Math.sin(testBoat.position.z * uBigWavesFrequency.y + elapsedTime * uBigWavesSpeed);
    const elevation = waveFreqX * waveFreqZ * uBigWavesElevation;
    testBoat.position.y = Math.sin(elapsedTime * uBigWavesSpeed.value) * uBigWavesElevation.value

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // camera caller
    // console.log('cam pos', camera.position)
    // console.log('cam rotation', camera.rotation)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()