import React, { useState } from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

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
        <label
            className={`${props.className || 'draggable'} ${dragging ? (props.activeClassName || '') : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragEnter}
            onDrop={handleDrop}
        >
            <CloudUploadOutlinedIcon />
            <p>Drag and drop files here, or <span className={props.browseClassName}>click to browse</span></p>
            <input multiple={props.multi} type="file" onChange={event => { props.onFileSelect(event.target.files); event.target.value = '' }} />
        </label>
    );
}

export default FileInput;
