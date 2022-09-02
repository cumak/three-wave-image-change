uniform sampler2D uTextureImage;
uniform sampler2D uTextureImage2;

varying vec2 vUv;
varying float vDispVal;

void main(){
  vec4 textureColor = texture2D(uTextureImage, vUv);
  vec4 textureColor2 = texture2D(uTextureImage2, vUv);
  vec4 mixTexture = mix(textureColor, textureColor2, vDispVal);
  gl_FragColor = vec4(mixTexture);
}