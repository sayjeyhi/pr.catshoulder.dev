"use client"

import {  useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Text, AsciiRenderer, OrbitControls } from "@react-three/drei"

export function App() {
  // State to control the characters used by AsciiRenderer for glitch effect
  const [asciiCharacters, setAsciiCharacters] = useState(" .:-+*=%#@")
  // Key to force re-render AsciiRenderer when characters change
  const [glitchKey, setGlitchKey] = useState(0)

  // Function to trigger the glitch effect
  const handleGlitch = () => {
    const originalChars = " .:-+*=%#@"
    const glitchChars = "█▓▒░░▒▓█" // Chaotic characters for glitch effect
    setAsciiCharacters(glitchChars)
    setGlitchKey((prev) => prev + 1) // Increment key to force re-mount/re-render

    // Revert to original characters after a short delay
    setTimeout(() => {
      setAsciiCharacters(originalChars)
      setGlitchKey((prev) => prev + 1) // Increment key again to revert
    }, 100) // Glitch duration in milliseconds
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        {/* Set background color for the canvas */}
        <color attach="background" args={["black"]} />

        {/* Display the emoji */}
        <Text
          position={[1, 2, 1]}
          fontSize={5.2}
          color="lime"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.05}
          outlineColor="black"
        >
          ㋡
        </Text>

        {/* Display the website name */}
        <Text
          position={[1, -3, 1]}
          fontSize={2.2}
          color="lime"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.02}
          outlineColor="black"
        >
          I WAS KIDDING
        </Text>

        {/* AsciiRenderer applies to the entire scene, converting it to ASCII art */}
        <AsciiRenderer
          key={glitchKey} // Use key to force re-render on character change for glitch effect
          renderIndex={1} // Render on top of the background (after default scene render)
          fgColor="lime" // Foreground color for ASCII characters (green)
          bgColor="black" // Background color for ASCII characters (black)
          characters={asciiCharacters} // Characters to use for ASCII rendering
          resolution={0.17} // Adjust for character density (lower value = more characters)
          invert={false} // Do not invert colors
        />
        {/* OrbitControls with limited rotation and slow auto-rotation */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.2}
          minPolarAngle={Math.PI / 2 - 0.2} // ~85 degrees (5 degrees up from horizontal)
          maxPolarAngle={Math.PI / 2 + 0.2} // ~95 degrees (5 degrees down from horizontal)
          minAzimuthAngle={-0.2} // -5 degrees
          maxAzimuthAngle={0.2} // +5 degrees
        />
      </Canvas>
    </div>
  )
}
