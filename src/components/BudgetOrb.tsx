import * as React from 'react';
import type { FC } from 'react';
import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { theme } from '../utils/theme';
import { useProjectStore } from '../store/projectStore';
import type { Feature } from '../types/project';
import { BurndownGraph } from './BurndownGraph';

interface FeatureSegmentProps {
  feature: Feature;
  index: number;
  totalFeatures: number;
  radius: number;
  height: number;
  onSelect: (id: number) => void;
}

const FeatureSegment: FC<FeatureSegmentProps> = ({ feature, index, totalFeatures, radius, height, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Calculate segment angles
  const startAngle = (index / totalFeatures) * Math.PI * 2;
  const endAngle = ((index + 1) / totalFeatures) * Math.PI * 2;
  
  // Calculate color based on status
  const getColor = (): string => {
    switch (feature.status) {
      case 'OnTrack': return theme.colors.onTrack;
      case 'AtRisk': return theme.colors.atRisk;
      case 'Delayed': return theme.colors.delayed;
      default: return theme.colors.primary;
    }
  };

  // Create geometry for the segment
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius * 0.8,
    height,
    32,
    1,
    true,
    startAngle,
    (endAngle - startAngle)
  );

  // Animation properties
  const { scale, color } = useSpring({
    scale: hovered ? 1.1 : 1,
    color: hovered ? theme.colors.accent : getColor(),
  });

  // Height based on progress
  const progressHeight = height * (feature.burnedHours / feature.plannedHours);

  return (
    <group>
      <animated.mesh
        ref={meshRef}
        scale={scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(feature.id)}
      >
        <primitive object={geometry} />
        <animated.meshStandardMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          emissive={getColor()}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
        
        {/* Progress indicator */}
        <mesh position={[0, progressHeight / 2 - height / 2, 0]}>
          <cylinderGeometry
            args={[radius * 1.02, radius * 1.02, 0.1, 32, 1, true, startAngle, (endAngle - startAngle)]}
          />
          <meshBasicMaterial 
            color={theme.colors.accent} 
            transparent 
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Label */}
        <Html position={[
          Math.cos((startAngle + endAngle) / 2) * (radius + 0.5),
          0,
          Math.sin((startAngle + endAngle) / 2) * (radius + 0.5)
        ]}>
          <div className="orb-text-container">
            <div className="sparkle-effect" />
            <div className="orb-text">
              {feature.name}
            </div>
            <div className="orb-progress">
              {Math.round(feature.progress)}%
            </div>
          </div>
        </Html>
      </animated.mesh>
    </group>
  );
};

