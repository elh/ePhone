import './App.css';
import { Environment, PresentationControls, useGLTF, Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react'

// Phone model with an iframe rendered over the screen
function Phone({ url, landscape = false }) {
  // from market.pmnd.rs
  const model = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf");

  if (landscape) {
    return (
      <>
        <PresentationControls global>
          <primitive object={model.scene} position-y={0} position-x={1.2} rotation={[0, 0, Math.PI / 2]}>
            {/* position and distanceFactor values I found for iphone-x/model.gltf */}
            <Html wrapperClass='iframe-wrapper-landscape' position={[.17, 1.32, .091]} rotation={[0, 0, -Math.PI / 2]} distanceFactor={1.068} transform occlude>
              <iframe src={url} title='ePhone screen - landscape' />
            </Html>
          </primitive>
        </PresentationControls>
      </>
    );
  } else {
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
}

function App() {
  const queryParameters = new URLSearchParams(window.location.search)
  const url = queryParameters.get("url");
  const landscape = queryParameters.get("landscape");

  const cameraPos = landscape ? [0, -0.3, 3.3] : [0, 1, 4.4];

  return (
    <div className="App">
      <Canvas
        camera={{ fov: 45, position: cameraPos }}>
        <Suspense fallback={null}>
          {/* <Environment preset="dawn" background blur={2} /> */}
          <Environment preset="night" />
          <Phone url={url ? url : "https://elh.github.io"} landscape={!!landscape} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
