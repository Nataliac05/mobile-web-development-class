import { loadVoices, speak, speechSupported } from "../speech.js";
import { setTremolo } from "../audio.js";

const { useEffect, useState } = React;

function Slider({ label, value, min, max, step, onChange }) {
    return (
        <label className="form-control">
            <div className="label">
                <span className="label-text">{label}</span>
                <span className="label-text-alt">{value}</span>
            </div>
            <input
                type="range"
                className="range range-primary range-sm"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </label>
    );
}

export default function SettingsPage({ text, settings, preferences, setPreferences, resetPreferences, languageCode }) {
    const [voices, setVoices] = useState([]);
    const t = text.settings;

    useEffect(() => {
        loadVoices().then(setVoices);
    }, []);

    function update(changes) {
        setPreferences({ ...preferences, ...changes });
    }

    function updateTremolo(changes) {
        const tremolo = { ...preferences.tremolo, ...changes };
        setTremolo(tremolo);
        update({ tremolo });
    }

    return (
        <section className="page">
            <h1 className="page__title">{t.pageTitle}</h1>

            <div className="card bg-base-200 shadow">
                <div className="card-body settings-grid">
                    <label className="form-control">
                        <div className="label"><span className="label-text">{t.theme}</span></div>
                        <select
                            className="select select-bordered"
                            value={preferences.theme}
                            onChange={(e) => update({ theme: e.target.value })}
                        >
                            {settings.themes.map((theme) => (
                                <option key={theme.name} value={theme.name}>{theme.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control">
                        <div className="label"><span className="label-text">{t.language}</span></div>
                        <select
                            className="select select-bordered"
                            value={preferences.language}
                            onChange={(e) => update({ language: e.target.value })}
                        >
                            {settings.languages.map((language) => (
                                <option key={language.name} value={language.name}>{language.name}</option>
                            ))}
                        </select>
                    </label>

                    <div className="form-control">
                        <div className="label"><span className="label-text">{t.voice}</span></div>
                        {speechSupported() && voices.length > 0 ? (
                            <div className="join">
                                <select
                                    className="select select-bordered join-item voice-select"
                                    value={preferences.voice}
                                    onChange={(e) => update({ voice: e.target.value })}
                                >
                                    <option value="">{t.voiceDefault}</option>
                                    {voices.map((voice) => (
                                        <option key={voice.name} value={voice.name}>
                                            {voice.name} ({voice.lang})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="btn btn-secondary join-item"
                                    onClick={() => speak(text.speech.phrase, {
                                        voiceName: preferences.voice,
                                        rate: settings.speech.rate,
                                        pitch: settings.speech.pitch,
                                        lang: languageCode,
                                    })}
                                >
                                    {t.testVoice}
                                </button>
                            </div>
                        ) : (
                            <p className="text-muted">{t.noVoices}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="card bg-base-200 shadow">
                <div className="card-body">
                    <h2 className="card-title">{t.effect}</h2>
                    <Slider
                        label={t.intensity}
                        value={preferences.tremolo.intensity}
                        min={0} max={1} step={0.05}
                        onChange={(intensity) => updateTremolo({ intensity })}
                    />
                    <Slider
                        label={t.rate}
                        value={preferences.tremolo.rate}
                        min={0.1} max={11} step={0.1}
                        onChange={(rate) => updateTremolo({ rate })}
                    />
                    <Slider
                        label={t.stereoPhase}
                        value={preferences.tremolo.stereoPhase}
                        min={0} max={180} step={5}
                        onChange={(stereoPhase) => updateTremolo({ stereoPhase })}
                    />
                    <div className="card-actions justify-end">
                        <button className="btn btn-ghost" onClick={resetPreferences}>{t.reset}</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
