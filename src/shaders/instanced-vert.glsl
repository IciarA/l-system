#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform mat4 u_Model;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

uniform vec3 u_Up;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec4 vs_Nor; // Non-instanced, and presently unused
in vec4 vs_Col; // An instanced rendering attribute; each particle instance has a different color
in vec3 vs_Translate; // Another instance rendering attribute used to position each quad instance in the scene
in vec3 vs_Orient;
in vec3 vs_Scale;
in vec4 vs_Quat;
in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.

out vec4 fs_Col;
out vec4 fs_Pos;
out vec4 fs_Nor;

out vec4 fs_LightDir;


mat4 rotateX(float rad) {
    mat4 m = mat4(1.0);
    m[1][1] = cos(rad);
    m[2][1] = -sin(rad);
    m[1][2] = sin(rad);
    m[2][2] = cos(rad);
    return m;
}

mat4 rotateY(float rad) {
    mat4 m = mat4(1.0);
    m[0][0] = cos(rad);
    m[2][0] = sin(rad);
    m[0][2] = -sin(rad);
    m[2][2] = cos(rad);
    return m;
}

mat4 rotateZ(float rad) {
    mat4 m = mat4(1.0);
    m[0][0] = cos(rad);
    m[1][0] = -sin(rad);
    m[0][1] = sin(rad);
    m[1][1] = cos(rad);
    return m;
}



void main()
{
    fs_Col = vs_Col;
    fs_Pos = vs_Pos;
    //fs_Pos = vs_Translate;
    //fs_Nor = vs_Nor;

    vec3 offset = vs_Translate;

    vec4 pos = vs_Pos; //vec3(vs_Pos.x, vs_Pos.y * 1.5, vs_Pos.z); // scale;
    pos = vec4(pos[0] * vs_Scale[0], pos[1] * vs_Scale[1], pos[2] * vs_Scale[2], 1.f);

    float angleZ = vs_Orient[2];
    angleZ = angleZ * (3.1416 / 180.0);


    float angleY = vs_Orient[1];
    angleY = angleY * (3.1416 / 180.0);


    pos = rotateZ(angleZ) * pos;
    

    vec4 normal = vs_Nor;
    normal = rotateZ(angleZ) * normal;
    normal = rotateY(angleY) * normal;

    fs_Nor = normalize(normal);

    

    pos.xyz = pos.xyz + offset;

    pos = rotateY(angleY) * pos;
    
    vec4 lightPos = vec4(2.0, 6.0, -5.0, 0.0);
    fs_LightDir = lightPos - pos;

    gl_Position = u_ViewProj * pos;

    
}
