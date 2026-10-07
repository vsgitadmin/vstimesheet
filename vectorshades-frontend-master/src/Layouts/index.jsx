import { useState, useEffect } from 'react'
import { SideBar } from '../Components/index'
import TopBar from '../Components/TopBar/TopBar'
import { useRouter } from 'next/router';
import SettingPopup from '../Components/Popups/Settings/SettingsPopup';
import ActiveWorkingWidget from '../Components/ActiveWorkingTask/ActiveWorkingWidget';

export default function Layout({ children }) {
    const [URL, setURL] = useState('');
    const router = useRouter();
    const [openSettings, setOpenSettings] = useState(false);

    useEffect(() => {
        setURL(router)
    }, [])

    if (router.asPath.includes('/admin/dashboard'))
        return (
            <section className="layout_container" >
                <SideBar />
                <TopBar openSettings={()=>setOpenSettings(true)} />
                <div className="layout_inner"  >
                    <div className="layout_child" >
                        {children}
                    </div>
                    <footer className="layout_footer">
                        <span>© {new Date().getFullYear()} Vectorshades LLC. All rights reserved.</span>
                        <span className="layout_footer_divider">|</span>
                        <span>Timesheet Version 2.0</span>
                        <span className="layout_footer_divider">|</span>
                        <span>⚡ Developed by R &amp; D Department, Vectorshades LLC</span>
                    </footer>
                </div>
                <SettingPopup open={openSettings} onClose={()=>setOpenSettings(false)} />
                <ActiveWorkingWidget />
            </section>
        )
    else return children
}