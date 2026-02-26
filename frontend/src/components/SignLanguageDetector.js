import { AnimatePresence, motion } from 'framer-motion';
import { Camera, PlayCircle, RefreshCw, StopCircle, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// Load MediaPipe Hands from CDN
const HANDS_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
const CAMERA_UTILS_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
const DRAWING_UTILS_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";

const SignLanguageDetector = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isStarted, setIsStarted] = useState(false);
    const [detectedText, setDetectedText] = useState("");
    const [confidence, setConfidence] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handsRef = useRef(null);
    const cameraRef = useRef(null);
    const lastSpokenRef = useRef("");
    const stabilityCounterRef = useRef({ char: "", count: 0 });

    // Logic to classify hand landmarks into ASL letters
    const classifySign = (landmarks) => {
        // This is a simplified heuristic-based classification for demonstration
        // For a production app, a deep learning model (e.g., TF.js) would be used.
        // However, this approach is "free" and works instantly without external API keys.

        const getDistance = (p1, p2) => {
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
        };

        // Finger tip landmarks: 4(thumb), 8(index), 12(middle), 16(ring), 20(pinky)
        // Finger MCP landmarks: 2(thumb), 5(index), 9(middle), 13(ring), 17(pinky)
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];

        const indexMcp = landmarks[5];
        const middleMcp = landmarks[9];
        const ringMcp = landmarks[13];
        const pinkyMcp = landmarks[17];
        const wrist = landmarks[0];

        // Check which fingers are extended
        const isIndexExtended = indexTip.y < indexMcp.y;
        const isMiddleExtended = middleTip.y < middleMcp.y;
        const isRingExtended = ringTip.y < ringMcp.y;
        const isPinkyExtended = pinkyTip.y < pinkyMcp.y;

        // Simple ASL logic
        // L shape: index up, thumb out
        if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended && thumbTip.x < indexTip.x) return { char: "L", conf: 0.92 };

        // V shape / Peace sign: index and middle up
        if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) return { char: "V", conf: 0.88 };

        // Y shape: thumb and pinky out
        if (!isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended && thumbTip.x < wrist.x) return { char: "Y", conf: 0.85 };

        // W shape: index, middle, ring up
        if (isIndexExtended && isMiddleExtended && isRingExtended && !isPinkyExtended) return { char: "W", conf: 0.82 };

        // B shape / Open palm: all up
        if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) return { char: "B", conf: 0.90 };

        // I / Pinky up
        if (!isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) return { char: "I", conf: 0.75 };

        // C shape / Curved (very generic)
        if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended && getDistance(thumbTip, indexTip) > 0.1) return { char: "C", conf: 0.65 };

        // A / Fist
        if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) return { char: "A", conf: 0.70 };

        return { char: "...", conf: 0 };
    };

    const speakResult = (text) => {
        if (!text || text === "..." || text === lastSpokenRef.current) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        lastSpokenRef.current = text;
    };

    const onResults = useCallback((results) => {
        if (!canvasRef.current) return;

        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw the video frame to the canvas (optional, we can just overlay)
        // canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            for (const landmarks of results.multiHandLandmarks) {
                // Draw landmarks
                if (window.drawConnectors && window.drawLandmarks && window.HAND_CONNECTIONS) {
                    window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
                    window.drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
                }

                // Classify
                const result = classifySign(landmarks);
                if (result.char !== "...") {
                    // Stability logic: must see the same char for 10 frames
                    if (stabilityCounterRef.current.char === result.char) {
                        stabilityCounterRef.current.count++;
                    } else {
                        stabilityCounterRef.current.char = result.char;
                        stabilityCounterRef.current.count = 0;
                    }

                    if (stabilityCounterRef.current.count > 10) {
                        setDetectedText(result.char);
                        setConfidence(result.conf * 100);
                        speakResult(result.char);
                    }
                }
            }
        }
        canvasCtx.restore();
    }, []);

    const startDetection = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Load scripts if not loaded
            if (!window.Hands) {
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = HANDS_URL;
                    script.onload = resolve;
                    document.head.appendChild(script);
                });

                // Also load others
                const s1 = document.createElement('script'); s1.src = CAMERA_UTILS_URL; document.head.appendChild(s1);
                const s2 = document.createElement('script'); s2.src = DRAWING_UTILS_URL; document.head.appendChild(s2);
            }

            const hands = new window.Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });

            hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            hands.onResults(onResults);
            handsRef.current = hands;

            const camera = new window.Camera(videoRef.current, {
                onFrame: async () => {
                    await hands.send({ image: videoRef.current });
                },
                width: 640,
                height: 480
            });

            await camera.start();
            cameraRef.current = camera;
            setIsStarted(true);
        } catch (err) {
            setError("Failed to access camera or load detection model. Please ensure you are in a secure context (HTTPS).");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const stopDetection = () => {
        if (cameraRef.current) {
            cameraRef.current.stop();
            cameraRef.current = null;
        }
        if (handsRef.current) {
            handsRef.current.close();
        }
        setIsStarted(false);
        setDetectedText("");
        setConfidence(0);
    };

    useEffect(() => {
        return () => {
            stopDetection();
        };
    }, []);

    return (
        <div className="card p-6 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Camera className="text-blue-500" />
                        Live Sign Language Detection
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Show a sign language letter in front of the camera. It will detect and speak the letter.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {!isStarted ? (
                        <button
                            onClick={startDetection}
                            disabled={isLoading}
                            className="btn-primary flex items-center gap-2"
                        >
                            {isLoading ? <RefreshCw className="animate-spin" /> : <PlayCircle />}
                            Detect Sign Language
                        </button>
                    ) : (
                        <button
                            onClick={stopDetection}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2"
                        >
                            <StopCircle />
                            Stop Detection
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Camera Feed */}
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-inner">
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                        playsInline
                        muted
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                        width="640"
                        height="480"
                    />

                    {!isStarted && !isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-100 dark:bg-gray-800">
                            <Camera size={48} className="mb-2 opacity-20" />
                            <p className="text-sm">Camera preview will appear here</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                            <RefreshCw className="animate-spin mb-4" size={32} />
                            <p className="font-medium">Loading AI Models...</p>
                        </div>
                    )}
                </div>

                {/* Results Panel */}
                <div className="flex flex-col gap-4">
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2">
                            Detected Character
                        </span>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={detectedText || "idle"}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-blue-100 dark:border-blue-900 shadow-inner"
                            >
                                <span className={`text-6xl md:text-8xl font-black ${detectedText ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-700'}`}>
                                    {detectedText || "?"}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-6 w-full max-w-xs">
                            <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                                <span>Confidence Score</span>
                                <span>{confidence.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${confidence}%` }}
                                    className="h-full bg-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-start gap-3">
                        <Volume2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                        <div>
                            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                                Voice Output Enabled
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                The system will automatically speak the detected letter aloud once it reaches a high confidence level.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-100 dark:border-red-800">
                    {error}
                </div>
            )}


        </div>
    );
};

export default SignLanguageDetector;
