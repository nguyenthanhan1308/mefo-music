import React from 'react';
import styles from "./Marquee.module.css";
export default function Marquee(props) {
    const {nowPlaying, setNowPlaying, playlist} = props;
    const isPlaying =true;
    const onPortalClick = action => {
        const nowPlayingIndex = playlist.findIndex(p => p.id === nowPlaying.id);
        if (action === "next") {
            nowPlayingIndex === playlist.length - 1
                ? setNowPlaying(playlist[0])
                : setNowPlaying(playlist[nowPlayingIndex + 1]);
        } else {
            nowPlayingIndex === 0
                ? setNowPlaying(playlist[playlist.length - 1])
                : setNowPlaying(playlist[nowPlayingIndex - 1]);
        }
    };
    return (
        <div className={styles.marqueeWrapper}>
            <div className={`${styles.marqueeContainer} ${isPlaying ? styles.marqueeShowing : styles.marqueeHidden}`} >
                <button type={"button"} className={styles.portal} onClick={() => onPortalClick("back")} />
                <div className={styles.blur} />
                <span className={`${isPlaying && styles.marquee} ${styles.marqueeText}`}>{nowPlaying.title}</span>
                <button type={"button"}  className={styles.portal} onClick={() => onPortalClick("next")} />
            </div>
        </div>
    );
}
