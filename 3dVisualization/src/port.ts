import * as THREE from "three";


export function createPortStructure()
{
    const portStructure = new THREE.Group();
    const loader = new THREE.TextureLoader();

    const colorMap = loader.load('../textures/portConcrete/Concrete044A_1K-JPG_Color.jpg');
    const normalMap = loader.load('../textures/portConcrete/Concrete044A_1K-JPG_NormalGL.jpg');
    const roughnessMap = loader.load('../textures/portConcrete/Concrete044A_1K-JPG_Roughness.jpg');

    
    // Material base
    const material = new THREE.MeshStandardMaterial({ map: colorMap, normalMap: normalMap, roughnessMap: roughnessMap });

    // Cais principal
    const dockGeometry = new THREE.BoxGeometry(400, 30, 150);
    const dockMesh = new THREE.Mesh(dockGeometry, material);
    dockMesh.position.y = 1; // ligeiramente acima do chão
    portStructure.add(dockMesh);

    // Doca esquerda
    const leftDockGeometry = new THREE.BoxGeometry(70, 30, 200);
    const leftDockMesh = new THREE.Mesh(leftDockGeometry, material);
    leftDockMesh.position.set(-100, 1, 100); // ajusta posição conforme layout
    portStructure.add(leftDockMesh);

    // Doca direita
    const rightDockGeometry = new THREE.BoxGeometry(70, 30, 200);
    const rightDockMesh = new THREE.Mesh(rightDockGeometry, material);
    rightDockMesh.position.set(150, 1, 100);
    portStructure.add(rightDockMesh);

    return portStructure;
}