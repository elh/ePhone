import './App.css';
import { Environment, PresentationControls, useGLTF, Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

function Phone() {
  const model = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf")
  return (
    <>
      <Environment preset="warehouse" />
      {/* <PresentationControls global polar={[-0.4, 0.2]} azimuth={[-0.4, 0.2]}> */}
      <PresentationControls global>
        {/* TODO: fix initial rotation */}
        <primitive object={model.scene} position-y={-1.4}>
          <Html wrapperClass='iframe-wrapper' position={[.17, 1.32, .082]} distanceFactor={1.068} transform>
            <iframe src="https://elh.github.io" />
          </Html>
        </primitive>
      </PresentationControls>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Canvas camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [-3, 1.5, 4]
      }}>
        <Phone></Phone>
      </Canvas>
    </div>
  );
}

export default App;
