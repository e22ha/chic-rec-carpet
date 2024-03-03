console.log("Hello");
// Import Three.js
import * as THREE from "/three.module.min.js";
import * as TWEEN from "/tween.esm.js";

let container,
  camera,
  scene,
  renderer,
  plane,
  mouseDown = false,
  offset = new THREE.Vector2();
let currentMaterialIndex = 0;
const materials = [
  new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }),
  new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
];

// Add your texture to the materials array
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load("textures/your_texture_file.jpg");
// materials.push(
//   new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),
// );

function init() {
  container = document.getElementById("threejs-container");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.z = 100;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x222222, 1);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(50, 50);
  plane = new THREE.Mesh(geometry, materials[currentMaterialIndex]);
  scene.add(plane);

  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  document.addEventListener("mousedown", onDocumentMouseDown, false);
  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener("mouseleave", onDocumentMouseLeave, false);
  document.addEventListener("mouseup", onDocumentMouseUp, false);

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  mouseDown = true;
}

function onDocumentMouseMove(event) {
  if (mouseDown) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([plane]);
    if (intersects.length > 0) {
      const newPosition = intersects[0].point.clone().sub(offset);
      newPosition.z = 0; // Keep the plane parallel to the camera
      plane.position.copy(newPosition);
    }
  }
}

function onDocumentMouseUp(event) {
  mouseDown = false;
}

function onDocumentMouseLeave(event) {
  mouseDown = false;

  // Animate the plane back to the center with bouncing
  const centerPosition = new THREE.Vector3(0, 0, 0);
  const currentPosition = plane.position.clone();
  const time = 1000; // Duration of the animation in milliseconds
  const easingFunction = TWEEN.Easing.Elastic.Out;

  new TWEEN.Tween(currentPosition)
    .to(centerPosition, time)
    .easing(easingFunction)
    .onUpdate(() => {
      plane.position.copy(currentPosition);
    })
    .start();
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update(); // Update TWEEN animations
  render();
}

function render() {
  renderer.render(scene, camera);
}

init();
animate();
