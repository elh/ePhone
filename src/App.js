import React, { useEffect, useState } from 'react';
import './App.css';
import * as THREE from 'three';
import { Environment, PresentationControls, useGLTF, Html, PerspectiveCamera, SpotLight } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react'
import { Github, CornerRightDown, CornerRightUp } from 'lucide-react';
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
function Phone({ url, gotoFn, rotateFn, landscape = false, disabled = false }) {
  const [labelsOn, setLabelsOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [urlInput, setUrlInput] = useState(url);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [flashlightTarget] = useState(() => new THREE.Object3D());

  // sounds
  const notifUp = new Audio(process.env.PUBLIC_URL + "/notif_up.m4a");
  const notifDown = new Audio(process.env.PUBLIC_URL + "/notif_down.m4a");
  const click = new Audio(process.env.PUBLIC_URL + "/click.mp3");
  click.volume = 0.3;

  // from market.pmnd.rs
  const model = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf");

  // phone orientation
  const modelPos = landscape ? [-1.4, 0, 0] : [0, -1.4, 0];
  const modelRot = landscape ? [0, 0, -Math.PI / 2] : [-0.05, 0, 0];
  const iFrameWrapperClass = landscape ? 'iframe-wrapper-landscape' : 'iframe-wrapper';
  const iFrameWrapperRot = landscape ? [0, 0, Math.PI / 2] : [0, 0, 0];

  // urls
  const wikiURL = "https://en.wikipedia.org/wiki/IPhone";
  const youtubeURL = "https://www.youtube.com/embed/_YUzQa_1RCE?si=Bbd79-yAvUR3sRtd";

  return (
    <>
      <PresentationControls global polar={[-1, 1]}>
        <primitive object={model.scene} position={modelPos} rotation={modelRot}>
          {/* NOTE: occlude=blending causes issues with borders. so just try to avoid any geometry occlusion for now */}
          {/* On/Off button */}
          <mesh position={[1, 2.05, 0]} occlude onClick={ (_) => {if (!disabled) { click.play(); setScreenOn(!screenOn) }} }>
            <boxGeometry args={[.1, .4, .2]} />
            <meshStandardMaterial color={'hotpink'} transparent opacity={0} />
          </mesh>
          {/* Ring/silent switch */}
          <mesh position={[-.7, 2.52, 0]} occlude onClick={ (_) => {if (!disabled) { click.play(); setLabelsOn(!labelsOn) }} }>
            <boxGeometry args={[.1, .12, .15]} />
            <meshStandardMaterial color={'hotpink'} transparent opacity={0} />
          </mesh>
          {/* Up volume button */}
          <mesh position={[-.7, 2.18, 0]} occlude onClick={ (_) => {if (!disabled) { notifUp.play() }} }>
            <boxGeometry args={[.1, .24, .15]} />
            <meshStandardMaterial color={'hotpink'} transparent opacity={0} />
          </mesh>
          {/* Down volume button */}
          <mesh position={[-.7, 1.86, 0]} occlude onClick={ (_) => {if (!disabled) { notifDown.play() }} }>
            <boxGeometry args={[.1, .24, .15]} />
            <meshStandardMaterial color={'hotpink'} transparent opacity={0} />
          </mesh>
          {/* Flashlight */}
          <mesh position={[.7, 2.6, -.10]} occlude onClick={ (_) => {if (!disabled) { setFlashlightOn(!flashlightOn) }} }>
            <boxGeometry args={[.24, .5, .03]} />
            <meshStandardMaterial color={'hotpink'} transparent opacity={0} />
          </mesh>
          {/* Sim card */}
          <mesh position={[1, 1.43, 0]} occlude onClick={ (_) => { click.play(); window.open("https://github.com/elh", "_blank") } }>
            <boxGeometry args={[.1, .35, .2]} />
            <meshStandardMaterial color={'hotpink'} transparent opacity={0} />
          </mesh>
          {/* position and distanceFactor values I found for iphone-x/model.gltf */}
          {screenOn &&
            <Html zIndexRange={[1000000, 0]} wrapperClass={iFrameWrapperClass} position={[.17, 1.33, .091]} rotation={iFrameWrapperRot} distanceFactor={1.28} transform occlude>
                <Suspense fallback={<div className='text-lg'>LOADING...</div>}>
                  <iframe src={url} title='ePhone screen' seamless />
                </Suspense>
              </Html>
          }
          {!disabled && labelsOn &&
            <>
              {landscape
                ? <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, Math.PI / 2]} position={[1.16, 2.88, 0]} transform occlude>
                    <div className="text-sm rounded-md px-2 py-1 border-2 border-primary" onClick={() => {rotateFn()}}>
                      Portrait <CornerRightUp size={14} strokeWidth={2} />
                    </div>
                  </Html>
                : <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, 0]} position={[1.28, 2.95, 0]} transform occlude>
                    <div className="text-sm rounded-md px-2 py-1 border-2 border-primary" onClick={() => {rotateFn()}}>
                      <CornerRightDown size={14} strokeWidth={2} /> Landscape
                    </div>
                  </Html>
              }
              <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, 0]} position={[1.25, 2.05, 0]} transform occlude>
                <div className="text-xs bg-sky-400 text-white rounded-md px-2 py-1">
                  ← turn {screenOn ? "off" : "on"}
                </div>
              </Html>
              <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, 0]} position={[1.3, 1.45, 0]} transform occlude>
                <div className="text-xs bg-sky-400 text-white rounded-md px-2 py-1">
                ← identity <Github size={14} strokeWidth={2} />
                </div>
              </Html>
              <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, 0]} position={[-0.95, 2.53, 0]} transform occlude>
                <div className="text-xs bg-sky-400 text-white rounded-md px-2 py-1">
                  {labelsOn ? "hide" : "show"} labels →
                </div>
              </Html>
              {/* <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, 0]} position={[-0.90, 2.18, 0]} transform occlude>
                <div className="text-xs bg-sky-400 text-white rounded-md px-2 py-1">
                  beep →
                </div>
              </Html>
              <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, 0]} position={[-0.90, 1.87, 0]} transform occlude>
                <div className="text-xs bg-sky-400 text-white rounded-md px-2 py-1">
                  boop →
                </div>
              </Html> */}
              {landscape
                ? <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, Math.PI / 2]} position={[-1.07, 0.52, 0]} transform occlude>
                    <div className="bg-sky-400 p-4 rounded-md">
                      <span className="text-lg font-black text-white">ePhone browser</span>
                      <br />
                      <span className="text-xs text-white">Drag the background to rotate the phone and click buttons to use it.</span>
                      <br />
                      <br />
                      <input type="text" placeholder="url" className="input input-xs input-bordered hover:bg-white bg-white text-black w-80 focus:outline-0" disabled={disabled}
                        value={urlInput}
                        onChange={
                          (e) => { setUrlInput(e.target.value); }
                        }
                      />
                      <button className="btn btn-xs hover:bg-white bg-white text-black border-0 mx-1" disabled={disabled} onClick={() => { gotoFn(urlInput) }}>Go</button>
                      <br />
                      <button className="btn btn-xs font-normal hover:bg-white bg-white text-black border-0 mr-1 mt-1" disabled={disabled}
                        onClick={() => { setUrlInput(wikiURL); gotoFn(wikiURL) }}
                      >→ Wiki</button>
                      <button className="btn btn-xs font-normal hover:bg-white bg-white text-black border-0 mr-1 mt-1" disabled={disabled}
                        onClick={() => { setUrlInput(youtubeURL); gotoFn(youtubeURL) }}
                      >→ Youtube</button>
                    </div>
                  </Html>
                : <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, 0]} position={[-1.65, 1.4, 0]} transform occlude>
                    <div className="bg-sky-400 p-4 rounded-md">
                      <span className="text-lg font-black text-white">ePhone browser</span>
                      <br />
                      <span className="text-xs text-white">Drag the background to rotate the phone and click buttons to use it.</span>
                      <br />
                      <br />
                      <input type="text" placeholder="url" className="input input-xs input-bordered hover:bg-white bg-white text-black w-80 focus:outline-0" disabled={disabled}
                        value={urlInput}
                        onChange={
                          (e) => { setUrlInput(e.target.value); }
                        }
                      />
                      <button className="btn btn-xs hover:bg-white bg-white text-black border-0 mx-1" disabled={disabled} onClick={() => { gotoFn(urlInput) }}>Go</button>
                      <br />
                      <button className="btn btn-xs font-normal hover:bg-white bg-white text-black border-0 mr-1 mt-1" disabled={disabled}
                        onClick={() => { setUrlInput(wikiURL); gotoFn(wikiURL) }}
                      >→ Wiki</button>
                      <button className="btn btn-xs font-normal hover:bg-white bg-white text-black border-0 mr-1 mt-1" disabled={disabled}
                        onClick={() => { setUrlInput(youtubeURL); gotoFn(youtubeURL) }}
                      >→ Youtube</button>
                    </div>
                  </Html>
                }
            </>
          }
          {flashlightOn &&
            <>
              <primitive object={flashlightTarget} position={[0, 0, -50]} />
              <SpotLight
                position={[.7, 2.6, -.10]}
                target={flashlightTarget}
                distance={10}
                angle={0.45}
                attenuation={20}
                anglePower={5}
                intensity={4}
                opacity={3}
              />
            </>
          }
        </primitive>
      </PresentationControls>
    </>
  );
}

function App() {
  const queryParameters = new URLSearchParams(window.location.search)
  const [url, setUrl] = useState(queryParameters.get("url"));
  // const [urlInput, setUrlInput] = useState(queryParameters.get("url"));
  const [landscape, setLandscape] = useState(!!queryParameters.get("landscape"));
  // const [showInfo, setShowInfo] = useState(false);

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

    // setUrlInput(url); // just in case it was directly provided
    setUrl(url);
  }

  return (
    <div className="App">
      {/* <div className='info'>
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
      </div> */}
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
          <Phone url={url ? url : "https://elh.github.io"} landscape={!!landscape} disabled={isMobile} rotateFn={rotate} gotoFn={goto} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
