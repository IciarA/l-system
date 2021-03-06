import {vec3} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import Mesh from './geometry/Mesh';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';

import LSystem from './LSystem';


let flowerColor: vec3 = vec3.fromValues(255.0, 204.0, 0.0);
// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  iterations: 8.0,
  rotation: 20.0,
  'Flower Color': [flowerColor[0], flowerColor[1], flowerColor[2]],
  'Create Plant': loadScene,
};

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

let square: Square;
let flower: Square;
let mesh: Mesh;
let screenQuad: ScreenQuad;
let time: number = 0.0;

let lsys: LSystem;

function loadScene() {
  square = new Square();
  square.create();
  flower = new Square();
  flower.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  //console.log(meshes);
  //mesh = new Mesh('flower', vec3.fromValues(1.0, 0.0, 0.0), meshes);
  //mesh.create();

  lsys = new LSystem();
  //lsys.lsystemParse(3, "F");
  lsys.lsystemProcess(controls.iterations, controls.rotation);

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  let offsetsArray = [];
  let orientationsArray = [];
  let colorsArray = [];
  let quatsArray = [];
  let n: number = lsys.orientationArray.length / 3.0;

  for (let i = 0; i < n; i++) {
    //quatsArray.push(lsys.quatArray[i]);

    colorsArray.push(flowerColor[0]);
    colorsArray.push(flowerColor[1]);
    colorsArray.push(flowerColor[2]);
    colorsArray.push(1.0); // Alpha channel

  }

  console.log(lsys.orientationArray.length);
  console.log(lsys.orientationArray);

  //console.log(lsys.offsetArray.length);
  //offsetsArray = lsys.offsetArray;
  let offsets: Float32Array = new Float32Array(lsys.offsetArray);
  let colors: Float32Array = new Float32Array(colorsArray);
  let orientation: Float32Array = new Float32Array(lsys.orientationArray);
  let scale: Float32Array = new Float32Array(lsys.scaleArray);
  square.setInstanceVBOs(offsets, colors, orientation, scale);
  square.setNumInstances(n); // grid of "particles"

  let flowerOffsets: Float32Array = new Float32Array(lsys.flowerOffsetArray);
  let flowerOrientation: Float32Array = new Float32Array(lsys.flowerOrientation);
  flower.setInstanceVBOs(flowerOffsets, colors, flowerOrientation, scale);
  flower.setNumInstances(lsys.flowerOrientation.length / 3.0);

  //mesh.setInstanceVBOs(offsets, colors, orientation, scale);
  //mesh.setNumInstances(n);

  //mesh.setInstanceVBOs(offsets, colors, orientation, quaternions);
  //mesh.setNumInstances(n * n);
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'iterations', 0, 20).step(1.0);
  gui.add(controls, 'rotation', 0.0, 45.0).step(1.0);
  gui.addColor({'Flower Color': rgbToHex(flowerColor[0], flowerColor[1], flowerColor[2])}, 'Flower Color').onChange(
    function(hex: string) {
      let rgb = hexToRgb(hex);
      flowerColor = vec3.fromValues(rgb.r,rgb.g,rgb.b);
    }
  );
  gui.add(controls, 'Create Plant');


  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 4, 0), vec3.fromValues(0, 4, 0));
  //const camera = new Camera(vec3.fromValues(50, 50, 10), vec3.fromValues(50, 50, 0));
  // let cameraPos: vec3 = vec3.fromValues(0, 25, -275);
  // vec3.rotateX(cameraPos, cameraPos, vec3.fromValues(0,0,0), 290 * Math.PI / 180.0);
  // const camera = new Camera(cameraPos, vec3.fromValues(0, 35, 0));

  //const renderer = new OpenGLRenderer(canvas);
  //renderer.setClearColor(0.2, 0.2, 0.2, 1);
  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(164.0 / 255.0, 233.0 / 255.0, 1.0, 1);
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  const flowerShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flower-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flower-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      square,
    ]);
    renderer.render(camera, flowerShader, [
      flower,
    ]);
    // renderer.render(camera, instancedShader, [
    //  mesh,
    // ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
