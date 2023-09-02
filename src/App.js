import React, { useState } from 'react';
import './App.css';
import { Environment, PresentationControls, useGLTF, Html, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react'
import { Info, Github } from 'lucide-react';

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
            <Html zIndexRange={[1000000, 0]} wrapperClass='iframe-wrapper-landscape' position={[.17, 1.32, .091]} rotation={[0, 0, -Math.PI / 2]} distanceFactor={1.068} transform occlude>
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
            <Html zIndexRange={[1000000, 0]} wrapperClass='iframe-wrapper' position={[.17, 1.32, .091]} distanceFactor={1.068} transform occlude>
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
  const [urlInput, setUrlInput] = useState(queryParameters.get("url"));
  const [landscape, setLandscape] = useState(!!queryParameters.get("landscape"));
  const [showInfo, setShowInfo] = useState(false);

  const rotate = () => {
    const windowURL = new URL(window.location.href);
    if (landscape) {
      windowURL.searchParams.delete('landscape');
    } else {
      windowURL.searchParams.set('landscape', 1);
    }
    window.history.pushState({}, "", windowURL);

    setLandscape(!landscape)
  }

  const goto = (url) => {
    if (!isValidHttpUrl(url)) {
      return;
    }

    const windowURL = new URL(window.location.href);
    windowURL.searchParams.set('url', url);
    window.history.pushState({}, "", windowURL);

    setUrlInput(url); // just in case it was directly provided
    setUrl(url);
  }

  return (
    <div className="App">
      <div className='info'>
        <button onClick={() => { setShowInfo(!showInfo) }}><Info size={20} strokeWidth={2} /></button>
        <br />
        {showInfo &&
          <div className="bg-base-100 p-4">
            <input type="text" placeholder="URL" className="input input-xs input-bordered w-80 focus:outline-0" value={urlInput} onChange={
              (e) => { setUrlInput(e.target.value); }
            } onKeyDown={
              (e) => {
                if (e.key === 'Enter') {
                  goto(urlInput)
                }
              }
            } />
            <button className="btn btn-neutral btn-xs mx-2" onClick={() => { goto(urlInput) }}>Go</button>
            <br />
            <button className="btn btn-xs mr-1 mt-1" onClick={() => { goto("https://en.wikipedia.org/wiki/IPhone") }}>→ Wiki</button>
            <button className="btn btn-xs mr-1 mt-1" onClick={() => { goto("https://www.youtube.com/embed/_YUzQa_1RCE?si=Bbd79-yAvUR3sRtd") }}>→ Youtube</button>
            <br />
            <br />
            <button className="btn btn-xs mr-1 my-1" onClick={rotate}>Change orientation</button>
            <span className="text-xs my-4">or drag the background to position phone.</span>
          </div>
        }
      </div>
      <div className='links'>
        <a href={`https://github.com/elh/ePhone`} className="link link-hover"><Github size={20} strokeWidth={2} /></a>
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
