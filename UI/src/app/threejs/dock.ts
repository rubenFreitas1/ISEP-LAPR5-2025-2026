import * as THREE from 'three';
import { createCrane } from './crane';

export async function createDock(name: string): Promise<THREE.Group> {
  const group = new THREE.Group();

  const geometry = new THREE.BoxGeometry(60, 20, 150);
  const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const dock = new THREE.Mesh(geometry, material);
  dock.castShadow = true;
  dock.receiveShadow = true;

  
  dock.position.y = 5;

  
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.font = '28px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const labelMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const label = new THREE.Sprite(labelMat);
  label.scale.set(60, 20, 1);
  label.position.set(0, 20, 50);

  group.add(dock);
  group.add(label);

try {
    const crane = await createCrane();
    group.add(crane);
  } catch (err) {
    console.error('Erro ao carregar grua:', err);
  }



  return group;
}
