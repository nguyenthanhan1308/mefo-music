import React from 'react'
import styles from "./Tabs.module.css";
export default function Tabs({currentTab,setCurrentTab}) {
    const tabTitleList = ["music", "book", "stream"];
    const onTabClick = tab => {
        if (tab !== currentTab) {
            setCurrentTab(tab);
        }
        return;
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
