import React from 'react';
import ReactRain from 'react-rain-animation';

// import all the styles
import "react-rain-animation/lib/style.css";


const Rain = (props) => {

    return (
        <div className="">
          <ReactRain
            numDrops="300"
          />
        </div>
    )
}

export default Rain;