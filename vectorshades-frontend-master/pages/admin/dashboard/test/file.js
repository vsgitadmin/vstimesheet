import React, { useState } from 'react';
import { uploadS3Document } from '../../../../src/Controllers/files';

const UploadS3Document = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setFileName(file.name);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await uploadS3Document(file, fileName);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor="file-input">Select file:</label>
      <input
        id="file-input"
        type="file"
        onChange={handleFileInputChange}
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadS3Document;
