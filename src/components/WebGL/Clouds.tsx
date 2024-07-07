import { Cloud } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import { useMemo } from 'react';

export function Clouds() {
  const cloudProps = useMemo(() => [
    { position: [-0.25, -1.75, -1] as Vector3, opacity: 0.115, speed: -0.4, width: 18, depth: 2.6, segments: 8, color: '#C92636' },
    { position: [-0.25, 2, -1] as Vector3, opacity: 0.115, speed: -0.4, width: 24, depth: 2.6, segments: 6, color: '#C92636' },
    { position: [1, 0.5, -1] as Vector3, opacity: 0.115, speed: 0.2, width: 24, depth: 2.6, segments: 8, color: '#F21AB0' },
    { position: [0.25, 0, -1] as Vector3, opacity: 0.115, speed: 0.4, width: 18, depth: 2.6, segments: 7, color: '#9E46C0' },
    { position: [8, 4, 0] as Vector3, opacity: 0.115, speed: -0.4, width: 15, depth: 2.6, segments: 9, color: '#C92636' },
    { position: [-8, -2, 0] as Vector3, opacity: 0.115, speed: 0.2, width: 20, depth: 2.6, segments: 7, color: '#F21AB0' },
    { position: [-4, 2, 0] as Vector3, opacity: 0.115, speed: 0.4, width: 14, depth: 2.6, segments: 7, color: '#9E46C0' },
    { position: [5, -2.25, 0] as Vector3, opacity: 0.15, speed: 0.2, width: 12, depth: 2.6, segments: 7, color: '#F21AB0' },
  ], []);

  return (
    <>
      {cloudProps.map((props, index) => (
        <Cloud key={index} {...props} />
      ))}
    </>
  );
}