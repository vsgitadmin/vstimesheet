import React, { useCallback, useState } from 'react'
import FullScreenPopup from "../../../../src/Components/Popups/General/FullscreenPopup"
import { Dialog } from '@mui/material'
function fullscreen() {
    const [openFullscreen, setopenFullscreen] = useState(false)

    const Element = <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: 'white' }}>
        <span>Hello world</span>
    </div>

    return <Dialog open PaperProps={{ sx: { p: 3 } }}>
        <FullScreenPopup openFullscreen={openFullscreen} Element={Element} setopenFullscreen={setopenFullscreen} />
        <br />
        <br />
        <span onClick={()=>{setopenFullscreen(true)}} style={{ color: 'darkblue', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' }}>View in fullscreen</span>
    </Dialog>
}

export default fullscreen