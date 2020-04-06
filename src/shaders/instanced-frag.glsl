#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;

in vec4 fs_LightDir;
in vec4 fs_Nor;

out vec4 out_Col;

void main()
{
    // Lambert
    vec4 col = vec4(0.8, 0.2, 0.2, 1.0);
    float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightDir));
    diffuseTerm = abs(diffuseTerm);
    diffuseTerm = clamp(diffuseTerm, 0.f, 1.f);

    float ambientTerm = 0.55;

    float lightIntensity = diffuseTerm + ambientTerm;

    vec4 lightColor = vec4(1,1,1,0);

    out_Col = vec4(col.rgb * lightIntensity, 1.0);

}
