import React from 'react'
import styles from "./Tabs.module.css";
export default function Tabs({currentTab,setCurrentTab,}) {
    const element = document.getElementsByClassName("Home_controllers__0W4rT")[0]
    const hideReactPlayer = () =>{ 
        element.classList.add("hidden")
    }
    const showReactPlayer = () =>{ 
        element.classList.remove("hidden")
    }
    const tabTitleList = ["music", "book", "stream"];
    const onTabClick = tab => {
        if (tab !== currentTab) {
            tab !== "music" ? hideReactPlayer() : showReactPlayer();
            setCurrentTab(tab);
        }
        else return;
    };
    return (
        <div className={`${styles.tabs}`}>
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
    );
}