// Enhanced Pulsating Sun Component
const PulsatingSun: FC = () => {
  const sunRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [showGraph, setShowGraph] = useState(false);
  const { projectData } = useProjectStore();
  
  // Calculate total budget and spending
  const totalBudget = projectData.totalPlannedHours * 150;  // Assuming $150 per hour rate
  const actualSpent = projectData.totalBurnedHours * 150;
  const monthlyData = {
    actualSpent: [
      actualSpent * 0.2,  // Month 1: 20% of total spent
      actualSpent * 0.4,  // Month 2: 40% of total spent
      actualSpent * 0.7,  // Month 3: 70% of total spent
      actualSpent         // Month 4: Current total spent
    ],
    plannedSpent: [
      totalBudget * 0.25,  // Month 1: Should have spent 25%
      totalBudget * 0.5,   // Month 2: Should have spent 50%
      totalBudget * 0.75,  // Month 3: Should have spent 75%
      totalBudget          // Month 4: Should have spent 100%
    ]
  };

  useEffect(() => {
    // Add or remove dimmed class from other content when graph is shown/hidden
    const content = document.querySelectorAll('.fade-content');
    content.forEach(element => {
      if (showGraph) {
        element.classList.add('dimmed');
      } else {
        element.classList.remove('dimmed');
      }
    });
  }, [showGraph]);

  // Create a custom shader material for the sun's surface
  const sunMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color('#FDB813') },  // Real sun color
      glowColor: { value: new THREE.Color('#FF6B00') }  // Orange-red glow
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      uniform vec3 glowColor;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      // Noise functions for realistic sun surface
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      void main() {
        // Create dynamic sun surface pattern
        float n = noise(vUv * 10.0 + time * 0.5);
        float crater = pow(n, 1.5);
        
        // Create pulsating effect
        float pulse = sin(time * 4.0) * 0.15 + 0.85;
        
        // Create edge glow effect
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        
        // Mix colors for final effect
        vec3 finalColor = mix(color, glowColor, fresnel);
        finalColor = mix(finalColor, glowColor, crater * 0.5);
        finalColor *= pulse;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  });

  // Animation for the sun
  useFrame((state) => {
    if (sunRef.current) {
      const t = state.clock.getElapsedTime();
      
      // Update shader time uniform
      sunMaterial.uniforms.time.value = t;
      
      // Faster pulsating scale animation
      const scale = 1 + Math.sin(t * 4) * 0.08;
      sunRef.current.scale.setScalar(scale);
      
      // Rotate the sun faster
      sunRef.current.rotation.z += 0.002;
    }

    if (glowRef.current) {
      const t = state.clock.getElapsedTime();
      // Inverse pulsating for the glow
      const glowScale = 1.3 + Math.sin(t * 4) * 0.15;
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  const handleSunClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setShowGraph(!showGraph);  // Toggle the graph visibility
  };

  return (
    <>
      <group ref={sunRef}>
        {/* Core sun sphere with enhanced detail */}
        <mesh onClick={handleSunClick}>
          <sphereGeometry args={[0.5, 64, 64]} />
          <primitive object={sunMaterial} attach="material" />
        </mesh>

        {/* Sun Label */}
        <Html position={[0, -1.2, 0]} center>
          <div className="sun-label">
            <span className="sun-text">Burning Issues</span>
          </div>
        </Html>

        {/* Inner glow */}
        <mesh onClick={handleSunClick}>
          <sphereGeometry args={[0.6, 64, 64]} />
          <meshBasicMaterial
            color="#FF6B00"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Outer glow */}
        <mesh ref={glowRef} onClick={handleSunClick}>
          <sphereGeometry args={[0.9, 64, 64]} />
          <meshBasicMaterial
            color="#FF8C00"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Enhanced corona effect */}
        <group>
          {Array.from({ length: 12 }).map((_, index) => (
            <mesh 
              key={index} 
              rotation={[0, 0, (Math.PI * 2 * index) / 12]}
              onClick={handleSunClick}
            >
              <ringGeometry args={[0.7, 1.2, 3]} />
              <meshBasicMaterial
                color="#FFA500"
                transparent
                opacity={0.12}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
          {/* Second layer of corona with different size and rotation */}
          {Array.from({ length: 8 }).map((_, index) => (
            <mesh 
              key={`outer-${index}`} 
              rotation={[0, 0, (Math.PI * 2 * index) / 8 + Math.PI / 8]}
              onClick={handleSunClick}
            >
              <ringGeometry args={[0.9, 1.4, 3]} />
              <meshBasicMaterial
                color="#FF8C00"
                transparent
                opacity={0.08}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      </group>

      {showGraph && (
        <Html style={{ position: 'fixed', bottom: 0, left: 0, right: 0, pointerEvents: 'all' }}>
          <BurndownGraph
            isOpen={showGraph}
            onClose={() => setShowGraph(false)}
            projectData={{
              totalBudget,
              startDate: '2024-01-01',
              endDate: '2024-12-31',
              actualSpent: monthlyData.actualSpent,
              plannedSpent: monthlyData.plannedSpent
            }}
          />
        </Html>
      )}
    </>
  );
};

export const BudgetOrb: FC = () => {
  const { projectData, setSelectedFeature } = useProjectStore();
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state: { clock: { getElapsedTime: () => number } }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  const handleFeatureSelect = (id: number): void => {
    const feature = projectData.features.find(f => f.id === id);
    if (feature) {
      setSelectedFeature(id);
    }
  };

  return (
    <group ref={groupRef}>
      {projectData.features.map((feature, index) => (
        <FeatureSegment
          key={feature.id}
          feature={feature}
          index={index}
          totalFeatures={projectData.features.length}
          radius={5}
          height={3}
          onSelect={handleFeatureSelect}
        />
      ))}
      
      <PulsatingSun />
    </group>
  );
}; 