// Thin wrapper around the Web Speech API's speechSynthesis object.

export function speechSupported() {
    return "speechSynthesis" in window;
}

// Voices load asynchronously in some browsers, so wait for voiceschanged when the list is empty.
export function loadVoices() {
    return new Promise((resolve) => {
        if (!speechSupported()) {
            resolve([]);
            return;
        }
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            resolve(voices);
            return;
        }
        const onChange = () => {
            window.speechSynthesis.removeEventListener("voiceschanged", onChange);
            resolve(window.speechSynthesis.getVoices());
        };
        window.speechSynthesis.addEventListener("voiceschanged", onChange);
        setTimeout(onChange, 1500);
    });
}

export async function speak(text, { voiceName, rate = 1, pitch = 1, lang } = {}) {
    if (!speechSupported()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = await loadVoices();
    const voice = voices.find((v) => v.name === voiceName);
    if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
    } else if (lang) {
        utterance.lang = lang;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}
