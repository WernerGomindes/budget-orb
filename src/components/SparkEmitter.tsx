import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { System, Emitter, Rate, Life, Mass, Radius, SpriteRenderer } from 'three-nebula';

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
    
    // Create emitter with proper configuration
    const emitter = new Emitter()
      .setRate(new Rate(4, 6))
      .addInitializers([
        new Mass(1),
        new Radius(0.1, 0.3),
        new Life(0.5, 1)
      ])
      .setPosition({x: position[0], y: position[1], z: position[2]});

    // Add renderer
    const spriteRenderer = new SpriteRenderer(scene, THREE);
    system.addRenderer(spriteRenderer);

    // Add emitter to system
    system.addEmitter(emitter);
    
    systemRef.current = system;

    // Start the system
    system.emit({
      onStart: () => {},
      onUpdate: () => {},
      onEnd: () => onSparkComplete?.()
    });

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

    animate();

    return () => {
      if (systemRef.current) {
        systemRef.current.destroy();
      }
    };
  }, []);

  return null;
} 