import { Center, Text3D, MeshTransmissionMaterial } from "@react-three/drei";
import { Vector3Tuple } from "three";
import { HOME_TRANSMISSION_MATERIAL_CONFIG } from "./config";
import { useLoader } from "@react-three/fiber";
import { RGBELoader } from "three-stdlib";

interface TextProps {
  position: Vector3Tuple;
  text: string;
  size: Vector3Tuple;
}

export const HomeSubTitle3D: React.FC<TextProps> = (props) => {
  const { text, size } = props;
  const font = '/DancingScript_Regular.json';
  const texture = useLoader(RGBELoader, process.env.NEXT_PUBLIC_HOME_FONT_TEXTURE ?? '');

  return (
    <>
      <group>
        <Center scale={size} front top {...props}>
          <Text3D
            castShadow
            bevelEnabled
            font={font}
            scale={5}
            letterSpacing={-0.03}
            height={0.25}
            bevelSize={0.01}
            bevelSegments={10}
            curveSegments={128}
            bevelThickness={0.01}>
            {text}
            <MeshTransmissionMaterial {...HOME_TRANSMISSION_MATERIAL_CONFIG['subTitle']} background={texture} />
          </Text3D>
        </Center>
      </group>
    </>
  );
};