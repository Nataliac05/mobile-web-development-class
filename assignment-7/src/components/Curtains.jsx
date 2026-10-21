// A pair of red stage curtains that slide apart to reveal the image behind them.

export default function Curtains({ open, imageSrc, imageAlt }) {
    return (
        <div className={`stage ${open ? "stage--open" : ""}`}>
            <img className="stage__image" src={imageSrc} alt={imageAlt} />
            <div className="stage__valance" aria-hidden="true" />
            <div className="curtain curtain--left" aria-hidden="true" />
            <div className="curtain curtain--right" aria-hidden="true" />
        </div>
    );
}
