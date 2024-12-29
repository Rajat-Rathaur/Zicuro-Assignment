import React from "react";
import "./App.css";
import EditorComponent from "./EditorComponent";
import Title from "./components/Title";

const App = () => {
  return (
    <div className="App">
      <Title />
      <div className="editor-container " style={{ border: "1px solid #507dad", padding: "10px" }}>
        <EditorComponent  />
      </div>
    </div>
  );
};

export default App;
