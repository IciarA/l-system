import Turtle from './Turtle';
import {vec3} from 'gl-matrix';
import {mat4} from 'gl-matrix';
import {quat} from 'gl-matrix';


let expansionRules : Map<string, string> = new Map();
expansionRules.set('A', 'AB');
expansionRules.set('B', 'A');
//expansionRules.set('F', 'F[*T-T-F][#T+T+F]');
expansionRules.set('X', 'A')
expansionRules.set('A', 'BTTA');
expansionRules.set('B', 'T[&F*][&F*][&F*][&F*]');
expansionRules.set('C', 'T[&F*][&F*][&F*][&F*][&F*]');
expansionRules.set('F', 'F+F');
//expansionRules.set('F', 'F[+TT-TT-TT][+TT-TT-TT]F');

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

    flowerOffsetArray: number[];
    flowerOrientation: number[];

    turtles: Turtle[];
    grammar: string;

   

    lsystemParse(iterations: number, axiom: string) : string {
        var newstr = axiom;
        for (let i = 0; i < iterations; i++) {

            var newstr2 = "";
            for (let j = 0; j < newstr.length; j++) {
                if (newstr[j] == 'B') {
                    let rand: number = Math.random();
                    if (rand <= 0.5) {
                        newstr2 += expansionRules.get(newstr[j]);
                    }
                    else {
                        newstr2 += expansionRules.get('C');
                    }
                }
                else if (expansionRules.get(newstr[j])) {
                    newstr2 += expansionRules.get(newstr[j]);
                    
                }
                else {
                    newstr2 += newstr[j];
                }
            }

            newstr = newstr2;
            
        }
        return newstr;
    }

    lsystemProcess(iterations: number, rotation: number) {
        let grammar: string = this.lsystemParse(iterations, "X");
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

        let quadrant: number = 0;
        let oldQuadrant: number = 0;


        this.flowerOffsetArray = [];
        this.flowerOrientation = [];

        this.offsetArray.push(turtle.position[0]);
        this.offsetArray.push(turtle.position[1]);
        this.offsetArray.push(turtle.position[2]);

        this.orientationArray.push(angles[0]);
        this.orientationArray.push(angles[1]);
        this.orientationArray.push(angles[2]);

        this.scaleArray.push(scale[0]);
        this.scaleArray.push(scale[1]);
        this.scaleArray.push(scale[2]);

        console.log(grammar);
        for (let i = 0; i < grammar.length; i++) {
            let ch: string = grammar.charAt(i);
            if (ch == "F" || ch == "T") {

                turtle.moveForward(scale);

                this.offsetArray.push(turtle.position[0]);
                this.offsetArray.push(turtle.position[1]);
                this.offsetArray.push(turtle.position[2]);
                this.orientationArray.push(angles[0]);
                this.orientationArray.push(angles[1]);
                this.orientationArray.push(angles[2]);

                this.scaleArray.push(scale[0]);
                this.scaleArray.push(scale[1]);
                this.scaleArray.push(scale[2]);
            }

            if (ch == "+") {
                turtle.rotateZ(rotation);

                angles[2] += rotation;

                scale[0] /= 1.1;
                scale[1] /= 1.05;
                scale[2] /= 1.1;
            }
            if (ch == "-") {
                turtle.rotateZ(330.0);

                angles[2] += 330.0;

                scale[0] /= 1.1;
                scale[1] /= 1.05;
                scale[2] /= 1.1;
            }
            if (ch == "*") {

                let newScale: vec3 = vec3.create();
                vec3.divide(newScale, scale, vec3.fromValues(2.0, 2.0, 2.0));
                turtle.moveForward(newScale);

                this.flowerOffsetArray.push(turtle.position[0]);
                this.flowerOffsetArray.push(turtle.position[1]);
                this.flowerOffsetArray.push(turtle.position[2]);

                this.flowerOrientation.push(angles[0]);
                this.flowerOrientation.push(angles[1]);
                this.flowerOrientation.push(angles[2]);
            }

            if (ch == "&") {

                let rand: number = Math.random() * (70.0) + (oldQuadrant);
                console.log("random number:");
                console.log(rand);
                angles[1] += rand;
                oldQuadrant = rand + 45.0;
            }
            if (ch == "[") {
                let pos: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
                let ori: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
                vec3.copy(pos, turtle.position);
                vec3.copy(ori, turtle.orientation);
                //let newTurtle = new Turtle(turtle.position, turtle.orientation);
                this.turtles.push(new Turtle(pos, ori));

                let newAngle: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
                vec3.copy(newAngle, angles);
                angGroup.push(newAngle);

                let newScale: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
                vec3.copy(newScale, scale);
                scaleGroup.push(newScale);
                
            }
            if (ch == "]") {

                turtle = this.turtles.pop();

                angles = angGroup.pop();

                scale = scaleGroup.pop();
            }
        }
    }
};

export default LSystem;