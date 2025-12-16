import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Injectable({
  providedIn: 'root'
})
export class CameraAnimatorService {
  private animating = false;

  animateCameraToTarget(
    camera: THREE.Camera,
    controls: OrbitControls,
    targetPosition: THREE.Vector3,
    duration: number = 1000
  ): Promise<void> {
    return new Promise((resolve) => {
      if (this.animating) {
        resolve();
        return;
      }

      this.animating = true;

      const startPosition = camera.position.clone();
      const startTarget = controls.target.clone();

      // Calcular distância adequada baseada na altura atual da câmera
      const currentDistance = camera.position.distanceTo(controls.target);
      const desiredDistance = Math.max(currentDistance * 0.5, 200); // Mínimo de 200 unidades

      // Calcular direção da câmera para o target
      const direction = new THREE.Vector3()
        .subVectors(camera.position, targetPosition)
        .normalize();

      // Nova posição da câmara (afastada do objeto)
      const endPosition = new THREE.Vector3()
        .copy(targetPosition)
        .add(direction.multiplyScalar(desiredDistance));

      // Manter a altura da câmera razoável
      endPosition.y = Math.max(endPosition.y, 100);

      const endTarget = targetPosition.clone();

      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (easeInOutQuad)
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Interpolar posição
        camera.position.lerpVectors(startPosition, endPosition, eased);
        controls.target.lerpVectors(startTarget, endTarget, eased);
        controls.update();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.animating = false;
          resolve();
        }
      };

      animate();
    });
  }

  isAnimating(): boolean {
    return this.animating;
  }
}
