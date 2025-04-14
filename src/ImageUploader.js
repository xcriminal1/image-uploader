// ImageUploader.js
import React, { useState } from 'react';
import './ImageUploader.css';

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file first');
      return;
    }

    setUploading(true);
    setStatus('Uploading...');

    try {
      // Create FormData object to hold the file
      const formData = new FormData();
      formData.append('file', file);

      // Additional data to match your API requirements
      const fileData = {
        files: [{
          name: file.name,
          size: file.size
        }]
      };

      // Two approaches to try - uncomment the one that works for your API

      // Approach 1: Using FormData with file and additional params
      /*
      formData.append('fileData', JSON.stringify(fileData));
      
      const response = await fetch('https://sh2re.exions.xyz/api/uploadthing?actionType=upload&slug=imageUploader', {
        method: 'POST',
        headers: {
          'authority': 'sh2re.exions.xyz'
          // Note: Do not set Content-Type when using FormData, browser sets it automatically with boundary
        },
        body: formData
      });
      */

      // Approach 2: Using JSON only as specified in your format
      const response = await fetch('https://sh2re.exions.xyz/api/uploadthing?actionType=upload&slug=imageUploader', {
        method: 'POST',
        headers: {
          'authority': 'sh2re.exions.xyz',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileData)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload response:', result);
      
      setResponse(result);
      setStatus('Upload completed successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="uploader-container">
      <div className="uploader-card">
        <h1 className="uploader-title">Image Uploader</h1>
        
        <div className="file-input-group">
          <label>Select an image to upload:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="file-input"
          />
        </div>
        
        {file && (
          <div className="file-info">
            <p>
              Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`upload-button ${uploading || !file ? 'disabled' : ''}`}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        
        {status && (
          <div className={`status-message ${
            status.includes('Error') ? 'error' : 
            status === 'Uploading...' ? 'uploading' : 
            'success'
          }`}>
            {status}
          </div>
        )}
        
        {response && (
          <div className="response-container">
            <h3>Upload Response:</h3>
            <pre className="response-data">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;