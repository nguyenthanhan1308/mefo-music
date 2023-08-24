import React from 'react';
import ReactRain from 'react-rain-animation';
import styles from '../../styles/Home.module.css';

// import all the styles
import "react-rain-animation/lib/style.css";


const Rain = (props) => {

    return (
      <div className={styles.rainWrapper}>
        <audio autoPlay loop>
          <source src="rain.mp3" type="audio/mpeg" />
        </audio>
        <ReactRain
          numDrops="300"
        />
        <div className={styles.loadingWrapper}>
          <h1 className={styles.loadingText}>L</h1>
          <h1 className={styles.loadingText}>O</h1>
          <h1 className={styles.loadingText}>A</h1>
          <h1 className={styles.loadingText}>D</h1>
          <h1 className={styles.loadingText}>I</h1>
          <h1 className={styles.loadingText}>N</h1>
          <h1 className={styles.loadingText}>G</h1>
        </div>
      </div>
    )
}

export default Rain;