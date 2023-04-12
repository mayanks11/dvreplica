// imports
import React, {useRef, useEffect, Suspense, useState, useMemo} from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three'
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import { OrbitControls, Html} from '@react-three/drei';
import { Object3D } from 'three';
var SatelliteJ = require('satellite.js');

// import texture images
// @ts-ignore
const mxImg = require('Assets/earth/tycho2t3_80_mx.jpg');
// @ts-ignore
const myImg = require('Assets/earth/tycho2t3_80_my.jpg');
// @ts-ignore
const mzImg = require('Assets/earth/tycho2t3_80_mz.jpg');
// @ts-ignore
const pxImg = require('Assets/earth/tycho2t3_80_px.jpg');
// @ts-ignore
const pyImg = require('Assets/earth/tycho2t3_80_py.jpg');
// @ts-ignore
const pzImg = require('Assets/earth/tycho2t3_80_pz.jpg');

// Global declaration
let globeScene= {};

// Skybox
function SkyBox(){
  const { scene } = useThree();
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    pxImg,
    mxImg,
    myImg,
    pyImg,
    pzImg,
    mzImg,
    
  ]);
  scene.background = texture;
  return null;
}  
const tleLine1 = '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992',
tleLine2 = '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442';

const satrec = SatelliteJ.twoline2satrec(tleLine1, tleLine2); 
console.log(satrec);




