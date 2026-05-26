import React, { useEffect } from 'react'

import { FullScreen, useFullScreenHandle } from "react-full-screen";

function FullscrennPopup({ Element, openFullscreen, setopenFullscreen }) {

    const screenHandler = useFullScreenHandle();

    useEffect(() => {
        if (openFullscreen) {
            screenHandler.enter()
        } else {
            screenHandler.exit()
        }
    }, [openFullscreen])


    return (
        <FullScreen handle={screenHandler} onChange={(state) => {
            if (openFullscreen != state)
                setopenFullscreen(state)
        }} >
            {Element}
        </FullScreen>
    )
}

export default FullscrennPopup