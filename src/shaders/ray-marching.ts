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
    uniform vec2 resolution;
    uniform vec3 cPos;
    uniform vec4 cameraQuaternion;
    uniform float fov;

    #define MAX_STEPS 200
    #define SURFACE_DIST 0.01
    #define MAX_DISTANCE 100.0

    float getDistance(vec3 p) {

      vec4 sphere = vec4(0.0, 2.0, -0.0, 2.0);
      float dist_to_sphere = length(p - sphere.xyz) - sphere.w;
    
      vec4 sphere2 = vec4(3.0, 4.0, 0.0, 1.5);
      float dist_to_sphere2 = length(p - sphere2.xyz) - sphere2.w;
    
      float dist_to_plane = p.y;
    
      float d = min(dist_to_sphere, dist_to_plane);
      d = min(d, dist_to_sphere2);
      return d;
    }

    // ro: ray origin
    // rd: ray direction
    // ds: distance to the surface
    // d0: distance from origin
    float rayMarch(vec3 ro, vec3 rd) {
      float d0 = 0.0;
      for(int i = 0; i < MAX_STEPS; i++) {
        // Calculate the ray's current position
        vec3 p = ro + d0 * rd;
        // Get the distance from p to the closest object in the scene
        float ds = getDistance(p);
        // Move the ray
        d0 += ds;
        // Evaluate if we need to break the loop
        if(ds < SURFACE_DIST || d0 > MAX_DISTANCE) break;
      }
      // Return the ray distance
      return clamp(d0, 0.0, MAX_DISTANCE);
    }

    vec3 quaterion_rotate(vec3 v, vec4 q) {
      return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
    }
    
    void main() {
      float aspectRatio = resolution.x / resolution.y;
      vec3 cameraOrigin = cPos;
    
      float fovMult = fov / 90.0;
      
      vec2 screenPos = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution;
      // Place the vector along the x-axis using the aspectRatio
      screenPos.x *= aspectRatio;
      // Move the vector using the field of view to match the ThreeCamera
      screenPos *= fovMult;
      vec3 ray = vec3( screenPos.xy, -1.0 );
      // Rotate the camera
      ray = quaterion_rotate(ray, cameraQuaternion);
      ray = normalize( ray );
      
      // Run the rayMarch function
      float d = rayMarch(cameraOrigin, ray);
      float normal_d = d / MAX_DISTANCE;
    
      gl_FragColor = vec4(vec3(normal_d), 1.0);
    }
  `

};