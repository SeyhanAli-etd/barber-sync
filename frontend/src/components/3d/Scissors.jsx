import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Scissors(props) {
  // --- GERÇEK MODEL YÜKLEME KISMI ---
  // Bir .glb dosyası bulduğunuzda, onu /public klasörüne atın
  // ve aşağıdaki iki satırın yorumunu kaldırın.
  // const { nodes, materials } = useGLTF('/scissors.glb');

  return (
    // Gerçek model için aşağıdaki satırın yorumunu kaldırın:
    // <primitive object={nodes.Scene} {...props} />

    // --- GEÇİCİ PLACEHOLDER ---
    <group {...props}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[1.5, 0.1, 0.1]} />
        <meshStandardMaterial color={"#aaa"} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[1.5, 0.1, 0.1]} />
        <meshStandardMaterial color={"#aaa"} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// useGLTF.preload('/scissors.glb');