import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import React from 'react';
import ReactPlayer from "react-player";
export default function Home() {
    // tab state
    const tabTitleList = ["youtube","soundcloud","mp3"];
    const [currentTab, setCurrentTab] = useState("youtube");
    // background state
    const backgroundList = [
        {
            id: 1,
            title: "fish store",
            src: "/images/fish-store.gif",
        },
        {
            id: 2,
            title: "night time",
            src: "/images/nighttime.gif",
        },
        {
            id: 3,
            title: "convenience store",
            src: "/images/conveniencetstore.gif",
        },
        {
            id: 4,
            title: "peace",
            src: "/images/peace.gif",
        },
        {
            id: 5,
            title: "your name",
            src: "/images/yourname.gif",
        },
    ];
    const [currentBackground, setCurrentBackground] = useState(backgroundList[1]);
    // playlist state
    const [playlist, setPlaylist] = useState([
        {
            id:1,
            name: "My, nah, your playlist",
            src: "https://www.youtube.com/playlist?list=PLktFEPieLGU-UKQYl2huD770l-yzftC0n",
        },
        { 
            id:2,
            name: "7UPPERCUTS x Đá Số Tới / Tuyển tập Pop Punks",
            src: "https://youtu.be/22nk6yEPlfA"
        },
        {
            id:3,
            name: "Lukas Graham - Happy Home", 
            src: "https://youtu.be/QX6UhufF0cs" 
        },
    ]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [nowPlaying, setNowPlaying] = useState(playlist[0]);
    // functions
    const onNowPlayingEnded = () => {
        const nowPlayingIndex = playlist.findIndex(p => p.name === nowPlaying.name)
        setNowPlaying(playlist[nowPlayingIndex+1]);
    }
    const onPortalClick = (action) => {
        const nowPlayingIndex = playlist.findIndex(p => p.id === nowPlaying.id);
        if(action === "next") {
            nowPlayingIndex === playlist.length - 1 ? 
            setNowPlaying(playlist[0]) : 
            setNowPlaying(playlist[nowPlayingIndex + 1]);
        }
        else{
            nowPlayingIndex === 0 ?
            setNowPlaying(playlist[playlist.length - 1]) : 
            setNowPlaying(playlist[nowPlayingIndex - 1]);
        }
    }
    const onTabClick = (tab) => {
        if(tab !== currentTab){
            setCurrentTab(tab);
        }
        return;
    }
    const playSelectedSong = (id) => {
        if(isPlaying && id === nowPlaying.id) return;
        const selectedSong = playlist.find(p=>p.id === id)
        setIsPlaying(true);
        setNowPlaying(selectedSong)
    }
    const setSelectedBackground = (id) => {
        if(id !== currentBackground.id) {
            const selectedBackground = backgroundList.find(p=>p.id === id);
            setCurrentBackground(selectedBackground);
            return;
        }
        return;
    }
    return (
        <div className={styles.container}>
            <Head>
                <title>Listening to some songs</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/song.ico" />
            </Head>
            <main className={styles.main} style={{ background: `url(${currentBackground.src})` }}>
                <div className={styles.wrapper}>
                    {/* tab */}
                    <div className={styles.tabs}>
                        {tabTitleList.map(tab => (
                            <div
                                key={tab}
                                className={`${styles.tab} ${tab === currentTab && styles.currentTab}`}
                                onClick={() => onTabClick(tab)}
                            >
                                <span>{tab}</span>
                            </div>
                        ))}
                    </div>
                    {/* marquee */}
                    <div className={styles.marqueeContainer}>
                        <button className={styles.portal} onClick={() => onPortalClick("back")} />
                        <div className={styles.blur} />
                        <span className={`${isPlaying && styles.marquee} ${styles.marqueeText}`}>
                            {nowPlaying.name}
                        </span>
                        <button className={styles.portal} onClick={() => onPortalClick("next")} />
                    </div>
                    {/* player */}
                    <ReactPlayer
                        className={styles.controllers}
                        playing={isPlaying}
                        controls={true}
                        url={nowPlaying.src}
                        width="100%"
                        onEnded={onNowPlayingEnded}
                        onPause={() => setIsPlaying(false)}
                        onStart={() => setIsPlaying(true)}
                        onPlay={() => setIsPlaying(true)}
                    />
                    {/* playlist */}
                    <div className={styles.playlist}>
                        <h1>PLAYLIST</h1>
                        <button className={styles.playlistBu}>Add new song</button>
                        <div className={styles.blur}></div>
                        <div className={styles.playlistitems}>
                            <ol>
                                {playlist.map(song => (
                                    <div className={styles.song} key={`container ${song.name}`}>
                                        <Image
                                            alt=""
                                            key={song.name}
                                            onClick={() => playSelectedSong(song.id)}
                                            className={`${styles.songIcon}`}
                                            src={`${
                                                song.id === nowPlaying.id && isPlaying
                                                    ? "/playingsound.gif"
                                                    : "/sound.png"
                                            }`}
                                            height={nowPlaying.id === song.id && isPlaying ? 80 : 40}
                                            width={nowPlaying.id === song.id && isPlaying ? 80 : 40}
                                        />
                                        <li
                                            className={`${song.id === nowPlaying.id ? styles.nowPlaying : ""} ${
                                                styles.songListItem
                                            }`}
                                            key={song.id}
                                        >
                                            <p className={`${styles.songName}`}>{song.name}</p>
                                        </li>
                                    </div>
                                ))}
                            </ol>
                        </div>
                    </div>
                    {/* background */}
                    <div className={styles.background}>
                        {backgroundList.map(background => (
                            <img
                                style={{ zIndex: background.id === currentBackground.id ? 10:background.id }}
                                className={styles.backgroundImg}
                                key={background.title}
                                src={background.src}
                                onClick={() => setSelectedBackground(background.id)}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
    }
