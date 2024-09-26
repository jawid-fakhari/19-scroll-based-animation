import * as THREE from "three";
import GUI from "lil-gui";

/***********************************
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ffeded",
  objectDistance: 4,
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
});

/**********************************
 * Texture
 */
const loader = new THREE.TextureLoader();
const texture = loader.load("/textures/gradients/3.jpg");
texture.colorSpace = THREE.SRGBColorSpace;

//webgl cerca sempre di merge i colori vicini per avere un risultato gradiente, usare magFilter diverso dal default
texture.magFilter = THREE.NearestFilter;

/***********************************
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/***********************************
 * Objects
 */
//creare dei Mesh di prova
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: texture,
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
scene.add(mesh1, mesh2, mesh3);

//Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

const meshes = [mesh1, mesh2, mesh3];

for (let i = 0; i < meshes.length; i++) {
  meshes[i].position.y = -parameters.objectDistance * i;
}

//scroll listener, animate camera con scroll in animation function
let lastScrollY = 0;

document.addEventListener("scroll", () => {
  lastScrollY = window.scrollY;
});

//poszionare i mesh nel posto giusto rispetto al posizione del
mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

//Parallax effect, muovere la camera o il background in tal modo che user sente la profondità
//cursor listnere sul asse x e y, animate camera con i valori avuti dal cursore nel animation function
let cursorX = 0;
let cursorY = 0;
document.addEventListener("mousemove", (e) => {
  cursorX = e.clientX / sizes.width - 0.5;
  cursorY = e.clientY / sizes.height - 0.5;
});

//Crea Prticles,count, flot32array p * 3, for(), i3 metod, particGeo, pg set Attrib, partiMat color sizeAtt size, points,
//set particles in tutto il viewport


//aggiungere gui per il colore
//fai qualcosa in più

// spin objec con gsap quando arrivi ad ogni sezione, quindi serve contatore dei sezioni, mettere una condizione che attiva gsap.to che va a prendere ogni mesh dall'array dei meshes in base alla section

/**********************************
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/***********************************
 * Camera
 */
//group camera
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/***********************************
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  //colore canvas è nero ma possiamo cambiarlo prima mettiamo alpha per decolorarlo poi nel css aggiungiamo il background che vogliamo.
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/***********************************
 * Animate
 */
const clock = new THREE.Clock();
let prevTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  for (const mesh of meshes) {
    mesh.rotation.x = elapsedTime * 0.09;
    mesh.rotation.y = elapsedTime * 0.1;
  }

  //cambiare poszione della camera
  camera.position.y = (-lastScrollY / sizes.height) * parameters.objectDistance;

  const parallaxX = cursorX;
  const parallaxY = -cursorY;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * deltaTime * 1.5;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * deltaTime * 1.5;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
