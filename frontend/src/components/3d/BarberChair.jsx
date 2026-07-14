import React from 'react';

export function BarberChair(props) {
  // Gerçek 3D model bulunana kadar, onu temsil eden geçici bir kutu (placeholder)
  // kullanıyoruz. Bu, animasyonun çalışmasını sağlar.

  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1.8, 1]} />
      <meshStandardMaterial color={"#443322"} metalness={0.8} roughness={0.3} />
    </mesh>
  );
}