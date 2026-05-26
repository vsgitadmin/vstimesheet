import React, { useState } from 'react';

function FileInput(props) {
    const [dragging, setDragging] = useState(false);

    function handleDragEnter(event) {
        event.preventDefault();
        setDragging(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDragging(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        setDragging(false);
        const files = event.dataTransfer.files;
        props.onFileSelect(files);
    }

    return (
        <div
            className={'draggable'}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragEnter}
            onDrop={handleDrop}
            style={{
                border: '2px dotted black',
                height: '150px',
                borderRadius: '6px',
                marginTop: '11px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div style={{display:"flex",flexDirection:"column",gap:"5px"}} >
                <input multiple={props.multi} type="file" onChange={event => {props.onFileSelect(event.target.files);event.target.value=''}} />
                <p>Drag and drop files here, or click to select files</p>
            </div>

        </div>
    );
}

export default FileInput;