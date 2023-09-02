import React, { useState } from 'react';
import './App.css';
import { Environment, PresentationControls, useGLTF, Html, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react'

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

// Phone model with an iframe rendered over the screen
function Phone({ url, landscape = false }) {
  // from market.pmnd.rs
  const model = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf");

  if (landscape) {
    return (
      <>
        <PresentationControls global polar={[-1, 0.4]}>
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
  const [url, setUrl] = useState(queryParameters.get("url"));
  const [landscape, setLandscape] = useState(!!queryParameters.get("landscape"));

  const rotate = () => {
    setLandscape(!landscape)
  }

  const goto = (url) => {
    if (!isValidHttpUrl(url)) {
      return;
    }
    setUrl(url);
  }

  return (
    <div className="App">
      <div className='info'>
        <input type='text' placeholder='URL to load' onBlur={
          (e) => {
            if (e.target.value !== "") {
              goto(e.target.value)
            }
          }
        }/>
        &nbsp;—&nbsp;
        <button onClick={rotate}>Rotate</button>
        &nbsp;—&nbsp;
        <button onClick={() => {goto("https://simple.wikipedia.org/wiki/Special:Random")}}>Wiki</button>
        <button onClick={() => {goto("https://www.youtube.com/embed/_YUzQa_1RCE?si=Bbd79-yAvUR3sRtd")}}>Youtube</button>
        <br/>
        <span>Drag to position. </span>
      </div>
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault fov={45} position={landscape ? [-.1, .1, 3.4] : [0, -.1, 4.5]} />
          <Environment preset="night" />
          <Phone url={url ? url : "https://elh.github.io"} landscape={!!landscape} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
