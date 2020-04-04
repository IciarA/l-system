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

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
};

let square: Square;
let mesh: Mesh;
let screenQuad: ScreenQuad;
let time: number = 0.0;

let lsys: LSystem;

function loadScene() {
  square = new Square();
  square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  //mesh = new Mesh('./cylinder.obj', vec3.fromValues(0.0, 0.0, 0.0));
  //mesh.create();

  lsys = new LSystem();
  //lsys.lsystemParse(3, "F");
  lsys.lsystemProcess();

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

    colorsArray.push(i / n);
    colorsArray.push(i / n);
    colorsArray.push(1.0);
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

  const camera = new Camera(vec3.fromValues(0, 0, -10), vec3.fromValues(0, 0, 0));
  // let cameraPos: vec3 = vec3.fromValues(0, 25, -275);
  // vec3.rotateY(cameraPos, cameraPos, vec3.fromValues(0,0,0), 290 * Math.PI / 180.0);
  // const camera = new Camera(cameraPos, vec3.fromValues(0, 35, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE); // Additive blending

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
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
    //renderer.render(camera, instancedShader, [
    //  mesh,
    //]);
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
