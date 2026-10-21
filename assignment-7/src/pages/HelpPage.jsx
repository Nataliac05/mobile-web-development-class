export default function HelpPage({ text }) {
    const t = text.help;
    return (
        <section className="page">
            <h1 className="page__title">{t.pageTitle}</h1>
            <div className="card bg-base-200 shadow">
                <div className="card-body">
                    <ol className="help-steps">
                        <li>{t.step1}</li>
                        <li>{t.step2}</li>
                        <li>{t.step3}</li>
                        <li>{t.step4}</li>
                    </ol>
                    <div role="alert" className="alert alert-info">{t.tip}</div>
                </div>
            </div>
        </section>
    );
}
