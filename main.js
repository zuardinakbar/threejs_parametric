//IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;
const parameters = { resolution_x: 3, rotation_y: 100};
let res_x = parameters.resolution_x;
let rot_y = parameters.rotation_y;

var gui;
var scene;
var camera;
var renderer;
var container;
var control;

//Create an empty array for storing all the cubes
let scene_cubes = [];

function main(){
  //GUI
  gui = new GUI();
  gui.add( parameters, 'resolution_x',1,10,1);
  gui.add( parameters, 'rotation_y',0,180);

  //CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 100);
  camera.position.set(0, 0, 20)

  // Initiate first cubes
  createCubes();

  window.addEventListener('resize', handleResize);
 
  //CREATE A RENDERER
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);
  
  //CREATE MOUSE CONTROL
  control = new OrbitControls( camera, renderer.domElement );

  //EXECUTE THE UPDATE
  animate();
}
 
//-----------------------------------------------------------------------------------
//HELPER FUNCTIONS
//-----------------------------------------------------------------------------------
 
//CREATE GEOMETRY AND ADD TO THE SCENE
function createCubes(){
    for (let i = 0; i<res_x; i++){
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.set(i,0,0)
        cube.name = "cube " + i;
        scene_cubes.push(cube)
        scene.add( cube );
    }
}

//REMOVE OBJECT AND CLEAN THE CACHES
function removeObject(sceneObject){
  if (!(sceneObject instanceof THREE.Object3D)) return;

  //Remove geometries to free GPU resources
  if (sceneObject.geometry) sceneObject.geometry.dispose();

  //Remove materials to free GPU resources
  if (sceneObject.material) {
      if (sceneObject.material instanceof Array) {
          sceneObject.material.forEach(material => material.dispose());
      } else {
          sceneObject.material.dispose();
      }
  }

  //Remove object from scene
  sceneObject.removeFromParent()
};

function removeCubes(){
    if(res_x != parameters.resolution_x || rot_y != parameters.rotation_y){

        console.log("remove");

        res_x = parameters.resolution_x;
        rot_y != parameters.rotation_y;

        console.log(res_x, rot_y);

        scene_cubes.forEach(element => {

            let scene_cube = scene.getObjectByName(element.name);

            removeObject(scene_cube);
        })
        scene_cubes = [];
    }
}
 
//RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}

//ANIMATE AND RENDER
function animate() {
	requestAnimationFrame( animate );
 
  control.update();
 
	removeCubes();
  createCubes();
 
	renderer.render( scene, camera );
}
//-----------------------------------------------------------------------------------
// CLASS
//-----------------------------------------------------------------------------------

class Structure extends THREE.Group{

}

//-----------------------------------------------------------------------------------
// EXECUTE MAIN 
//-----------------------------------------------------------------------------------

main();