// ProTip: install glsl-literal to your vsCode to get syntax highlighting for glsl strings

export const RayMarchingShader = {

	vertexShader: /* glsl */`
    varying vec2 vUv;
    varying vec3 wPos;
    varying vec3 vPosition;

    void main() {
        vUv = uv;
        vPosition = position;
        wPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,

	fragmentShader: /* glsl */`
    // Your code here
  `

};