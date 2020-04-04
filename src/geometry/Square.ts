import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Square extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  offsets: Float32Array; // Data for bufTranslate
  orientation: Float32Array;
  quater: Float32Array;
  scale: Float32Array; 


  constructor() {
    super(); // Call the constructor of the super class. This is required.
  }

  create() {

  // this.indices = new Uint32Array([0, 1, 2,
  //                                 0, 2, 3,
  //                                 3, 4, 2, 
  //                                 3, 4, 5,
  //                                 1, 4, 6,
  //                                 1, 4, 2,
  //                                 7, 0, 3,
  //                                 7, 3, 5,
  //                                 6, 5, 7,
  //                                 6, 5, 4,
  //                                 7, 1, 0,
  //                                 7, 1, 6]);
  this.indices = new Uint32Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]);



  this.positions = new Float32Array([-0.5, -0.5, 0.5, 1,
                                       0.5, -0.5, 0.5, 1,
                                       0.5, 0.5, 0.5, 1,
                                       -0.5, 0.5, 0.5, 1,

                                       0.5, -0.5, 0.5, 1,
                                       0.5, -0.5, -0.5, 1,
                                       0.5, 0.5, -0.5, 1,
                                       0.5, 0.5, 0.5, 1,
                                      
                                       0.5, -0.5, -0.5, 1,
                                       -0.5, -0.5, -0.5, 1,
                                       -0.5, 0.5, -0.5, 1,
                                       0.5, 0.5, -0.5, 1, 
                                      
                                       -0.5, -0.5, -0.5, 1,
                                       -0.5, -0.5, 0.5, 1,
                                       -0.5, 0.5, 0.5, 1,
                                       -0.5, 0.5, -0.5, 1,
                                      
                                       -0.5, 0.5, 0.5, 1,
                                       0.5, 0.5, 0.5, 1,
                                       0.5, 0.5, -0.5, 1,
                                       -0.5, 0.5, -0.5, 1,
                                      
                                       -0.5, -0.5, -0.5, 1,
                                       0.5, -0.5, -0.5, 1,
                                       0.5, -0.5, 0.5, 1,
                                       -0.5, -0.5, 0.5, 1]);

  // this.positions = new Float32Array([-0.5, -0.5, 0.5, 1,
  //                                    0.5, -0.5, 0.5, 1,
  //                                    0.5, 0.5, 0.5, 1,
  //                                    -0.5, 0.5, 0.5, 1,
  //                                    0.5, 0.5, -0.5, 1,
  //                                    -0.5, 0.5, -0.5, 1,
  //                                    0.5, -0.5, -0.5, 1,
  //                                    -0.5, -0.5, -0.5, 1]);

  this.normals = new Float32Array([0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    1.0, 0.0, 0.0, 0.0,
    1.0, 0.0, 0.0, 0.0,
    1.0, 0.0, 0.0, 0.0,
    1.0, 0.0, 0.0, 0.0,
    0.0, 0.0, -1.0, 0.0,
    0.0, 0.0, -1.0, 0.0,
    0.0, 0.0, -1.0, 0.0,
    0.0, 0.0, -1.0, 0.0,
    -1.0, 0.0, 0.0, 0.0,
    -1.0, 0.0, 0.0, 0.0,
    -1.0, 0.0, 0.0, 0.0,
    -1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, -1.0, 0.0, 0.0,
    0.0, -1.0, 0.0, 0.0,
    0.0, -1.0, 0.0, 0.0,
    0.0, -1.0, 0.0, 0.0]);


    this.generateIdx();
    this.generatePos();

    this.generateNor();

    this.generateCol();
    this.generateTranslate();
    this.generateOrient();
    this.generateScale();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    console.log(`Created square`);
  }

  setInstanceVBOs(offsets: Float32Array, colors: Float32Array, orientation: Float32Array, scale: Float32Array) {
    this.colors = colors;
    this.offsets = offsets;
    this.orientation = orientation;
    this.scale = scale;


    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    gl.bufferData(gl.ARRAY_BUFFER, this.offsets, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufOrientation);
    gl.bufferData(gl.ARRAY_BUFFER, this.orientation, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufScale);
    gl.bufferData(gl.ARRAY_BUFFER, this.scale, gl.STATIC_DRAW);

  }
};

export default Square;
