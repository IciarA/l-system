import Turtle from './Turtle';
import {vec3} from 'gl-matrix';
import {mat4} from 'gl-matrix';
import {quat} from 'gl-matrix';


let expansionRules : Map<string, string> = new Map();
expansionRules.set('A', 'AB');
expansionRules.set('B', 'A');
//expansionRules.set('F', 'F[*T-T-F][#T+T+F]');
//expansionRules.set('F', 'F[*T-T-F][#T+T+F][&T-T-F][@T+T+F]');
expansionRules.set('F', 'F[#TT+TT]');

let orient: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
vec3.normalize(orient, vec3.fromValues(1.0, 0.0, 1.0))
let myTurtle: Turtle = new Turtle(vec3.fromValues(10.0, 1.0, 1.0), orient);
let drawRules: Map<string, any> = new Map();
drawRules.set('F', myTurtle.moveForward.bind(myTurtle));
drawRules.set('+', myTurtle.rotateX.bind(0.5));
drawRules.set('-', myTurtle.rotateY.bind(1.5));


class LSystem {
    offsetArray: number[];
    orientationArray: number[];
    scaleArray: number[];
    turtles: Turtle[];
    grammar: string;

   

    lsystemParse(iterations: number, axiom: string) : string {
        var newstr = axiom;
        for (let i = 0; i < iterations; i++) {

            var newstr2 = "";
            for (let j = 0; j < newstr.length; j++) {
                if (expansionRules.get(newstr[j])) {
                    newstr2 += expansionRules.get(newstr[j]);
                    
                }
                else {
                    newstr2 += newstr[j];
                }
            }

            newstr = newstr2;
            //console.log(newstr);
            
        }
        return newstr;
    }

    lsystemProcess() {
        let grammar: string = this.lsystemParse(1, "F");
        this.offsetArray = [];
        this.orientationArray = [];
        this.scaleArray = [];
        this.turtles = [];
        let turtle : Turtle;
        turtle = new Turtle(vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 0.0));

        let angles: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
        let angGroup: vec3[] = [];
        
        let scale: vec3 = vec3.fromValues(0.5, 1.0, 0.5);
        let scaleGroup: vec3[] = [];


