import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export async function createCrane(): Promise<THREE.Object3D> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      'assets/models/shipToShoreCrane.glb',
      (gltf) => {
        const object = gltf.scene;

        object.scale.set(4, 4, 4);
        object.position.set(18, 57, 0);
        object.rotation.y = 0;

        // 🎨 Material metálico amarelo
        const brightRed = new THREE.MeshStandardMaterial({
            color: 0xff0000,     // amarelo mais claro
            metalness: 0.1,      // ainda metálico, mas menos reflexivo
            roughness: 0.35,     // um pouco mais difuso
            emissive: 0x222200,  // leve brilho próprio (dá vitalidade)
            emissiveIntensity: 0.2,
        });

        // 🧱 Aplica o material a todos os meshes
        object.traverse((child: any) => {
          if (child.isMesh) {
            child.material = brightRed;
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.side = THREE.DoubleSide;
            child.geometry.computeVertexNormals();
          }
        });

        resolve(object);
      },
      undefined,
      (error) => {
        console.error('Erro ao carregar modelo GLB:', error);
        reject(error);
      }
    );
  });
}
