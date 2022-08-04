import React, {useState} from "react";
import styles from "./Popup.module.css";
export default function Popup(props) {
    const {setIsShowPopup, popup} = props;
    const popupBackgroundList = [
        {
            _id: 1,
            url: "/images/train.gif"
        },
        {
            _id: 2,
            url: "/images/sunsetcity.gif"
        },
        {
            _id: 3,
            url: "/images/rain.gif"
        }
    ]
    const [currentPopupUrl, setCurrentPopupUrl] = useState(popupBackgroundList[0]?.url)
    return (
        <div className={styles.modal}>
            <div className={styles.popup} style={{ justifyContent: "space-between", backgroundImage: `url(${currentPopupUrl})` }}>
                <div className={styles.popupBody}>
                    <span>{popup.message}</span>
                </div>
                <div className={styles.popupFooter}>
                    <button className={styles.popupButton} onClick={() => setIsShowPopup(false)}>
                        {" "}
                        Dzạ
                    </button>
                </div>
            </div>
        </div>
    ) 
}
