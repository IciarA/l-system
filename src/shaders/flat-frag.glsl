#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

in vec2 fs_Pos;
out vec4 out_Col;

// Noise Functions
float rand(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}


float interpNoise2D(vec2 p) {
    vec2 intP = floor(p);
    vec2 fractP = fract(p);

    // Get a random value from each of the 4 corners that contain point p
    float v1 = rand(intP);
    float v2 = rand(intP + vec2(1.0, 0.0));
    float v3 = rand(intP + vec2(0.0, 1.0));
    float v4 = rand(intP + vec2(1.0, 1.0));

    vec2 u = fractP * fractP * (3.0f - 2.0f * fractP);

    return mix(v1, v2, u.x) + (v3 - v1)* u.y * (1.0 - u.x) + (v4 - v2) * u.x * u.y;
}

float fbm3 (vec2 p) {
    // Initialize the variables to be used
    float total = 0.0;
    float amplitude = 0.5;
    int octaves = 8;

    // For loop that interates through octaves
    for (int i = 0; i < octaves; i++) {
        total += amplitude * interpNoise2D(p);
        p *= 1.5;
        amplitude *= .5;
    }

    return total;
}


// Perlin noise 
vec2 hash( vec2 x )
{
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    x = x*k + k.yx;
    return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
}

float noised( vec2 p )
{
  vec2 i = floor( p );
  vec2 f = fract( p );

  vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
  vec2 du = 30.0*f*f*(f*(f-2.0)+1.0);

  vec2 ga = hash( i + vec2(0.0,0.0) );
  vec2 gb = hash( i + vec2(1.0,0.0) );
  vec2 gc = hash( i + vec2(0.0,1.0) );
  vec2 gd = hash( i + vec2(1.0,1.0) );

  float va = dot( ga, f - vec2(0.0,0.0) );
  float vb = dot( gb, f - vec2(1.0,0.0) );
  float vc = dot( gc, f - vec2(0.0,1.0) );
  float vd = dot( gd, f - vec2(1.0,1.0) );

  return va + u.x*(vb-va) + u.y*(vc-va) + u.x*u.y*(va-vb-vc+vd);
}



void main() {
  //out_Col = vec4(0.5 * (fs_Pos + vec2(1.0)), 0.0, 1.0);
  vec3 white = (rand(vec2(fs_Pos.x, fs_Pos.y))) * vec3(1.0, 1.0, 1.0) + (1.0 - rand(vec2(fs_Pos.x, fs_Pos.y))) * vec3(0.7, 0.7, 0.0);
  vec3 night_sky = vec3(0.0, 0.0, 0.0);

  vec3 col1 = vec3(0.73, 0.56, 0.56);
  vec3 col2 = vec3(0.54, 0.27, 0.074);
  vec4 finalColor1 = vec4(mix(col1, col2, fbm3(fs_Pos.xy * 3.0)), 1.0);

  vec3 col = mix(night_sky, white, clamp(rand(vec2(fs_Pos.x, fs_Pos.y)) - 0.7, 0.0, 1.0));

  vec3 purple = vec3(0.54, 0.0, 0.54);

  col = mix(col, purple, fbm3(fs_Pos.xy));

  vec4 finalColor2 = vec4(col, 1.0);

  if (fs_Pos[1] >= 0.0 && fs_Pos[1] <= 0.25) {
    //)
    out_Col = mix(finalColor1, finalColor2, (fs_Pos[1] * 4.0));
    //out_Col = vec4(0.0, 1.0, 0.0, 1.0);
  }
  else if (fs_Pos[1] < 0.0) {
    vec3 col1 = vec3(0.73, 0.56, 0.56);
    vec3 col2 = vec3(0.54, 0.27, 0.074);
    out_Col = vec4(mix(col1, col2, fbm3(fs_Pos.xy * 3.0)), 1.0);
  }
  else {
    vec3 col = mix(night_sky, white, clamp(rand(vec2(fs_Pos.x, fs_Pos.y)) - 0.7, 0.0, 1.0));

    vec3 purple = vec3(0.54, 0.0, 0.54);

    col = mix(col, purple, fbm3(fs_Pos.xy));

    out_Col = vec4(col, 1.0);
    //out_Col = vec4(0.0, 0.0, 0.0, 1.0);
  }
}
