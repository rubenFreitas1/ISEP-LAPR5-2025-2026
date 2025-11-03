import { Water } from 'three/examples/jsm/objects/Water.js';
import * as THREE from 'three';

export function createSea(): THREE.Mesh {
    const waterGeometry = new THREE.PlaneGeometry(1000, 1000);

    const waterNormals = new THREE.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg',(texture) => {texture.wrapS = texture.wrapT = THREE.RepeatWrapping;});

    
    const water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        sunDirection: new THREE.Vector3(0, 1, 0),
        sunColor: 0xffffff,
        waterColor: 0x004f7c,
        distortionScale: 1.2,
        fog: false,
    });

    water.rotation.x = -Math.PI / 2;
    water.position.y = 0;
    return water;
}

