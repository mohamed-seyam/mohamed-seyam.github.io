import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Bounds, Center, Html, useGLTF } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'

// A clean ivory material for color-less meshes (STL / plain OBJ).
const meshProps = { color: '#e9e4da', roughness: 0.55, metalness: 0.05 }

function GltfModel({ src }) {
  const { scene } = useGLTF(src)
  return <primitive object={scene} />
}

function StlModel({ src }) {
  const geom = useLoader(STLLoader, src)
  geom.computeVertexNormals()
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial {...meshProps} />
    </mesh>
  )
}

function PlyModel({ src }) {
  const geom = useLoader(PLYLoader, src)
  geom.computeVertexNormals()
  const hasColor = !!geom.getAttribute('color')
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial
        vertexColors={hasColor}
        color={hasColor ? '#ffffff' : meshProps.color}
        roughness={meshProps.roughness}
        metalness={meshProps.metalness}
      />
    </mesh>
  )
}

function ObjModel({ src }) {
  const obj = useLoader(OBJLoader, src)
  const prepared = useMemo(() => {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeVertexNormals()
        child.material = new THREE.MeshStandardMaterial(meshProps)
      }
    })
    return obj
  }, [obj])
  return <primitive object={prepared} />
}

function Model({ src }) {
  const ext = src.split('?')[0].split('.').pop().toLowerCase()
  if (ext === 'glb' || ext === 'gltf') return <GltfModel src={src} />
  if (ext === 'stl') return <StlModel src={src} />
  if (ext === 'ply') return <PlyModel src={src} />
  if (ext === 'obj') return <ObjModel src={src} />
  return null
}

function Fallback() {
  return (
    <Html center>
      <span className="model-loading">Loading 3D…</span>
    </Html>
  )
}

export default function ModelViewer({ src }) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#f4f4f7']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} />
      <Suspense fallback={<Fallback />}>
        <Bounds fit clip observe margin={1.2}>
          <Center>
            <Model src={src} />
          </Center>
        </Bounds>
      </Suspense>
      <OrbitControls makeDefault enablePan enableZoom enableDamping />
    </Canvas>
  )
}
