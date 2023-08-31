import './App.css';
import { Environment, PresentationControls, useGLTF, Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react'

// Phone model with an iframe rendered over the screen
function Phone({ url }) {
  const model = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf")

  return (
    <>
      <PresentationControls global polar={[-1, 0.4]}>
        <primitive object={model.scene} position-y={-1.4} rotation={[-0.05, 0, 0]}>
          {/* position and distanceFactor values I found for iphone-x/model.gltf */}
          <Html wrapperClass='iframe-wrapper' position={[.17, 1.32, .091]} distanceFactor={1.068} transform occlude>
            <iframe src={url} title='ePhone screen' />
          </Html>
        </primitive>
      </PresentationControls>
    </>
  );
}

function App() {
  const queryParameters = new URLSearchParams(window.location.search)
  const url = queryParameters.get("url")

  return (
    <div className="App">
      <Canvas
        camera={{ fov: 45, position: [0, 1, 4.4] }}>
        <Suspense fallback={null}>
          <Environment preset="night" />
          <Phone url={url ? url : "https://elh.github.io"} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
