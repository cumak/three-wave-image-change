uniform float uTime;
uniform float uFreqency;
uniform float uWaveLength;
uniform float uFreqency2;
uniform float uWaveLength2;
uniform float uFreqency3;
uniform float uWaveLength3;
uniform float uTopDown;
uniform float uSpeed;
uniform float uPosAddZ;
uniform float uDispHandle;

varying vec2 vUv;
varying float vDispVal;

void main(){
  vec4 modelPosition = modelMatrix * vec4(position,1.0);
  float elevation = 
    max(
    (sin(((-modelPosition.x - modelPosition.y) + uTime * uSpeed) * uFreqency)) * uWaveLength
    + (cos(((-modelPosition.x - modelPosition.y) + uTime * uSpeed) * uFreqency2) * uWaveLength2)
    + uTopDown
    , 0.0)
    ;

  modelPosition.z += elevation;

  float disp = (-modelPosition.x - modelPosition.y) + 0.6 * uDispHandle;

  vDispVal = min(max(0.0,sin(modelPosition.z) * uPosAddZ + disp) , 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
  vUv = uv;
}