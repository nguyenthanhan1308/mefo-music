import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import React from 'react';
import ReactPlayer from "react-player";
import YTSearch from "youtube-api-search";
// components
import Rain from "../components/Rain/Rain";
import Tabs from "../components/Tabs/Tabs";
import Marquee from "../components/Marquee/Marquee";
import Popup from "../components/Popup/Popup";
export default function Home() {
    // env
    const YOUTUBE_API_KEY = "AIzaSyCHpX3Eo4T-1Rkx3snL6ZEjEJ91-6jafTQ";
    const [loading, setLoading] = useState(false);
    // modal state
    const [popup, setPopup] = useState({});
    const [isShowPopup, setIsShowPopup] = useState(false);
    // youtube search
    const [ytSearchTerm, setYTSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
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
            id: 1,
            title: "Post Malone - Wrapped Around Your Finger",
            src: "https://www.youtube.com/watch?v=JXxAnZaZrG0",
        },
        {
            id: 2,
            title: "Lauv - Modern Loneliness",
            src: "https://www.youtube.com/watch?v=bDidwMxir4o",
        },
        {
            id: 3,
            title: "AKMU - '어떻게 이별까지 사랑하겠어, 널 사랑하는 거지(How can I love the heartbreak, you`re the one I love)' M/V",
            src: "https://www.youtube.com/watch?v=m3DZsBw5bnE",
        },
        {
            id: 31,
            title: "이하이 (LeeHi) - 'ONLY' Official MV",
            src: "https://www.youtube.com/watch?v=KmOVNVZEP9o",
        },
        {
            id: 4,
            title: "Lukas Graham - Happy Home",
            src: "https://youtu.be/QX6UhufF0cs",
        },
        {
            id: 5,
            title: "7UPPERCUTS - YÊU (OFFICIAL MUSIC VIDEO)",
            src: "https://www.youtube.com/watch?v=XHZ3kKlpCWw&t=10s",
        },
        {
            id: 6,
            title: "ĐÁ SỐ TỚI「 LÀ TẤT CẢ 」OFFICIAL MUSIC VIDEO",
            src: "https://www.youtube.com/watch?v=I8kMOJ1eYyM",
        },
    ]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [nowPlaying, setNowPlaying] = useState(playlist[0]);

    // functions
    const onNowPlayingEnded = () => {
        const nowPlayingIndex = playlist.findIndex(p => p.title === nowPlaying.title)
        if(nowPlayingIndex === (playlist.length-1)){
            setNowPlaying(playlist[0])
            return;
        }
        setNowPlaying(playlist[nowPlayingIndex+1]);
    };

    const playSelectedSong = (id) => {
        if(isPlaying && id === nowPlaying.id) return;
        const selectedSong = playlist.find(p=>p.id === id)
        setIsPlaying(true);
        setNowPlaying(selectedSong)
    };

    const setSelectedBackground = (id) => {
        if(id !== currentBackground.id) {
            const selectedBackground = backgroundList.find(p=>p.id === id);
            setCurrentBackground(selectedBackground);
            return;
        }
        return;
    };

    const onYTSearchTermChange = (e) => {
        
        setYTSearchTerm(e.target.value)
    };

    const videoSearch = (term) => {
        YTSearch({key:YOUTUBE_API_KEY, term:term}, (videos) => {
            const resultId = videos[0]?.id?.videoId;
            const resultTitle = videos[0]?.snippet?.title;
            const result = {
                id: resultId,
                title: resultTitle,
                src: `youtube.com/watch?v=${resultId}`
            }
            if(playlist.find(p=>p.id === resultId)) {
                setPopup({title:"Added !", message: "Already add your song to playlist", type:"YES_NO", time:3000})
                setIsShowPopup(true);
                return;
            }
            else{
                const oldPlaylist = playlist;
                setPlaylist([...oldPlaylist,result]);
                setIsSearching(false);
                setYTSearchTerm("");
            }
        })
    };
    useEffect(()=>{
        setLoading(true);
            setTimeout(() => {
                setLoading(false)
            },10000)
    },[])
    return loading?
    <div className={styles.rainWrapper}>
        <Rain/>
        <div className={styles.loadingWrapper}>
            <h1 className={styles.loadingText}>L</h1>
            <h1 className={styles.loadingText}>O</h1>
            <h1 className={styles.loadingText}>A</h1>
            <h1 className={styles.loadingText}>D</h1>
            <h1 className={styles.loadingText}>I</h1>
            <h1 className={styles.loadingText}>N</h1>
            <h1 className={styles.loadingText}>G</h1>
        </div>
    </div>:(
        <div className={styles.container}>
            <Head>
                <title>Songs for life</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/song.ico" />
            </Head>
            <main className={styles.main} 
            style={{ background: `url(${currentBackground.src})` }}
            >
                {isShowPopup && <Popup popup={popup} isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />}
        
                <div className={styles.wrapper}>
                    {/* tab */}
                    <Tabs />
                    {/* marquee */}
                    <Marquee
                        isPlaying={isPlaying}
                        nowPlaying={nowPlaying}
                        setNowPlaying={setNowPlaying}
                        playlist={playlist}
                    />
                    {/* player */}
                    <ReactPlayer
                        className={styles.controllers}
                        playing={isPlaying}
                        controls={true}
                        width={"100%"}
                        url={nowPlaying.src}
                        onEnded={onNowPlayingEnded}
                        onPause={() => setIsPlaying(false)}
                        onStart={() => setIsPlaying(true)}
                        onPlay={() => setIsPlaying(true)}
                    />
                    {/* playlist */}
                    <div className={styles.playlistWrapper} style={{ display: "flex", flexDirection: "column" }}>
                        {/* <Tabs className={"zeroOpacity"}></Tabs> */}
                        <div className={styles.playlist}>
                            <h1>PLAYLIST</h1>
                            <div className={styles.blur}></div>
                            <button
                                className={`${styles.playlistButton} ${isSearching && styles.hidden}`}
                                onClick={() => setIsSearching(true)}
                            >
                                Search on Youtube
                            </button>
                            <div className={`${styles.searchGroup} ${!isSearching && styles.hidden}`}>
                                <input
                                    type="text"
                                    placeholder="Type something..."
                                    className={styles.ytSearchInput}
                                    value={ytSearchTerm}
                                    onChange={e => onYTSearchTermChange(e)}
                                />
                                <button onClick={() => videoSearch(ytSearchTerm)}>Search</button>
                                <button onClick={() => setIsSearching(false)} style={{ marginLeft: 10 }}>
                                    Cancel
                                </button>
                            </div>
                            <div className={styles.playlistitems}>
                                <ol>
                                    {playlist.map(song => (
                                        <div className={styles.song} key={`container ${song.title}`}>
                                            <Image
                                                alt=""
                                                key={song.title}
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
                                                <p className={`${styles.songName}`}>{song.title}</p>
                                            </li>
                                        </div>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                    {/* background */}
                    <div className={styles.background}>
                        {backgroundList.map(background => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                alt=""
                                style={{ zIndex: background.id === currentBackground.id ? 10 : background.id }}
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
