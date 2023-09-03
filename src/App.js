import React, { useState } from 'react';
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
function Phone({ url, gotoFn, rotateFn, landscape = false, disabled = false, off = false, hide = false }) {
  const [labelsOn, setLabelsOn] = useState(!hide);
  const [screenOn, setScreenOn] = useState(!off);
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
  const personalURL = "https://elh.github.io";
  const wikiURL = "https://en.wikipedia.org/wiki/IPhone";
  const youtubeURL = "https://www.youtube.com/embed/_YUzQa_1RCE?si=Bbd79-yAvUR3sRtd";

  return (
    <>
      <PresentationControls global polar={[-1, 1]}>
        <primitive object={model.scene} position={modelPos} rotation={modelRot}>
          {/* NOTE: occlude=blending causes issues with borders. so just try to avoid any geometry occlusion for now */}
          {/* On/Off button */}
          <mesh position={[1, 2.05, 0]} occlude onClick={ (_) => {if (!disabled) { click.play(); setScreenOn(!screenOn); }} }>
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
          <mesh position={[1, 1.43, 0]} occlude onClick={ (_) => { click.play(); setUrlInput(personalURL); gotoFn(personalURL); } }>
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
                ? <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, Math.PI / 2]} position={[1.14, 2.88, 0]} transform occlude>
                    <div className="text-xs rounded-md px-2 py-1 border border-primary" onClick={() => {rotateFn()}}>
                      Portrait <CornerRightUp size={14} strokeWidth={2} />
                    </div>
                  </Html>
                : <Html scale={.2} zIndexRange={[1000000, 0]} rotation={[0, 0, 0]} position={[1.30, 2.95, 0]} transform occlude>
                    <div className="text-xs rounded-md px-2 py-1 border border-primary" onClick={() => {rotateFn()}}>
                      <CornerRightDown size={14} strokeWidth={2} /> Landscape
                    </div>
                  </Html>
              }
              <Html scale={.2} zIndexRange={[1000000, 0]} rotation={landscape ? [0, 0, Math.PI / 2]: [0, 0, 0]} position={landscape ? [1.14, 2.05, 0] : [1.26, 2.05, 0]} transform occlude>
                <div className="text-xs rounded-md px-2 py-1 border border-primary">
                  {landscape ? "" : "← "}Turn {screenOn ? "off" : "on"}
                </div>
              </Html>
              <Html scale={.2} zIndexRange={[1000000, 0]} rotation={landscape ? [0, 0, Math.PI / 2]: [0, 0, 0]} position={landscape ? [1.14, 1.45, 0] : [1.26, 1.45, 0]} transform occlude>
                <div className="text-xs rounded-md px-2 py-1 border border-primary">
                {landscape ? "" : "← "}Owner?
                </div>
              </Html>
              <Html scale={.2} zIndexRange={[1000000, 0]} rotation={landscape ? [0, 0, Math.PI / 2]: [0, 0, 0]} position={landscape ? [-0.79, 2.53, 0] : [-0.95, 2.53, 0]} transform occlude>
                <div className="text-xs rounded-md px-2 py-1 border border-primary">
                  {labelsOn ? "Hide" : "Show"} labels{landscape ? "" : " →"}
                </div>
              </Html>
              <Html scale={.2} zIndexRange={[1000000, 0]} rotation={landscape ? [0, 0, Math.PI / 2]: [0, 0, 0]} position={landscape ? [-1.07, 0.52, 0] : [-1.65, 1.4, 0]} transform occlude>
                <div className="p-4 rounded-md border border-primary">
                  <span className="text-lg font-black">ePhone browser</span>
                  <br />
                  <span className="text-xs">Drag the background to rotate the phone and click buttons to use it.</span>
                  <br />
                  <br />
                  <input type="text" placeholder="url" className="input input-xs input-bordered w-80 focus:outline-0" disabled={disabled}
                    value={urlInput}
                    onChange={
                      (e) => { setUrlInput(e.target.value); }
                    }
                  />
                  <button className="btn btn-xs mx-1" disabled={disabled} onClick={() => { gotoFn(urlInput) }}>Go</button>
                  <br />
                  <button className="btn btn-xs font-normal mr-1 mt-1" disabled={disabled}
                    onClick={() => { setUrlInput(wikiURL); gotoFn(wikiURL) }}
                  >→ Wiki</button>
                  <button className="btn btn-xs font-normal mr-1 mt-1" disabled={disabled}
                    onClick={() => { setUrlInput(youtubeURL); gotoFn(youtubeURL) }}
                  >→ Youtube</button>
                </div>
              </Html>
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
  const [landscape, setLandscape] = useState(!!queryParameters.get("landscape"));
  const [off] = useState(!!queryParameters.get("off")); // only used to set initial state
  const [hide] = useState(!!queryParameters.get("hide")); // only used to set initial state. hidden labels

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

    setUrl(url);
  }

  return (
    <div className="App">
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
          <Phone
            url={url ? url : "https://elh.github.io"}
            landscape={!!landscape}
            disabled={isMobile}
            rotateFn={rotate}
            gotoFn={goto}
            off={off}
            hide={hide}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
