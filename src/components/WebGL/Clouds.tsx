import { Cloud } from '@react-three/drei'

export function Clouds() {
  return (
    <>
      <Cloud
        position={[0, 0, 0]}
        opacity={0.08}
        speed={-0.4}
        width={15}
        depth={2.6}
        segments={40}
        color={'#C92636'}
      />
      <Cloud
        position={[0, 0, 0]}
        opacity={0.08}
        speed={0.2}
        width={20}
        depth={2.6}
        segments={40}
        color={'#F21AB0'}
      />
      <Cloud
        position={[0, 0, 0]}
        opacity={0.08}
        speed={0.4}
        width={14}
        depth={2.6}
        segments={25}
        color={'#9E46C0'}
      />
    </>
  )
}