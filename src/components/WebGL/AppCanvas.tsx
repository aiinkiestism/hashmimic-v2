import { Canvas } from '@react-three/fiber'

export function AppCanvas({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Canvas
      style={{
      // background: 'rgba(6, 7, 19, 0.1)',
      background: '#fff',
      width: '100%',
      height: '100vh',
      position: 'fixed'
    }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {children}
    </Canvas>
  )
}
