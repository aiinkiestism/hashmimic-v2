import { Cloud } from '@react-three/drei'

export function Clouds() {
  return (
    <>
      <Cloud
        position={[-0.25, -1.75, -1]}
        opacity={0.115}
        speed={-0.4}
        // @ts-ignore
        width={18}
        depth={2.6}
        segments={12}
        color={'#C92636'}
      />
      <Cloud
        position={[-0.25, 2, -1]}
        opacity={0.115}
        speed={-0.4}
        // @ts-ignore
        width={24}
        depth={2.6}
        segments={9}
        color={'#C92636'}
      />
      <Cloud
        position={[1, 0.5, -1]}
        opacity={0.115}
        speed={0.2}
        // @ts-ignore
        width={24}
        depth={2.6}
        segments={12}
        color={'#F21AB0'}
      />
      <Cloud
        position={[0.25, 0, -1]}
        opacity={0.115}
        speed={0.4}
        // @ts-ignore
        width={18}
        depth={2.6}
        segments={10}
        color={'#9E46C0'}
      />
      <Cloud
        position={[8, 4, 0]}
        opacity={0.115}
        speed={-0.4}
        // @ts-ignore
        width={15}
        depth={2.6}
        segments={13}
        color={'#C92636'}
      />
      <Cloud
        position={[-8, -2, 0]}
        opacity={0.115}
        speed={0.2}
        // @ts-ignore
        width={20}
        depth={2.6}
        segments={9}
        color={'#F21AB0'}
      />
      <Cloud
        position={[-4, 2, 0]}
        opacity={0.115}
        speed={0.4}
        // @ts-ignore
        width={14}
        depth={2.6}
        segments={10}
        color={'#9E46C0'}
      />
      <Cloud
        position={[5, -2.25, 0]}
        opacity={0.15}
        speed={0.2}
        // @ts-ignore
        width={12}
        depth={2.6}
        segments={10}
        color={'#F21AB0'}
      />
    </>
  )
}