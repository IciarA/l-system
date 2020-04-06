import {vec3} from 'gl-matrix';
import {mat4} from 'gl-matrix';
import {quat} from 'gl-matrix';
import {vec4} from 'gl-matrix';

export default class Turtle {

  position: vec3;
  orientation: vec3;
  recDepth: number;
  orient: quat;
    
  constructor(pos: vec3, orient: vec3);
  constructor(pos: vec3, orient: vec3, q: quat);
  constructor(pos?: vec3, orient?: vec3, q?: quat) {
    this.position = pos;
    this.orientation = orient;
    this.recDepth = 0;
    if (typeof q !== 'undefined') {
      this.orient = q;
    }
    else {
      this.orient = quat.create();
      //quat.setAxisAngle(this.orient, this.orientation, 0.0);
    }
  }

  addRecursion() {
    this.recDepth += 1;
  }

  moveForward(scale: vec3) {
    let orient: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
    let newScale: vec3 = vec3.create();
    vec3.copy(newScale, scale);
    vec3.scale(orient, this.orientation, 0.9 * newScale[1]);

    vec3.add(this.position, this.position, orient);
  }

  rotateX(angle: number) {
    let rad: number = angle * Math.PI / 180.0;
    let orig: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
    //vec3.normalize(orig, this.position);
    vec3.rotateX(this.orientation, this.orientation, orig, rad);
    vec3.normalize(this.orientation, this.orientation);
  }

  rotateY(angle: number) {
    let rad: number = angle * Math.PI / 180.0;
    let orig: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
    //vec3.normalize(orig, this.position);
    vec3.rotateY(this.orientation, this.orientation, orig, rad);
    vec3.normalize(this.orientation, this.orientation);
  }

  rotateZ(angle: number) {
    let rad: number = angle * Math.PI / 180.0;
    let orig: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
    //vec3.normalize(orig, this.position);
    vec3.rotateZ(this.orientation, this.orientation, orig, rad);
    vec3.normalize(this.orientation, this.orientation);
  }

  rotateMove(angles: vec3, scale: vec3) {
    let dir: vec3 = vec3.fromValues(0.0, 1.0, 0.0);
    vec3.copy(this.orientation, dir);

    console.log(this.orientation);

    this.rotateX(angles[0]);
    this.rotateY(angles[1]);
    this.rotateZ(angles[2]);

    console.log(this.orientation);

    let orient: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
    let newScale: vec3 = vec3.create();
    vec3.copy(newScale, scale);
    // vec3.add(newScale, newScale, vec3.fromValues(0.5, -0.3, 0.0));
    //vec3.multiply( orient, this.orientation,  newScale);
    vec3.scale(orient, this.orientation, 0.8 * newScale[1]);

    vec3.add(this.position, this.position, orient);

  }


}