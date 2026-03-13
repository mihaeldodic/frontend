import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlaneDeparture, faCloud } from "@fortawesome/free-solid-svg-icons";
import "./loader.css";

const Loader = () => {
    return (
        <div className="travel-loader" role="status" aria-live="polite" aria-label="Ucitavanje sadrzaja">
            <div className="travel-loader__content">
                <div className="travel-loader__sky">
                    <FontAwesomeIcon icon={faCloud} className="travel-loader__cloud travel-loader__cloud--left" />
                    <FontAwesomeIcon icon={faCloud} className="travel-loader__cloud travel-loader__cloud--right" />
                </div>

                <div className="travel-loader__orbit">
                    <div className="travel-loader__ring" />
                    <div className="travel-loader__ring travel-loader__ring--inner" />
                    <div className="travel-loader__plane-wrap">
                        <FontAwesomeIcon icon={faPlaneDeparture} className="travel-loader__plane" />
                    </div>
                </div>

                <div className="travel-loader__trail" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>

                <p className="travel-loader__text">Pripremamo putovanje...</p>
            </div>
        </div>
    );
};

export default Loader;