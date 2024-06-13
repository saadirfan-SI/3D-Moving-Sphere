import * as THREE from "three"; // Importing the Three.js library
import "./styles.css"; // Importing CSS styles
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; // Importing OrbitControls for camera manipulation
import gsap from "gsap"; // Importing GSAP for animations

// Scene
const scene = new THREE.Scene(); // Creating a new Three.js scene

// Creating the Sphere
const geometry = new THREE.SphereGeometry(3, 64, 64); // Creating a sphere geometry
const material = new THREE.MeshStandardMaterial({ // Creating a standard material for the sphere
    color: '#00ff83', // Setting color
    roughness: 0.2, // Adjusting roughness for shininess
});
const mesh = new THREE.Mesh(geometry, material); // Creating a mesh using the geometry and material
scene.add(mesh); // Adding the mesh to the scene

// Sizes of the viewport
const sizes = {
    width: window.innerWidth, // Setting initial width
    height: window.innerHeight, // Setting initial height
};

// Light
const light = new THREE.PointLight(0xffffff, 70, 100, 1.7); // Creating a point light
light.position.set(0, 10, 10); // Setting light position
scene.add(light); // Adding light to the scene

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100); // Creating a perspective camera
camera.position.z = 20; // Setting camera position
scene.add(camera); // Adding camera to the scene

// Renderer
const canvas = document.querySelector('.webgl'); // Selecting the canvas element
const renderer = new THREE.WebGLRenderer({ canvas }); // Creating a WebGL renderer
renderer.setSize(sizes.width, sizes.height); // Setting renderer size
renderer.setPixelRatio(2); // Adjusting pixel ratio for smoother edges
renderer.render(scene, camera); // Rendering the scene

// Controls to move the sphere
const controls = new OrbitControls(camera, canvas); // Creating OrbitControls
controls.enableDamping = true; // Enable damping for smoother camera movement
//controls.enablePan = false; // Allowing or disallowing panning
controls.enableZoom = false; // Allowing or disallowing zooming
controls.autoRotate = true; // Setting auto-rotation
controls.autoRotateSpeed = 5; // Setting auto-rotation speed

// Resize
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

// Animation loop
const loop = () => {
    controls.update(); // Update controls for camera movement
    renderer.render(scene, camera); // Render the scene
    window.requestAnimationFrame(loop); // Request animation frame for smooth animation
};

loop(); // Start the animation loop

// Timeline animation
const tl = gsap.timeline({ default: { duration: 1 } }); // Creating a GSAP timeline
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }); // Animation for scaling the mesh
tl.fromTo('nav', { y: "-100%" }, { y: "0%" }); // Animation for navigation
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 }); // Animation for title opacity

// Mouse animation color
let mouseDown = false; // Variable to track mouse down state
let rgb = []; // Array to store RGB values
window.addEventListener("mousedown", () => (mouseDown = true)); // Event listener for mouse down
window.addEventListener("mouseup", () => (mouseDown = false)); // Event listener for mouse up

window.addEventListener('mousemove', (e) => {
    if (mouseDown) { // Check if mouse is down
        rgb = [ // Calculate RGB values based on mouse position
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150
        ];

        // Animate color change
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
        gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b });
    }
});
