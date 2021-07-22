import { classic3DNoise } from "./noiseShader";

export const displacmentVertexShader =
	classic3DNoise +
	/* glsl */ `
varying vec2 vUv;
varying float noise;
uniform float time;
varying vec3 vNormal;
varying vec4 vPosition;

float turbulence(vec3 p) {
  float t = -0.5;

  for (int f = 1; f <= 10; f++) {
    float power = pow(2.0, float(f));
    t += abs( pnoise(power * p, vec3(10.0)) / power);
  }
  return t;
}

void main() {
  vUv = uv;
  vNormal = normal;

  // get a turbulent 3d noise using the normal, normal to high frequency
  noise = turbulence( 0.5 * position + time );

  // get a 3d noise using the position, low frequency
  float b = 0.1 * pnoise( 2.0 * position + vec3( 2.0 * time), vec3(20.0));

  //compose noises
  float displacement = noise + b;
  // float displacement = noise;
  // float displacement = b;

  // move the position along the normal and transform it
  vec3 newPosition = position + normal * displacement;
  vPosition = modelMatrix  * vec4(newPosition, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

export const displacmentFragmentShader = /* glsl */ `
varying vec2 vUv;
varying float noise;
varying vec3 vNormal;
varying vec4 vPosition;

uniform float lineWidth;
uniform float lineDistance;

#define SQRT2 1.41421356
#define PI 3.14159
#define SKEWNESS 4.0


float isPointOnLine(float position, float differentialLength) {
	float fractionPartOfPosition = position - floor(position + 0.5);
	fractionPartOfPosition /= differentialLength;
	fractionPartOfPosition = clamp(fractionPartOfPosition, -1., 1.);
  float result = 0.5 + 0.5 * cos(fractionPartOfPosition * PI);
  result = sqrt(result);
	return result;
}

float getAnisotropicAttenuation(float differentialLength) {
  const float maxNumberOfLines = 10.0;
  return clamp(1.0 / (differentialLength + 1.0) - 1.0 / maxNumberOfLines, 0.0, 1.0);
}

float contributeOnAxis(float position) {
	float differentialLength = length(vec2(dFdx(position), dFdy(position)));
	differentialLength *= SQRT2;

  float result = isPointOnLine(position, differentialLength);

	float anisotropicAttenuation = getAnisotropicAttenuation(differentialLength);
	//result *= anisotropicAttenuation;

  return result;
}

void main() {
  // color is RGBA: u, v, 0, 1
  vec2 color = vUv * (1.0 - 2.0 * noise);
  // gl_FragColor = vec4(normalize(vNormal), 1.0);

  float opacity = 0.0;
  // float moddedX = mod(vPosition.x, lineDistance);
  float moddedX = vPosition.x / lineDistance - floor(vPosition.x / lineDistance + 0.5);
  if (abs(moddedX) <= lineWidth) {
    float normalizedX = SKEWNESS * moddedX / lineWidth;
    opacity = min(min(normalizedX, SKEWNESS - normalizedX), 1.0);
  }

  // from babylonjs
  moddedX = vPosition.x / lineDistance;
  opacity = contributeOnAxis(moddedX);

  gl_FragColor = vec4(0.0, 0.0, 0.0, opacity);
}
`;

/*
 */

export const gridShader = /* glsl */ `
precision mediump float;

uniform float vpw; // Width, in pixels
uniform float vph; // Height, in pixels

uniform vec2 offset; // e.g. [-0.023500000000000434 0.9794000000000017], currently the same as the x/y offset in the mvMatrix
uniform vec2 pitch;  // e.g. [50 50]

void main() {
  float lX = gl_FragCoord.x / vpw;
  float lY = gl_FragCoord.y / vph;

  float scaleFactor = 10000.0;

  float offX = (scaleFactor * offset[0]) + gl_FragCoord.x;
  float offY = (scaleFactor * offset[1]) + (1.0 - gl_FragCoord.y);

  if (int(mod(offX, pitch[0])) == 0 ||
      int(mod(offY, pitch[1])) == 0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5);
  } else {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}
`;
