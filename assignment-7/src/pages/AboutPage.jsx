export default function AboutPage({ text, settings }) {
    const t = text.about;
    return (
        <section className="page">
            <h1 className="page__title">{t.pageTitle}</h1>
            <div className="card bg-base-200 shadow">
                <div className="card-body prose-ish">
                    <p>{t.para1}</p>
                    <p>{t.para2}</p>
                    <p>{t.builtWith}</p>
                    <div className="badges">
                        <span className="badge badge-primary">{t.version} {settings.general.appVersion}</span>
                        <span className="badge badge-secondary">{t.buildMode}: {settings.general.buildMode}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
