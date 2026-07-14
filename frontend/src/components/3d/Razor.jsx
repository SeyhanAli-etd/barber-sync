import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Razor(props) {
  // --- GERÇEK MODEL YÜKLEME KISMI ---
  // Bir .glb dosyası bulduğunuzda, onu /public klasörüne atın
  // ve aşağıdaki iki satırın yorumunu kaldırın.
  // const { nodes, materials } = useGLTF('/razor.glb');

  return (
    // Gerçek model için aşağıdaki satırın yorumunu kaldırın:
    // <primitive object={nodes.Scene} {...props} />

    // --- GEÇİCİ PLACEHOLDER ---
    <mesh {...props}>
      <boxGeometry args={[1.5, 0.1, 0.3]} />
      <meshStandardMaterial color={"#silver"} metalness={1} roughness={0.1} />
    </mesh>
  );
}

// useGLTF.preload('/razor.glb');