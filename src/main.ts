import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import vertexShader from "/src/shaders/vertexShader.glsl";
import fragmentShader from "/src/shaders/fragmentShader.glsl";
import image from "/src/textures/img-1.jpeg";
import image2 from "/src/textures/img-2.jpeg";
import bg_b from "/src/textures/bg-b.png";
import bg_d from "/src/textures/bg-d.png";
import bg_f from "/src/textures/bg-f.png";
import bg_l from "/src/textures/bg-l.png";
import bg_r from "/src/textures/bg-r.png";
import bg_u from "/src/textures/bg-u.png";
import gsap from "gsap";

const gui = new dat.GUI({ width: 300 });

const mouse = new THREE.Vector2();

const START_TIME = 1

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas: HTMLElement = document.querySelector(".webglGallery") as HTMLElement;

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const textureImage = textureLoader.load(image);
const textureImage2 = textureLoader.load(image2);

const urls = [bg_r,bg_l,bg_u,bg_d,bg_f,bg_b,]
const loader = new THREE.CubeTextureLoader();
scene.background = loader.load(urls);

const geometry = new THREE.PlaneGeometry(1.5, 1, 512, 512);

const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,    
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,        
  transparent: true,             

  uniforms: {
    uTextureImage: { value: textureImage },
    uTextureImage2: { value: textureImage2 },
    uTime: { value: START_TIME },  
    uFreqency: { value: 9.25 },   
    uWaveLength: { value: 0.082 },   
    uFreqency2: { value: 1.13 },   
    uWaveLength2: { value: 0.674 },
    uTopDown: { value: -0.403 },    
    uSpeed: { value: 2.3 },         
    uPosAddZ: { value: 7.31 },
    uDispHandle: { value: -2 },
  }
});


const mesh = new THREE.Mesh(geometry, material);
mesh.name = 'picture';
scene.add(mesh);


const camera = new THREE.PerspectiveCamera(
  75,                        
  sizes.width / sizes.height,
  0.0001,                    
  10                         
);
camera.position.set(0, Math.cos(Math.PI * 1.2), 1);


const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,   
});

const resizeRenderer = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  renderer.setSize(sizes.width, sizes.height);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};


const raycaster = new THREE.Raycaster();

let startTime = Date.now();

let firstflag = true;

const animate = () => {

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  const topDowntarget = material.uniforms.uTopDown;
  let speed = material.uniforms.uSpeed;
  let dispHandle = material.uniforms.uDispHandle;

  if (intersects.length === 1 && intersects[0].object.name === 'picture') {

      const time = (Date.now() - startTime) / 1000 - START_TIME;
      const maxTime = 1.4;
      if((Date.now() - startTime) / 1000 - START_TIME > maxTime){
        material.uniforms.uTime.value = maxTime;
      }else{
        material.uniforms.uTime.value = time;
      }
  
      if(firstflag){
        gsap.to(topDowntarget,{value:-0.403,duration:1,ease:"power1.out"})
        gsap.to(speed,{value: 2.3 ,duration:1})
        gsap.to(dispHandle,{value: 4.5 ,duration:1.9, delay:0.8})
        firstflag = false;
      }
    
  } else {
  
    firstflag = true;
    gsap.to(topDowntarget,{value:-1.0,duration:1,ease:"power1.out",onComplete:()=>{material.uniforms.uTime.value = START_TIME}})
    gsap.to(speed,{value: 2.6 ,duration:1})
    gsap.to(dispHandle,{value: -2 ,duration:1})

    startTime = Date.now();
  }
  
  renderer.render(scene, camera);
  controls.update();

  window.requestAnimationFrame(animate);
};


window.addEventListener("resize", () => {
  resizeRenderer();
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

canvas.addEventListener('mousemove', (event: MouseEvent) => {
  const element = event.currentTarget as HTMLElement;
  const x = event.clientX - element.offsetLeft;
  const y = event.clientY - element.offsetTop;
  const w = element.offsetWidth;
  const h = element.offsetHeight;
  mouse.x = (x / w) * 2 - 1;
  mouse.y = -(y / h) * 2 + 1;
});

resizeRenderer();

animate();

gui
  .add(material.uniforms.uFreqency, "value")
  .min(0)
  .max(50)
  .name("uFreqency");
gui
  .add(material.uniforms.uWaveLength, "value")
  .min(0)
  .max(2)
  .name("uWaveLength");
gui
  .add(material.uniforms.uFreqency2, "value")
  .min(0)
  .max(10)
  .name("uFreqency2");
gui
  .add(material.uniforms.uWaveLength2, "value")
  .min(0)
  .max(2)
  .name("uWaveLength2");
// gui
// .add(material.uniforms.uTopDown,"value")
// .min(-1)
// .max(0)
// .name("uTopDown");
// gui
//   .add(material.uniforms.uSpeed, "value")
//   .min(0)
//   .max(3.5)
//   .name("uSpeed");
// gui
//   .add(material.uniforms.uPosAddZ, "value")
//   .min(0)
//   .max(10)
//   .name("uPosAddZ");
// gui
//   .add(material.uniforms.uDispHandle, "value")
//   .min(-2)
//   .max(5)
//   .name("uDispHandle");

// gui.show(false)