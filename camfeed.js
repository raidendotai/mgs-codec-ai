const rightVideo = document.getElementById("rightVideo");
const outputCanvas = document.getElementById("outputCanvas");
const audioIndicator = document.getElementById("audioIndicator");
const timer = document.getElementById("timer");

// WebGL setup
const renderer = new THREE.WebGLRenderer({ canvas: outputCanvas, alpha: true });
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const geometry = new THREE.PlaneGeometry(3.25 * 1.25, 2 * 1.25);

// Shader for video processing
const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
const fragmentShader = `
            uniform sampler2D tDiffuse;
            uniform sampler2D maskTexture;
            uniform float time;
            uniform sampler2D noiseTex;
            varying vec2 vUv;

            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            void main() {
                vec2 uv = vUv;
                vec4 texel = texture2D(tDiffuse, uv);
                vec4 mask = texture2D(maskTexture, uv);

                // Apply a wider, smoother blur gradient
                vec4 blurredColor = vec4(0.0);
                float maxBlurSize = 0.025;
                float blurSteps = 100.0;
                
                for (float i = 0.0; i <= blurSteps; i++) {
                    float t = i / blurSteps;
                    float currentBlurSize = mix(0.0, maxBlurSize, t);
                    
                    for (float angle = 0.0; angle < 6.0; angle += 1.7) {
                        vec2 offset = vec2(cos(angle), sin(angle)) * currentBlurSize;
                        blurredColor += texture2D(tDiffuse, uv + offset);
                    }
                }
                blurredColor /= (blurSteps + 1.0) * 4.0;

                // Create a smooth transition between original and blurred
                float smoothMask = smoothstep(0.1, 0.9, mask.r);
                vec4 transitionColor = mix(blurredColor, texel, smoothMask);

                // Mix original and blurred based on mask
                vec4 finalColor = mix(blurredColor, texel, mask.r);

                // Apply a more subtle and realistic green tint
                vec3 lightGreenTint = vec3(0.9, 1.0, 0.9);
                vec3 darkGreenTint = vec3(0.2, 0.4, 0.2);
                finalColor.rgb = mix(finalColor.rgb, finalColor.rgb * lightGreenTint, 0.5);
                finalColor.rgb = mix(finalColor.rgb, finalColor.rgb * darkGreenTint, 0.25);
                

                // Apply a multi-step color grading effect to match the image
                
                // Step 1: Shift the overall color balance towards green and cyan
                finalColor.r *= 0.85;
                finalColor.g *= 1.1;
                finalColor.b *= 1.05;
                
                // Step 2: Enhance the mid-tones for a more vibrant look
                vec3 midTones = vec3(0.2, 0.3, 0.25);
                finalColor.rgb = mix(finalColor.rgb, midTones, 0.4);
                
                // Step 3: Adjust contrast to match the image's stark appearance
                finalColor.rgb = pow(finalColor.rgb, vec3(1.25));
                
                // Step 4: Add a subtle blue-green glow to highlights
                vec3 highlights = vec3(0.7, 0.9, 0.8);
                float luminance = dot(finalColor.rgb, vec3(0.299, 0.587, 0.114));
                finalColor.rgb = mix(finalColor.rgb, highlights, smoothstep(0.7, 0.9, luminance) * 0.3);
                
                // Step 5: Deepen shadows with a dark green tint
                vec3 shadows = vec3(0.05, 0.1, 0.08);
                finalColor.rgb = mix(finalColor.rgb, shadows, smoothstep(0.3, 0.0, luminance) * 0.5);
                
                
                // Step 7: Fine-tune overall brightness and saturation
                finalColor.rgb *= 1.1;  // Slightly increase brightness
                float saturation = 1.2;
                vec3 grayscale = vec3(dot(finalColor.rgb, vec3(0.299, 0.587, 0.114)));
                finalColor.rgb = mix(grayscale, finalColor.rgb, saturation);

                // Apply random static noise
                float staticNoise = random(uv + time * 0.1);
                finalColor.rgb = mix(finalColor.rgb, vec3(0.0), staticNoise * 0.15);

                // Apply vertical scrolling CRT scanlines
                float scanline = sin(uv.y * 150.0 + time * 2.0) * 0.5 + 0.5;
                float scanlineIntensity = 0.08 * smoothstep(0.4, 0.6, scanline);
                finalColor.rgb = mix(finalColor.rgb, vec3(0.0), scanlineIntensity);


                gl_FragColor = finalColor;
            }
        `;

// Create noise texture for glitch effect
const noiseSize = 256;
const noiseData = new Uint8Array(noiseSize * noiseSize);
for (let i = 0; i < noiseData.length; i++) {
	noiseData[i] = Math.random() * 255;
}
const noiseTex = new THREE.DataTexture(
	noiseData,
	noiseSize,
	noiseSize,
	THREE.RedFormat,
);
noiseTex.needsUpdate = true;

const material = new THREE.ShaderMaterial({
	uniforms: {
		tDiffuse: { value: new THREE.Texture(rightVideo) },
		maskTexture: { value: new THREE.Texture() },
		time: { value: 0 },
		noiseTex: { value: noiseTex },
	},
	vertexShader,
	fragmentShader,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// BodyPix setup
let net;
bodyPix.load().then((loadedNet) => {
	net = loadedNet;
});

// Webcam setup
navigator.mediaDevices
	.getUserMedia({ video: true, audio: true })
	.then((stream) => {
		console.log("debug : found user media");
		rightVideo.srcObject = stream;
		rightVideo.play();

		// Audio setup
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		const analyser = audioContext.createAnalyser();
		const microphone = audioContext.createMediaStreamSource(stream);
		microphone.connect(analyser);
		analyser.fftSize = 256;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		function checkAudio() {
			analyser.getByteFrequencyData(dataArray);
			let sum = dataArray.reduce((a, b) => a + b, 0);
			let average = sum / bufferLength;
			audioIndicator.style.backgroundColor = average > 50 ? "#32ae94" : "#333";
			requestAnimationFrame(checkAudio);
		}
		checkAudio();
	})
	.catch((err) => console.error("Error accessing media devices:", err));

// Animation loop
function animate(time) {
	material.uniforms.time.value = time * 0.001;
	material.uniforms.tDiffuse.value.needsUpdate = true;

	if (net && rightVideo.videoWidth > 0 && rightVideo.videoHeight > 0) {
		net.segmentPerson(rightVideo).then((segmentation) => {
			const mask = segmentation.data;
			const imageData = new ImageData(segmentation.width, segmentation.height);
			for (let i = 0; i < mask.length; i++) {
				const j = i * 4;
				imageData.data[j] =
					imageData.data[j + 1] =
					imageData.data[j + 2] =
						mask[i] ? 255 : 0;
				imageData.data[j + 3] = 255;
			}
			const maskTexture = new THREE.Texture(imageData);
			maskTexture.needsUpdate = true;
			material.uniforms.maskTexture.value = maskTexture;
		});
	}

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}
animate();

// Timer
let startTime = Date.now();
function updateTimer() {
	let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
	let minutes = Math.floor(elapsedTime / 60)
		.toString()
		.padStart(2, "0");
	let seconds = (elapsedTime % 60).toString().padStart(2, "0");
	timer.textContent = `${minutes}:${seconds}`;
	requestAnimationFrame(updateTimer);
}
updateTimer();
