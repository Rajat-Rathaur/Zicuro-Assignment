// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import EditorComponent from './EditorComponent';
import { convertToRaw, convertFromRaw } from 'draft-js';

const App = () => {
  const [editorContent, setEditorContent] = useState(null);

  useEffect(() => {
    const savedContent = localStorage.getItem('editor-content');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.blocks && parsedContent.entityMap !== undefined) {
          setEditorContent(parsedContent);
        } else {
          console.error('Invalid content structure in localStorage');
        }
      } catch (error) {
        console.error('Error parsing saved content:', error);
      }
    }
  }, []);

  const handleSave = (content) => {
    localStorage.setItem('editor-content', JSON.stringify(content));
   // console.log('Content saved:', content);
    setEditorContent(content); // Update state to reflect saved content
  };

  return (
    <div className="App">
      <h1>Demo Editor by Rajat</h1>
      <div className="editor-container">
        <EditorComponent initialContent={editorContent} onSave={handleSave} />
      </div>
      <div className="local-storage-content" style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Local Storage Content</h2>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {editorContent ? JSON.stringify(editorContent, null, 2) : 'No content saved yet.'}
        </pre>
      </div>
    </div>
  );
};

export default App;