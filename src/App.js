import React, { useState, useEffect } from "react";
import "./App.css";
import EditorComponent from "./EditorComponent";
import Title from "./components/Title";

const App = () => {
  const [editorContent, setEditorContent] = useState(null);

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        setEditorContent(parsedContent);
      } catch (error) {
        console.error("Error parsing saved content:", error);
      }
    }
  }, []);

  const handleSave = (content) => {
    localStorage.setItem("editorContent", JSON.stringify(content));
    setEditorContent(content); 
  };

  return (
    <div className="App">
      <Title />
      <div className="editor-container " style={{ border: "1px solid #507dad", padding: "10px" }}>
        <EditorComponent initialContent={editorContent} onSave={handleSave}        />
      </div>
    </div>
  );
};

export default App;
