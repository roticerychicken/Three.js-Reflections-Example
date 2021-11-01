import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../build/OrbitControls.js';
import { FlakesTexture } from '../build/FlakesTexture.js';
import { RGBELoader } from '../build/RGBELoader.js';
import { Reflector } from '../build/Reflector.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1/1000)
const renderer = new THREE.WebGLRenderer({antialias:true})
console.log(scene)

renderer.setSize(innerWidth,innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
camera.position.z = 5;




const pointlight = new THREE.PointLight(0xffffff,1);
pointlight.position.set(200,200,200);
scene.add(pointlight);



const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const intensity = 0.2;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

let texture = new THREE.CanvasTexture(new FlakesTexture());
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.x = 0;
texture.repeat.y = 0;

const sphereMaterial = {
	clearcoat: 1.0,
	clearcoatRoughness:0,
	metalness: 0.3,
	roughness: 0,
	color: 0xffffff,
	normalMap: texture,
	normalScale: new THREE.Vector2(0.15,0.15)
};


const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 1000, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
const sphereCamera = new THREE.CubeCamera(5,1000,cubeRenderTarget);
sphereCamera.position.set(5,0,3);
scene.add(sphereCamera)
let sphereMat = new THREE.MeshBasicMaterial({
	envMap: sphereCamera.renderTarget 
});
let sphereGeo = new THREE.SphereGeometry( 5, 32, 16 );
let sphere1 = new THREE.Mesh(sphereGeo, sphereMat);
sphere1.position.set(5,0,3);
scene.add(sphere1);



let geometry1, groundMirror;
geometry1 = new THREE.CircleGeometry( 40, 64 );
groundMirror = new Reflector( geometry1, {
	clipBias: 0.003,
	textureWidth: window.innerWidth * window.devicePixelRatio,
	textureHeight: window.innerHeight * window.devicePixelRatio,
	color: 0x777777,
	side: THREE.DoubleSide
} );
groundMirror.position.set(0,0,-40)
//scene.add( groundMirror );




const geometry = new THREE.SphereGeometry( 3, 32, 16 );
const ballmaterial = new THREE.MeshPhysicalMaterial(sphereMaterial);
const sphere = new THREE.Mesh( geometry, ballmaterial );
sphere.position.set(-5,0,3);
scene.add( sphere );



{
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      'https://threejsfundamentals.org/threejs/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });
 }


function animate() {
	requestAnimationFrame(animate)
	renderer.render(scene,camera)

	sphereCamera.updateCubeMap(renderer,scene)
}
animate()


