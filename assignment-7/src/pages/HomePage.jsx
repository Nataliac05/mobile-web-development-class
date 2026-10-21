import Curtains from "../components/Curtains.jsx";
import { playWithTremolo } from "../audio.js";
import { speak } from "../speech.js";

const { useState } = React;

export default function HomePage({ text, settings, preferences, languageCode }) {
    const [stage, setStage] = useState("closed"); // closed | playing | open
    const [error, setError] = useState("");

    async function handleClick() {
        if (stage === "open") {
            setStage("closed");
            return;
        }

        setError("");
        setStage("playing");
        try {
            await playWithTremolo(settings.audio.soundFile, preferences.tremolo);
            setStage("open");
            speak(text.speech.phrase, {
                voiceName: preferences.voice,
                rate: settings.speech.rate,
                pitch: settings.speech.pitch,
                lang: languageCode,
            });
        } catch (playError) {
            console.error(playError);
            setError(text.home.audioError);
            setStage("closed");
        }
    }

    const buttonLabel =
        stage === "playing" ? text.home.playingText
        : stage === "open" ? text.home.replayText
        : text.home.buttonText;

    return (
        <section className="page page--home">
            <h1 className="page__title page__title--marquee">{text.home.pageTitle}</h1>
            <Curtains
                open={stage === "open"}
                imageSrc={settings.audio.revealImage}
                imageAlt={text.home.pageTitle}
            />
            <button
                className="btn btn-lg btn-gold stage-button"
                onClick={handleClick}
                disabled={stage === "playing"}
            >
                {stage === "playing" && <span className="loading loading-dots loading-sm" />}
                {buttonLabel}
            </button>
            {error && <div role="alert" className="alert alert-error stage-alert">{error}</div>}
        </section>
    );
}
