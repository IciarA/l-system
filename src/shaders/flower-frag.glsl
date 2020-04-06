#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;

in vec4 fs_LightDir;
in vec4 fs_Nor;

out vec4 out_Col;

void main()
{

    vec4 col = vec4(fs_Col.rgb / vec3(255.0, 255.0, 255.0), fs_Col[3]);
    out_Col = col;
}
