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
    const [timeQuotes, setTimeQuotes] = useState<String>("");
    // env
    const YOUTUBE_API_KEY = "AIzaSyCHpX3Eo4T-1Rkx3snL6ZEjEJ91-6jafTQ";
    const [loading, setLoading] = useState(false);
    const [playlistLoading, setPlaylistLoading] = useState(false);
    // tab
    const [currentTab, setCurrentTab] = useState("music");
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
            title: "cafe",
            src: "/images/cafe.gif",
        },
    ];
    const [currentBackground, setCurrentBackground] = useState(backgroundList[1]);
    // playlist state
    const [playlist, setPlaylist] = useState<Song[]>(songs);
    const [isPlaying, setIsPlaying] = useState(false);
    const [nowPlaying, setNowPlaying] = useState<Song>(playlist[0]);

    // functions
    const onNowPlayingEnded = () => {
        const nowPlayingIndex = playlist.findIndex(p => p?._id === nowPlaying?._id)
        if(nowPlayingIndex === (playlist.length-1)){
            setNowPlaying(playlist[0])
            return;
        }
        setNowPlaying(playlist[nowPlayingIndex+1]);
    };

    const playSelectedSong = (_id: string) => {
        if(isPlaying && _id === nowPlaying?._id) return;
        const selectedSong = playlist.find(p=>p._id === _id)
        setIsPlaying(true);
        setNowPlaying(selectedSong)
    };
    const deleteSelectedSong = async (_id: string) => {
        setPlaylistLoading(true);
        const deleteIndex = playlist.findIndex(p => p?._id === _id);
        const deleteSong = playlist.find(p => p?._id === _id);
        if(deleteSong?._id === nowPlaying?._id && isPlaying){
            if(deleteIndex === playlist.length-1) {
                setNowPlaying(playlist[deleteIndex-1])
            }
            else{
                setNowPlaying(playlist[deleteIndex+1])
            }
        }   
        await axios({
            method: 'delete',
            url: 'https://mefo-music.herokuapp.com/api/songs',
            data: {
                _id: _id
            }
        }).then(() => {
            loadPlaylist();
        }).catch(err => {   
            console.log(err)
        });
    };

    const loadPlaylist = async () => {
        await axios({
            method: 'get',
            url: 'https://mefo-music.herokuapp.com/api/songs',
        }).then(response => {
            setPlaylist(response.data.songs);
            setPlaylistLoading(false)
        }).catch(err => {
            console.log(err)
        });
    }

    const setSelectedBackground = (_id : number) => {
        if(_id !== currentBackground._id) {
            const selectedBackground = backgroundList.find(p => p._id === _id);
            setCurrentBackground(selectedBackground);
        }
        else return;
    };

    const onYTSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setYTSearchTerm(e.target.value)
    };

    const resetSearchTerm = () => {
        setPlaylistLoading(false);
        setYTSearchTerm("");
    }

    const videoSearch = async (term: string, event ) => {
        event.preventDefault();
        await YTSearch({ key: YOUTUBE_API_KEY, term: term }, async videos => {
            const resultId = videos[0]?.id?.videoId;
            const resultTitle = videos[0]?.snippet?.title;
            const params = {
                title: resultTitle,
                src: `https://www.youtu.be/${resultId}`,
            };
            if(!term) {
                setPopup({
                    message: "At least type something :D",
                    type: "YES_NO",
                });
                setIsShowPopup(true);
                setPlaylistLoading(false);
            }
            else if (playlist.find(p => p.src === `https://www.youtu.be/${resultId}`)) {
                setPopup({
                    message: "Already in playlist!",
                    type: "YES_NO",
                });
                setIsShowPopup(true);
            } 
            else {
                setPlaylistLoading(true);
                await axios
                    .post("https://mefo-music.herokuapp.com/api/songs", params)
                    .then(() => {
                        loadPlaylist();
                        setIsSearching(false);
                    })
                    .catch(err => {
                        setPopup({
                            message: "Failed to get playlist!",
                            type: "ERROR",
                        });
                        console.log(err.response.data);
                    });
                }
            resetSearchTerm();
        });
    };
    useEffect(()=>{
        // setLoading(true);
        //     setTimeout(() => {
        //     setLoading(false);
        // },10000)
        const time = new Date().getHours();
        switch (true) {
            case time >= 4 && time < 11:
                setTimeQuotes("Good morning lady !");
                break;
            case (time >= 11 && time < 13) :
                setTimeQuotes("Go take a nap !");
                break;
            case (time >= 13 && time < 17) :
                setTimeQuotes("Do your best !");
                break;
            case (time >= 17 && time < 23) :
                setTimeQuotes("Well done, let's go home!");
                break;
            case (time >= 23 && time < 4) :
                setTimeQuotes("Why are you still here ? Go to bed !");
                break;
        }
    },[]);

    return loading ? (
        <div className={styles.rainWrapper}>
            <audio autoPlay preload="auto" loop>
                <source src="/audio/rain.mp3" type="audio/mpeg" />
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
                <meta name="description" content="Mefo Music" />
                <link rel="icon" href="/song.ico" />
            </Head>
            <main className={styles.main} style={{ background: `url(${currentBackground.src})` }}>
                <p className={styles.timeQuotes}>{timeQuotes}</p>
                {isShowPopup && <Popup popup={popup} isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />}
                <div className={styles.wrapper}>
                    {/* tab */}
                    <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
                    {/* music tab */}
                    {/* marquee */}
                    <Marquee
                        isPlaying={isPlaying}
                        nowPlaying={nowPlaying}
                        setNowPlaying={setNowPlaying}
                        playlist={playlist}
                        currentTab={currentTab}
                    />
                    {/* player */}
                    <ReactPlayer
                        className={`${currentTab === "music" ? styles.controllers : styles.tabHidden}`}
                        playing={isPlaying}
                        controls={true}
                        url={nowPlaying?.src}
                        // stopOnUnmount={false}
                        onEnded={onNowPlayingEnded}
                        onPause={() => setIsPlaying(false)}
                        onStart={() => setIsPlaying(true)}
                        onPlay={() => setIsPlaying(true)}
                    />
                    {/* playlist */}
                    <div
                        className={`${styles.playlistWrapper} ${currentTab === "music" ? "" : styles.tabHidden}`}
                        style={{ display: "flex", flexDirection: "column" }}
                    >
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
                            <form
                                onSubmit={() => videoSearch(ytSearchTerm, event)}
                                className={`${styles.searchGroup} ${!isSearching && styles.hidden}`}
                            >
                                <input
                                    type="text"
                                    placeholder="Type something..."
                                    readOnly={playlistLoading}
                                    className={`${styles.ytSearchInput} ${
                                        playlistLoading ? styles.loadingPlaylist : ""
                                    }`}
                                    value={ytSearchTerm}
                                    onChange={e => onYTSearchTermChange(e)}
                                />
                                <button
                                    type="submit"
                                    disabled={playlistLoading}
                                    className={`${playlistLoading ? styles.loadingPlaylist : ""}`}
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsSearching(false)}
                                    disabled={playlistLoading}
                                    className={`${styles.cancelButton} ${
                                        playlistLoading ? styles.loadingPlaylist : ""
                                    }`}
                                >
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
                                                className={`${styles.songIcon} ${
                                                    playlistLoading ? styles.loadingPlaylist : ""
                                                } ${
                                                    song._id === nowPlaying?._id && isPlaying
                                                        ? styles.fullOpacity
                                                        : styles.blurOpacity
                                                }`}
                                                src={`${
                                                    song._id === nowPlaying?._id && isPlaying
                                                        ? "/images/playingsound.gif"
                                                        : "/images/sound.png"
                                                }`}
                                                height={nowPlaying?._id === song._id && isPlaying ? 60 : 30}
                                                width={nowPlaying?._id === song._id && isPlaying ? 60 : 30}
                                            />
                                            {playlistLoading ? (
                                                <div className={styles.playlistLoading}></div>
                                            ) : (
                                                <li
                                                    className={`${
                                                        song._id === nowPlaying?._id ? styles.nowPlaying : ""
                                                    } ${styles.songListItem}`}
                                                    key={song._id}
                                                >
                                                    <p className={`${styles.songName}`}>{song.title}</p>
                                                </li>
                                            )}
                                            <Image
                                                alt=""
                                                key={song.title}
                                                onClick={() => deleteSelectedSong(song._id)}
                                                className={`${styles.songDeleteIcon} ${
                                                    playlistLoading ? styles.loadingPlaylist : ""
                                                }`}
                                                src={`${"/images/delete.png"}`}
                                                height={22}
                                                width={22}
                                            />
                                        </div>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                    <p className={styles.footer}>{`By me, for you, for me.`}</p>
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
        console.log(err);
        return [];
    });
    return {
        props: {songs}
    };
}