function Home(){
  // useStates
  const globeRef = useRef();
  

  function Time(){
    const movRef = useRef();
    const [altT, setAlt] = useState(0.4); 
    const [clock,setClock] =useState(new Date());
    useEffect(() => {const secondTimer = setInterval(() => setClock(new Date()), 3000)}, []);
    
    const positionAndVelocity = SatelliteJ.propagate(satrec, clock);
    const gmst = SatelliteJ.gstime(clock);
    const position = SatelliteJ.eciToGeodetic(positionAndVelocity.position, gmst );     
    let ltt;
    let lnn;
    let pt = [];
    const tempObject = new THREE.Object3D();

    // console.log(lat, lon, altitude);
    useEffect(() => {
      if (movRef == null) return;
      if (movRef.current == null) return;
      let lt = SatelliteJ.degreesLat(position.latitude);
      let ln = SatelliteJ.degreesLong(position.longitude);
      let al = position.height/6371;
      if(lt){
        ltt = lt;
      }
      if(ln){
        lnn = ln;
      }
      // console.log(globeRef.current.getCoords(ltt, lnn, al));
      pt.push(globeRef.current.getCoords(ltt, lnn, al));
      if(pt.length === 1){
        let norm =  Math.sqrt(Math.pow(pt[0].x, 2) + Math.pow(pt[0].y, 2) + Math.pow(pt[0].z, 2));
        let x = pt[0].x * 2.5 / norm;
        let y = pt[0].y * 2.5 / norm;
        let z = pt[0].z * 2.5 / norm;
        tempObject.position.set(x, y, z);
        tempObject.updateMatrix();
         movRef.current.setMatrixAt(0, (tempObject.matrix));
    
  
         movRef.current.instanceMatrix.needsUpdate = true;
      }
      setAlt(al);
      // console.log(ltt)
      
    },[clock])
    return(
      <mesh >

<instancedMesh  ref = {movRef} args={[null, null, gData.length]}>
        <sphereGeometry args={[0.05]}/>
        
        <meshBasicMaterial color={"blue"}/>
      </instancedMesh>
      
      </mesh>
      
    )
  
  }

  
  const [index, setIndex] = useState()
  const [click, setClick] = useState(false);

  //satData

  const gData = [
    {lat: 1.352083,
    lng: 103.819836,
    name: 'Sat_1'
      },
     {
       lat: 17.385044,
       lng: 78.486671,
       name: 'Sat_2',
     },
    {
     lat: 37.7749295,
     lng: -122.4194155,
     name: 'Sat_3',
   }
  ]

  //empty array for coordinates
  const coords= [];
  
  // Globe element
  function Sphere(){
    

     useEffect(() => {
       gData.forEach(lats => {
         // console.log(globeRef.current.getCoords(lats.lat, lats.lng, 0.35))
         coords.push(globeRef.current.getCoords(lats.lat, lats.lng, 0.35))
       })
  
       const scene = globeRef.current.scene() 
       // console.log(globeRef.current.getGlobeRadius())
       globeScene = scene
     });
    return(
      <Globe
      ref = {globeRef}
      globeImageUrl='https://unpkg.com/three-globe@2.24.10/example/img/earth-blue-marble.jpg'
      
      />
    )
  }

  // Making primitive object from scene of globe.gl
  function GlobeScene(){
    const sceneRef = useRef();
    
    
    const Gscene = new THREE.Mesh()
    // Rotate
    // useFrame(() => {
    //   sceneRef.current.rotation.y += 0.005
    // })
    
   return(
    <primitive object={Gscene}>
      
      <primitive  scale = {0.02} object = {globeScene}/>
    
    </primitive>
      
   ) 
  }
  //Satellite as seperate jsx

  function Satellite() {
    const meshRef = useRef();
    const tempObject = new Object3D();
    let selPositionLat;
    let selPositionLang;
    
    let selectedObj;
    let satName;
   const [selected, setSelected] = useState();
    useEffect(() => {
      if (meshRef == null) return;
      if (meshRef.current == null) return;

      for(let i = 0; i < gData.length; i++){
        
         let norm =  Math.sqrt(Math.pow(coords[i].x, 2) + Math.pow(coords[i].y, 2) + Math.pow(coords[i].z, 2));
         let x = coords[i].x * 2.5 / norm;
         let y = coords[i].y * 2.5 / norm;
         let z = coords[i].z * 2.5 / norm;
        tempObject.position.set(x, y, z);
        
        tempObject.name = gData[i].name;
        tempObject.updateMatrix();
        
        if(i === selected){
          selectedObj = tempObject;
          selPositionLat = gData[selected].lat
          selPositionLang = gData[selected].lng
          
          satName = tempObject.name
          setIndex(selected)
          // console.log("Position: ",selPositionLat, " ", selPositionLang" Name: ",satName)
          if(click === false){
            setClick(true);
          }
          console.log(selectedObj);
        }
        if(i === 3){
          console.log(gData[i]);
        }
        meshRef.current.setMatrixAt(i, (tempObject.matrix));
        
      }
      
      meshRef.current.instanceMatrix.needsUpdate = true;
    },[selected]);
    
  // console.log(selected)
    return (
      <mesh>


      <instancedMesh onPointerDown={e => setSelected(e.instanceId)} ref={meshRef} args={[null, null, gData.length]}>
        <sphereGeometry args={[0.05]}/>
        
        <meshBasicMaterial color={"palegreen"}/>
      </instancedMesh>
      </mesh>
      
    );
  }
  function Popup(){
    function handleClick(e){
      e.preventDefault;
      setClick(false);
    }
    if(click ){
      return (
        <Html>
        <div style={{"position": "absolute", "color": "white", "right":"450px", "bottom": "100px"}}>
            <p>Name: {gData[index].name}<br/>
             lat = {gData[index].lat} <br/> Lng = {gData[index].lng}
            </p>
            <button onClick={handleClick}>Close</button>
        </div>
        </Html>
      )}
    }

    function Sat(){
      const satRef = useRef();
      useEffect(() => {
        if(satRef.current){
          console.log(satRef.current);
          satRef.current.position.set(0, 10000, 0);
        }
      })
      return(
        <mesh ref = {satRef}>
          <boxGeometry args={[2, 1, 1]}/>
          <meshBasicMaterial color={"red"}/>
        </mesh>
      )
    }

    function Cone(){
      const coneRef = useRef();
      useEffect(() => {
        if(coneRef.current){
          console.log(coneRef.current);
        }
      })
      return(
      <mesh ref = {coneRef}>
        <coneGeometry args={[5, 20, 30]}/>
        <meshBasicMaterial color={'green'} transparent={true} opacity={0.6}/>
      </mesh>
      )
    }
    function Group(){
      const groupRef = useRef();
        // useFrame(() => {
        //   groupRef.current.rotation.z += 0.01;
        //   groupRef.current.rotation.x += 0.01;
        // })

      return(
        <mesh ref = {groupRef}>
          <group>
            <Sat/>
            <Cone/>
          </group>
        </mesh>
      )
    }

    function Plane(){
      const planeRef = useRef();
      useEffect(() => {
        if(planeRef.current){
          console.log(planeRef.current);
        planeRef.current.rotation.x = (-Math.PI / 2);
        
        }
      })
      return(
        <mesh ref = {planeRef}>
          <planeGeometry attach ='geometry' args={[100, 100]}/>
          <meshBasicMaterial attach='material' side={THREE.DoubleSide} color={'grey'} />
        </mesh>
      )
    }
  return(
    <div  id = 'canvas'  className = 'canvas' style={{'height': '700px'}}>
      <div hidden>
        <Sphere/>
       
      </div>
      <Canvas performance={{ min: 0.7 }}>
        <Suspense fallback={null}>
          <SkyBox/>
          <GlobeScene/>
          <Popup/>
          <Satellite/>
          {/* uncomment for cone */}
          {/* <Group/>
          <Plane/> */}
          <OrbitControls />
          <Time/>
        </Suspense>
      </Canvas>
    </div>
  )
}
export default Home;