import React, { useState } from 'react';
import './App.css';
import { Environment, PresentationControls, useGLTF, Html, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react'
import { Info, Github } from 'lucide-react';
import {isMobile} from 'react-device-detect';

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
// Supports portrait and landscape orientations
function Phone({ url, landscape = false, disabled = false }) {
  const [screenOn, setScreenOn] = useState(false);

  // from market.pmnd.rs
  const model = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf");

  // phone orientation
  const modelPos = landscape ? [-1.4, .2, 0] : [0, -1.4, 0];
  const modelRot = landscape ? [0, 0, -Math.PI / 2] : [-0.05, 0, 0];
  const iFrameWrapperClass = landscape ? 'iframe-wrapper-landscape' : 'iframe-wrapper';
  const iFrameWrapperRot = landscape ? [0, 0, Math.PI / 2] : [0, 0, 0];

  return (
    <>
      <PresentationControls global polar={[-1, 1]}>
        <primitive object={model.scene} position={modelPos} rotation={modelRot}>
          {/* NOTE: occlude=blending causes issues with borders. so just try to avoid any geometry occlusion for now */}
          {/* On/Off button */}
          <mesh position={[1, 2.05, 0]} occlude onClick={ (_) => {if (!disabled) { setScreenOn(!screenOn)}} }>
            <boxGeometry args={[.1, .4, .2]} />
            <meshStandardMaterial color={'hotpink'} transparent opacity={0} />
          </mesh>
          {/* position and distanceFactor values I found for iphone-x/model.gltf */}
          {screenOn &&
            <Html zIndexRange={[1000000, 0]} wrapperClass={iFrameWrapperClass} position={[.17, 1.32, .091]} rotation={iFrameWrapperRot} distanceFactor={1.068} transform occlude>
                <Suspense fallback={<div className='text-lg'>LOADING...</div>}>
                  <iframe src={url} title='ePhone screen' />
                </Suspense>
              </Html>
          }
          {!screenOn && !disabled &&
            <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, 0]} position={[1.25, 2.05, 0]} transform occlude>
              <div className="text-xs bg-sky-400 text-white rounded-md p-1">
                ← turn on
              </div>
            </Html>
          }
        </primitive>
      </PresentationControls>
    </>
  );
}

function App() {
  const queryParameters = new URLSearchParams(window.location.search)
  const [url, setUrl] = useState(queryParameters.get("url"));
  const [urlInput, setUrlInput] = useState(queryParameters.get("url"));
  const [landscape, setLandscape] = useState(!!queryParameters.get("landscape"));
  const [showInfo, setShowInfo] = useState(false);

  const baseCameraPos = landscape ? [-.1, .1, 3.4] : [0, -.1, 4.5];
  const cameraPos = isMobile ? (landscape ? [0, 0, 12] : [0, 0, 7]) : baseCameraPos;

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
          <div className="bg-base-100 p-4 rounded-md">
            <input type="text" placeholder="URL" className="input input-xs input-bordered w-80 focus:outline-0" value={urlInput} disabled={isMobile} onChange={
              (e) => { setUrlInput(e.target.value); }
            } onKeyDown={
              (e) => {
                if (e.key === 'Enter') {
                  goto(urlInput)
                }
              }
            } />
            <button className="btn btn-neutral btn-xs mx-2" disabled={isMobile} onClick={() => { goto(urlInput) }}>Go</button>
            <br />
            <button className="btn btn-xs mr-1 mt-1" disabled={isMobile} onClick={() => { goto("https://en.wikipedia.org/wiki/IPhone") }}>→ Wiki</button>
            <button className="btn btn-xs mr-1 mt-1" disabled={isMobile} onClick={() => { goto("https://www.youtube.com/embed/_YUzQa_1RCE?si=Bbd79-yAvUR3sRtd") }}>→ Youtube</button>
            <br />
            <br />
            <button className="btn btn-xs mr-1 my-1" onClick={rotate}>Change orientation</button>
            <span className="text-xs my-4">or drag the background to position phone.</span>
            <br />
          </div>
        }
      </div>
      {isMobile && <div className="p-4 text-center text-sm italic">Open on desktop to turn on the ePhone</div>}
      <div className='links'>
        <a href={`https://github.com/elh/ePhone`} className="link link-hover"><Github size={20} strokeWidth={2} /></a>
      </div>
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault fov={45} position={cameraPos} />
          <Environment preset="night" />
          {/* <ambientLight intensity={0.3} /> */}
          {/* If detected to be on mobile, don't iframe. Positioning is currently off and it's a bad experience anyways on a small screen */}
          <Phone url={url ? url : "https://elh.github.io"} landscape={!!landscape} disabled={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
