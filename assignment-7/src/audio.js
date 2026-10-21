// Plays the recorded sound through a Tuna Tremolo effect.
// The AudioContext is created on the first click to satisfy browser autoplay policies.

let context = null;
let tremolo = null;
let audioElement = null;

function ensureGraph(soundFile, tremoloSettings) {
    if (!context) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        context = new AudioContextClass();
        const tuna = new window.Tuna(context);

        audioElement = new Audio(soundFile);
        audioElement.preload = "auto";

        tremolo = new tuna.Tremolo({ ...tremoloSettings, bypass: false });

        const source = context.createMediaElementSource(audioElement);
        source.connect(tremolo);
        tremolo.connect(context.destination);
    }
    setTremolo(tremoloSettings);
}

export function setTremolo({ intensity, rate, stereoPhase }) {
    if (!tremolo) return;
    tremolo.intensity = intensity;
    tremolo.rate = rate;
    tremolo.stereoPhase = stereoPhase;
}

// Resolves when the sound finishes playing; rejects if it cannot be played.
export async function playWithTremolo(soundFile, tremoloSettings) {
    ensureGraph(soundFile, tremoloSettings);
    if (context.state === "suspended") {
        await context.resume();
    }

    audioElement.currentTime = 0;

    return new Promise((resolve, reject) => {
        const cleanup = () => {
            audioElement.removeEventListener("ended", onEnded);
            audioElement.removeEventListener("error", onError);
        };
        const onEnded = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); reject(new Error("Audio playback failed")); };

        audioElement.addEventListener("ended", onEnded);
        audioElement.addEventListener("error", onError);
        audioElement.play().catch((error) => { cleanup(); reject(error); });
    });
}
