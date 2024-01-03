import { Center, Text3D, MeshTransmissionMaterial } from "@react-three/drei";
import { Vector3Tuple } from "three";
import { HOME_TRANSMISSION_MATERIAL_CONFIG, FontProps } from "./config";
import { useLoader } from "@react-three/fiber";
import { RGBELoader } from "three-stdlib";

interface Text3DProps {
  position: Vector3Tuple;
  text: string;
  size: Vector3Tuple;
  font: FontProps;
  materialConfigProp: string;
}

export const HomeText3D: React.FC<Text3DProps> = (props) => {
  const { text, size, font, materialConfigProp } = props;
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
            <MeshTransmissionMaterial {...HOME_TRANSMISSION_MATERIAL_CONFIG[materialConfigProp]} background={texture} />
          </Text3D>
        </Center>
      </group>
    </>
  );
};