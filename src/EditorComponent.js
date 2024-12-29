import React, { useState} from "react";
import SaveButton from "./components/SaveButton";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";

const EditorComponent = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const styleMap = {
    REDLINE: {
      color: "red",
    },
    UNDERLINE: {
      textDecoration: "underline",
    },
    BOLD: {
      fontWeight: "bold",
    },
  };

  const handleSave = () => {
    const content = convertToRaw(editorState.getCurrentContent());
    localStorage.setItem("editorContent", JSON.stringify(content));
    alert("Content saved!");
  };

  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleReturn = (e, state) => {
    const contentState = state.getCurrentContent();
    const selectionState = state.getSelection();

    const updatedContent = Modifier.splitBlock(contentState, selectionState);

    const newState = EditorState.push(
      state,
      updatedContent,
      "split-block"
    );

    const clearedState = EditorState.setInlineStyleOverride(
      newState,
      new Set()
    );

    setEditorState(EditorState.forceSelection(clearedState, clearedState.getSelection()));
    return "handled";
  };

  const handleBeforeInput = (chars, state) => {
    const contentState = state.getCurrentContent();
    const selectionState = state.getSelection();
    const currentBlock = contentState.getBlockForKey(
      selectionState.getStartKey()
    );
    const text = currentBlock.getText();

    switch (true) {
      case text.startsWith("#") && chars === " ":
        applyBlockStyle(state, "header-one", text, 1);
        return "handled";

      case text.startsWith("*") && !text.startsWith("**") && chars === " ":
        applyInlineStyle(state, "BOLD", text, 1);
        return "handled";

      case text.startsWith("**") && !text.startsWith("***") && chars === " ":
        applyInlineStyle(state, "REDLINE", text, 2);
        return "handled";

      case text.startsWith("***") && chars === " ":
        applyInlineStyle(state, "UNDERLINE", text, 3);
        return "handled";

      default:
        return "not-handled";
    }
  };

  const applyBlockStyle = (state, blockType, text, symbolLength) => {
    const contentState = state.getCurrentContent();
    const selectionState = state.getSelection();

    const withoutSymbol = text.slice(symbolLength).trim();
    const contentWithoutSymbol = Modifier.replaceText(
      contentState,
      selectionState.merge({
        anchorOffset: 0,
        focusOffset: text.length,
      }),
      withoutSymbol
    );

    const newState = EditorState.push(
      state,
      contentWithoutSymbol,
      "change-block-type"
    );
    setEditorState(RichUtils.toggleBlockType(newState, blockType));
  };

  const clearInlineStyles = (state) => {
    const contentState = state.getCurrentContent();
    const selectionState = state.getSelection();
    const currentStyle = state.getCurrentInlineStyle();

    let newContentState = contentState;
    currentStyle.forEach((style) => {
      newContentState = Modifier.removeInlineStyle(
        newContentState,
        selectionState,
        style
      );
    });

    return EditorState.push(state, newContentState, "change-inline-style");
  };

  const applyInlineStyle = (state, style, text, symbolLength) => {
    const clearedState = clearInlineStyles(state);

    const contentState = clearedState.getCurrentContent();
    const selectionState = clearedState.getSelection();

    const withoutSymbol = text.slice(symbolLength).trim();
    const contentWithoutSymbol = Modifier.replaceText(
      contentState,
      selectionState.merge({
        anchorOffset: 0,
        focusOffset: text.length,
      }),
      withoutSymbol
    );

    const newState = EditorState.push(
      clearedState,
      contentWithoutSymbol,
      "change-inline-style"
    );
    setEditorState(RichUtils.toggleInlineStyle(newState, style));
  };

  return (
    <div style={{ border: "1px solid #507dad", padding: "10px" }}>
     <div style={{ marginBottom: "10px" }}>
        <SaveButton onClick={handleSave} />
      </div>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        customStyleMap={styleMap}
        handleKeyCommand={handleKeyCommand}
        handleBeforeInput={handleBeforeInput}
        handleReturn={(e) => handleReturn(e, editorState)}
        placeholder="Type here..."
        
      
      />
    </div>
  );
};

export default EditorComponent;
