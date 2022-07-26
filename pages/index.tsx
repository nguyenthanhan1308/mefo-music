import Image from 'next/image';
import { useRouter } from "next/router";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import React from 'react';
import axios from "axios";
import ReactPlayer from "react-player";
import YTSearch from "youtube-api-search";
// components
import Rain from "../components/Rain/Rain";
import Tabs from "../components/Tabs/Tabs";
import Marquee from "../components/Marquee/Marquee";
import Popup from "../components/Popup/Popup";
import {Song} from "./typing";

interface Props {
    songs: [Song];
}

export default function Home({songs}:Props) {
    const router = useRouter();
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
            _id: 1,
            title: "fish store",
            src: "/images/fish-store.gif",
        },
        {
            _id: 2,
            title: "night time",
            src: "/images/nighttime.gif",
        },
        {
            _id: 3,
            title: "convenience store",
            src: "/images/conveniencetstore.gif",
        },
        {
            _id: 4,
            title: "peace",
            src: "/images/peace.gif",
        },
        {
            _id: 5,
            title: "your name",
            src: "/images/yourname.gif",
        },
    ];
    const [currentBackground, setCurrentBackground] = useState(backgroundList[1]);
    // playlist state
    const [playlist, setPlaylist] = useState<Song[]>(songs);
    const [isPlaying, setIsPlaying] = useState(false);
    const [nowPlaying, setNowPlaying] = useState<Song>(playlist[0]);

    // functions
    const refreshData = () => router.replace(router.asPath);
    const onNowPlayingEnded = () => {
        const nowPlayingIndex = playlist?.findIndex(p => p?.title === nowPlaying?.title)
        if(nowPlayingIndex === (playlist.length-1)){
            setNowPlaying(playlist[0])
            return;
        }
        setNowPlaying(playlist[nowPlayingIndex+1]);
    };

    const playSelectedSong = (_id) => {
        if(isPlaying && _id === nowPlaying._id) return;
        const selectedSong = playlist.find(p=>p._id === _id)
        setIsPlaying(true);
        setNowPlaying(selectedSong)
    };

    const loadingPlaylist = async () => {
        await axios({
            method: 'get',
            url: 'https://mefo-music.herokuapp.com/api/songs',
        }).then(response => {
            setPlaylist(response.data.songs)
        }).catch(err => {
            console.log(err)
        });
    }

    const setSelectedBackground = (_id) => {
        if(_id !== currentBackground._id) {
            const selectedBackground = backgroundList.find(p => p._id === _id);
            setCurrentBackground(selectedBackground);
            return;
        }
        return;
    };

    const onYTSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setYTSearchTerm(e.target.value)
    };

    const videoSearch = async (term: string, event) => {
        event.preventDefault();
        await YTSearch({ key: YOUTUBE_API_KEY, term: term }, async videos => {
            const resultId = videos[0]?.id?.videoId;
            const resultTitle = videos[0]?.snippet?.title;
            const params = {
                title: resultTitle,
                src: `youtube.com/watch?v=${resultId}`,
            };
            if (playlist.find(p => p._id === resultId)) {
                setPopup({
                    title: "Added !",
                    message: "Already add your song to playlist",
                    type: "YES_NO",
                    time: 3000,
                });
                setIsShowPopup(true);
                return;
            } else {
                await axios.post('https://mefo-music.herokuapp.com/api/songs', params)
                    .then(() => {                 loadingPlaylist();  })
                    .catch(err => { console.log(err.response.data); })

                setIsSearching(false);
                setYTSearchTerm("");
            }
        });
    };
    useEffect(()=>{
        setLoading(true);
            setTimeout(() => {
                setLoading(false)
            },10000)
    },[]);

    return loading ? (
        <div className={styles.rainWrapper}>
            <audio autoPlay preload="auto" loop>
                <source src="https://www.soundjay.com/nature/rain-03.mp3" type="audio/mpeg" />
            </audio>
            <Rain />
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
    ) : (
        <div className={styles.container}>
            <Head>
                <title>{`Just chillin'`}</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/song.ico" />
            </Head>
            <main className={styles.main} style={{ background: `url(${currentBackground.src})` }}>
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
                            <h2>PLAYLIST</h2>
                            <div className={styles.blur}></div>
                            <button
                                type="button"
                                className={`${styles.playlistButton} ${isSearching && styles.hidden}`}
                                onClick={() => setIsSearching(true)}
                            >
                                Search on Youtube
                            </button>
                            <form onSubmit={() => videoSearch(ytSearchTerm, event)} className={`${styles.searchGroup} ${!isSearching && styles.hidden}`}>
                                <input
                                    type="text"
                                    placeholder="Type something..."
                                    className={styles.ytSearchInput}
                                    value={ytSearchTerm}
                                    onChange={e => onYTSearchTermChange(e)}
                                />
                                <button type="submit" >
                                    Search
                                </button>
                                <button type="button" onClick={() => setIsSearching(false)} style={{ marginLeft: 10 }}>
                                    Cancel
                                </button>
                            </form>
                            <div className={styles.playlistitems}>
                                <ol>
                                    {playlist.map(song => (
                                        <div className={styles.song} key={`container ${song.title}`}>
                                            <Image
                                                alt=""
                                                key={song.title}
                                                onClick={() => playSelectedSong(song._id)}
                                                className={`${styles.songIcon}`}
                                                src={`${
                                                    song._id === nowPlaying._id && isPlaying
                                                        ? "/playingsound.gif"
                                                        : "/sound.png"
                                                }`}
                                                height={nowPlaying._id === song._id && isPlaying ? 60 : 30}
                                                width={nowPlaying._id === song._id && isPlaying ? 60 : 30}
                                            />
                                            <li
                                                className={`${song._id === nowPlaying._id ? styles.nowPlaying : ""} ${
                                                    styles.songListItem
                                                }`}
                                                key={song._id}
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
                                style={{ zIndex: background._id === currentBackground._id ? 10 : background._id }}
                                className={styles.backgroundImg}
                                key={background.title}
                                src={background.src}
                                onClick={() => setSelectedBackground(background._id)}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export const getServerSideProps = async () => {
    const songs = await axios({
        method: 'get',
        url: 'https://mefo-music.herokuapp.com/api/songs',
    }).then(response => {
        return response.data.songs;
    }).catch(err => {
        console.log(err)
    });
    return {
        props: {songs}
    };
}