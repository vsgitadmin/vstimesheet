import { useState, useEffect } from 'react'
import { SideBar } from '../Components/index'
import TopBar from '../Components/TopBar/TopBar'
import { useRouter } from 'next/router';
import SettingPopup from '../Components/Popups/Settings/SettingsPopup';

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
                </div>
                <SettingPopup open={openSettings} onClose={()=>setOpenSettings(false)} />
            </section>
        )
    else return children
}