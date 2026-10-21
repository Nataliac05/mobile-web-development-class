import HomePage from "./pages/HomePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import { loadPreferences, savePreferences } from "./storage.js";

const { useEffect, useState } = React;

const PAGES = {
    home: HomePage,
    settings: SettingsPage,
    about: AboutPage,
    help: HelpPage,
};

async function fetchJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return response.json();
}

function defaultPreferences(settings) {
    const pick = (list) => (list.find((item) => item.default) || list[0]).name;
    return {
        theme: pick(settings.themes),
        language: pick(settings.languages),
        voice: settings.speech.preferredVoice,
        tremolo: { ...settings.audio.tremolo },
    };
}

function currentPage() {
    const name = window.location.hash.replace(/^#\/?/, "");
    return PAGES[name] ? name : "home";
}

export default function App() {
    const [settings, setSettings] = useState(null);
    const [preferences, setPreferencesState] = useState(null);
    const [text, setText] = useState(null);
    const [page, setPage] = useState(currentPage);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        fetchJson("data/settings.json")
            .then((loaded) => {
                setSettings(loaded);
                const defaults = defaultPreferences(loaded);
                const saved = loadPreferences();
                setPreferencesState({
                    ...defaults,
                    ...saved,
                    tremolo: { ...defaults.tremolo, ...saved.tremolo },
                });
                document.title = loaded.general.appTitle;
            })
            .catch((error) => setLoadError(error.message));

        const onHashChange = () => setPage(currentPage());
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    const language = settings && preferences
        && (settings.languages.find((l) => l.name === preferences.language) || settings.languages[0]);

    useEffect(() => {
        if (!language) return;
        fetchJson(`data/${language.textContent}`)
            .then(setText)
            .catch((error) => setLoadError(error.message));
        document.documentElement.lang = language.code;
    }, [language && language.textContent]);

    useEffect(() => {
        if (!settings || !preferences) return;
        const theme = settings.themes.find((t) => t.name === preferences.theme) || settings.themes[0];
        const root = document.documentElement;
        root.dataset.theme = theme.daisyTheme;
        root.style.setProperty("--app-base", theme.baseColor);
        root.style.setProperty("--app-text", theme.baseTextColor);
    }, [settings, preferences && preferences.theme]);

    function setPreferences(next) {
        setPreferencesState(next);
        savePreferences(next);
    }

    function resetPreferences() {
        setPreferences(defaultPreferences(settings));
    }

    if (loadError) {
        return <div role="alert" className="alert alert-error app-error">{loadError}</div>;
    }
    if (!settings || !preferences || !text) {
        return <div className="app-loading"><span className="loading loading-spinner loading-lg" /></div>;
    }

    const Page = PAGES[page];

    return (
        <div className="app">
            <header className="navbar bg-base-200 shadow app-nav">
                <a className="btn btn-ghost text-xl app-nav__title" href="#/">{settings.general.appTitle}</a>
                <nav role="tablist" className="tabs tabs-boxed app-nav__tabs">
                    {Object.keys(PAGES).map((name) => (
                        <a
                            key={name}
                            role="tab"
                            href={`#/${name === "home" ? "" : name}`}
                            className={`tab ${page === name ? "tab-active" : ""}`}
                        >
                            {text.nav[name]}
                        </a>
                    ))}
                </nav>
            </header>
            <main className="app-main">
                <Page
                    text={text}
                    settings={settings}
                    preferences={preferences}
                    setPreferences={setPreferences}
                    resetPreferences={resetPreferences}
                    languageCode={language.code}
                />
            </main>
        </div>
    );
}