        console.log(grammar);
        for (let i = 0; i < grammar.length; i++) {
            let ch: string = grammar.charAt(i);
            if (ch == "F" || ch == "T") {

                console.log("pushed turtle:");
                //console.log(start);

                //let func = drawRules.get('F');
                turtle.moveForward(scale);
                //turtle.rotateMove(angles, scale);

                this.offsetArray.push(turtle.position[0]);
                this.offsetArray.push(turtle.position[1]);
                this.offsetArray.push(turtle.position[2]);
            
                //this.orientationArray.push(turtle.orientation[0]);
                //this.orientationArray.push(turtle.orientation[1]);
                //this.orientationArray.push(turtle.orientation[2]);
                this.orientationArray.push(angles[0]);
                this.orientationArray.push(angles[1]);
                this.orientationArray.push(angles[2]);

                this.scaleArray.push(scale[0]);
                this.scaleArray.push(scale[1]);
                this.scaleArray.push(scale[2]);

                console.log("Position: ");
                console.log(turtle.position);
                console.log("Orientation");
                console.log(turtle.orientation);
                console.log("Angle:");
                //console.log("offset array");
                console.log(angles);
            }

            if (ch == "b") {
                let angle2: vec3 = vec3.create();
                vec3.subtract(angle2, angles, vec3.fromValues(0.0, 0.0, 5.0));

                console.log(angles);
                console.log(angle2);

                let currAng: number = 25.0;

                turtle.rotateZ(currAng);
                turtle.moveForward(scale);

                scale[0] /= 1.1;
                scale[1] /= 1.4;
                scale[2] /= 1.1;

                this.offsetArray.push(turtle.position[0]);
                this.offsetArray.push(turtle.position[1]);
                this.offsetArray.push(turtle.position[2]);

                this.orientationArray.push(angle2[0]);
                this.orientationArray.push(angle2[1]);
                this.orientationArray.push(angle2[2]);
                

                this.scaleArray.push(scale[0]);
                this.scaleArray.push(scale[1]);
                this.scaleArray.push(scale[2]);

                

                vec3.copy(angle2, angles);
                currAng += 5.0;

                turtle.rotateZ(5.0);
                turtle.moveForward(scale);

                scale[0] /= 1.2;
                scale[1] /= 1.0;
                scale[2] /= 1.2;

                this.offsetArray.push(turtle.position[0]);
                this.offsetArray.push(turtle.position[1]);
                this.offsetArray.push(turtle.position[2]);

                this.orientationArray.push(angle2[0]);
                this.orientationArray.push(angle2[1]);
                this.orientationArray.push(angle2[2]);

                this.scaleArray.push(scale[0]);
                this.scaleArray.push(scale[1]);
                this.scaleArray.push(scale[2]);


                

                vec3.add(angle2, angles, vec3.fromValues(0.0, 0.0, 5.0));
                currAng += 5.0;

                turtle.rotateY(5.0);
                turtle.moveForward(scale);

                scale[0] /= 1.2;
                scale[1] /= 1.0;
                scale[2] /= 1.2;


                this.offsetArray.push(turtle.position[0]);
                this.offsetArray.push(turtle.position[1]);
                this.offsetArray.push(turtle.position[2]);

                this.orientationArray.push(angle2[0]);
                this.orientationArray.push(angle2[1]);
                this.orientationArray.push(angle2[2]);

                this.scaleArray.push(scale[0]);
                this.scaleArray.push(scale[1]);
                this.scaleArray.push(scale[2]);

                console.log(this.orientationArray);
            }

            if (ch == "+") {
                turtle.rotateZ(30.0);
                //console.log(turtle.position);
                angles[2] += 30.0;

                scale[0] /= 1.1;
                scale[1] /= 1.05;
                scale[2] /= 1.1;
            }
            if (ch == "-") {
                turtle.rotateZ(-30.0);

                angles[2] += -30.0;

                scale[0] /= 1.1;
                scale[1] /= 1.05;
                scale[2] /= 1.1;
            }
            if (ch == "*") {

                turtle.rotateZ(70.0);
                turtle.rotateY(40.0);
                //console.log(turtle.position);
                angles[2] += 70.0;
                angles[1] += 40.0;

                scale[0] /= 1.1;
                scale[1] /= 1.05;
                scale[2] /= 1.1;
            }
            if (ch == "#") {
                turtle.rotateZ(-70.0);
                turtle.rotateY(40.0);
                //turtle.quatRotateZ(-0.78);

                angles[2] += -70.0;
                angles[1] += 40.0;

                scale[0] /= 1.1;
                scale[1] /= 1.05;
                scale[2] /= 1.1;
            }
            if (ch == "&") {

                turtle.rotateZ(70.0);
                turtle.rotateY(-40.0);
                //console.log(turtle.position);
                angles[2] += 70.0;
                angles[1] = 40.0;

                scale[0] /= 1.1;
                scale[1] /= 1.05;
                scale[2] /= 1.1;
            }
            if (ch == "@") {
                turtle.rotateZ(-70.0);
                turtle.rotateY(-40.0);
                //turtle.quatRotateZ(-0.78);

                angles[2] += -70.0;
                angles[1] = 40.0;

                scale[0] /= 1.1;
                scale[1] /= 1.05;
                scale[2] /= 1.1;
            }
            if (ch == "[") {
                let pos: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
                let ori: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
                vec3.copy(pos, turtle.position);
                vec3.copy(ori, turtle.orientation);
                //let newTurtle = new Turtle(turtle.position, turtle.orientation);
                this.turtles.push(new Turtle(pos, ori));
                //console.log("[");
                //console.log(turtle.position);

                let newAngle: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
                vec3.copy(newAngle, angles);
                angGroup.push(newAngle);

                let newScale: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
                vec3.copy(newScale, scale);
                scaleGroup.push(newScale);
                
            }
            if (ch == "]") {
                // for (let i = 0; i < this.turtles.length; i++) {
                //     console.log(this.turtles[i].position);
                // }
                turtle = this.turtles.pop();
                //console.log("]");
                //console.log(turtle.position);

                angles = angGroup.pop();

                scale = scaleGroup.pop();
            }
        }
    }
};

export default LSystem;