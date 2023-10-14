import { Cloud } from '@react-three/drei'

export function Clouds() {
  return (
    <>
      <Cloud
        position={[0, 0, -1]}
        opacity={0.08}
        speed={-0.4}
        width={18}
        depth={2.6}
        segments={32}
        color={'#C92636'}
      />
      <Cloud
        position={[0, 0, -1]}
        opacity={0.08}
        speed={0.2}
        width={24}
        depth={2.6}
        segments={32}
        color={'#F21AB0'}
      />
      <Cloud
        position={[0, 0, -1]}
        opacity={0.08}
        speed={0.4}
        width={18}
        depth={2.6}
        segments={22}
        color={'#9E46C0'}
      />
      <Cloud
        position={[8, 4, 0]}
        opacity={0.08}
        speed={-0.4}
        width={15}
        depth={2.6}
        segments={14}
        color={'#C92636'}
      />
      <Cloud
        position={[-8, -2, 0]}
        opacity={0.08}
        speed={0.2}
        width={20}
        depth={2.6}
        segments={14}
        color={'#F21AB0'}
      />
      <Cloud
        position={[-4, 2, 0]}
        opacity={0.08}
        speed={0.4}
        width={14}
        depth={2.6}
        segments={14}
        color={'#9E46C0'}
      />
      <Cloud
        position={[4, -2, 0]}
        opacity={0.08}
        speed={0.2}
        width={20}
        depth={2.6}
        segments={14}
        color={'#F21AB0'}
      />
    </>
  )
}