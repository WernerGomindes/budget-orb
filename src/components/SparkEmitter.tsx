import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { System, Emitter, Rate, Life, Mass, Radius, Vector3D, SpriteRenderer } from 'three-nebula';

interface SparkEmitterProps {
  onSparkComplete?: () => void;
  position: [number, number, number];
}

export function SparkEmitter({ onSparkComplete, position }: SparkEmitterProps) {
  const { scene } = useThree();
  const systemRef = useRef<System | null>(null);

  useEffect(() => {
    // Create particle system
    const system = new System();
    
    // Create geometry and material for particles
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      size: 0.5,
      color: 0xffd700,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    
    // Create points object
    const points = new THREE.Points(geometry, material);
    
    // Create emitter with proper method chaining
    const emitter = new Emitter();
    
    // Configure emitter properties individually
    emitter.rate = new Rate(new Vector3D(4, 6), new Vector3D(0, 0));
    emitter.addInitializer(new Mass(1));
    emitter.addInitializer(new Radius(0.1, 0.3));
    emitter.addInitializer(new Life(0.5, 1));
    emitter.addInitializer(new Vector3D(position[0], position[1], position[2]));

    // Add renderer
    const spriteRenderer = new SpriteRenderer(scene, THREE);
    emitter.addRenderer(spriteRenderer);

    // Add emitter to system
    system.addEmitter(emitter);
    
    systemRef.current = system;

    // Start the system
    system.emit();

    return () => {
      geometry.dispose();
      material.dispose();
      if (systemRef.current) {
        systemRef.current.destroy();
      }
    };
  }, [scene, position]);

  useEffect(() => {
    const system = systemRef.current;
    if (!system) return;

    const animate = () => {
      system.update();
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return null;
} 