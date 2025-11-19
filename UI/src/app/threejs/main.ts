import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';


export function createScene() {

  //inicializa objetos essencias para a scene

  const clock = new THREE.Clock();
  const container = document.getElementById('render-target');
  const scene = new THREE.Scene();  

  const camera = new THREE.PerspectiveCamera(71, container!.offsetWidth / container!.offsetHeight, 0.1, 2000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(container!.offsetWidth, container!.offsetHeight);
  
 
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container?.appendChild(renderer.domElement);


  // Função para inicializar todos os objetos, luzes e camera
  function initialize(
    portStructure: THREE.Group,
    sea: THREE.Mesh,
    seaBed: THREE.Mesh,
    vessel: THREE.Object3D[],
    objects: THREE.Object3D[]
  ) {

    // Remove todos os objetos
    for (let i = scene.children.length - 1; i >= 0; i--) {
      const child = scene.children[i];
      if (!(child instanceof THREE.Light)) {
        scene.remove(child);
      }
    }

    // Adiciona estruturas passadas por parâmetro
    scene.add(portStructure);
    scene.add(sea);
    scene.add(...vessel);

    objects.forEach(obj => scene.add(obj));


    // Plano para sombras
    const shadowPlaneGeo = new THREE.PlaneGeometry(1200, 1200);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.2 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    const seaY = (sea.position && typeof (sea.position.y) === 'number') ? sea.position.y : 0;
    shadowPlane.position.y = seaY + 0.1;
    shadowPlane.receiveShadow = true;
    shadowPlane.castShadow = false;
    scene.add(shadowPlane);

    scene.add(seaBed);

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(300, 300, 300);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(2048, 2048);
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 2000;

    const d = 800;
    const sc = directionalLight.shadow.camera as THREE.OrthographicCamera;
    sc.left = -d; sc.right = d; sc.top = d; sc.bottom = -d;
    sc.updateProjectionMatrix();
    directionalLight.shadow.bias = -0.0005;

    directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight.target);
    scene.add(ambientLight, directionalLight);


    // Céu
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);
    const effectController = {
      turbidity: 2,
      rayleigh: 0.1,
      mieCoefficient: 0.004,
      mieDirectionalG: 0.8,
      elevation: 2,
      azimuth: 180
    };

    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

    const sunDir = directionalLight.position.clone().normalize();
    sky.material.uniforms['sunPosition'].value.copy(sunDir);


    // Câmera e controlos
    camera.position.set(200, 400, 400);
    camera.lookAt(0, 0, 0);
  }


  // Controlos da câmera
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;


  // Função de animação
  function draw() {
    const delta = clock.getDelta();
    (scene as any).traverse((obj: any) => {
      if (obj.material && obj.material.uniforms && obj.material.uniforms.time) {
        obj.material.uniforms.time.value += delta;
      }
    });
    controls.update();
    renderer.render(scene, camera);
  }


  // Funções para iniciar e parar a animação
  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  
  return {
    initialize,
    start,
    stop,
    scene,
    camera,
    renderer
  };
}
