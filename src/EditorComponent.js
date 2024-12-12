import React, { useState } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from 'draft-js';
import 'draft-js/dist/Draft.css';

const EditorComponent = ({ initialContent, onSave }) => {
  const [editorState, setEditorState] = useState(
    initialContent
      ? EditorState.createWithContent(convertFromRaw(initialContent))
      : EditorState.createEmpty()
      
  );
  const [activeStyle, setActiveStyle] = useState(null);
  console.log('initialContent:', initialContent)
  console.log('editorState:', editorState)
  // Custom inline style map for styling
  const styleMap = {
    REDLINE: {
      color: 'red',
  
    },
    UNDERLINE: {
      textDecoration: 'underline',
    },
  };

  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleBeforeInput = (chars, state) => {
    const contentState = state.getCurrentContent();
    const selectionState = state.getSelection();
    const currentBlock = contentState.getBlockForKey(selectionState.getStartKey());
    const text = currentBlock.getText();

    // Handle different cases for #, *, **, and ***
    switch (true) {
      case text.startsWith('#') && chars === ' ':
        applyBlockStyle(state, 'header-one', text, 1);
        console.log('header')
        return 'handled';

      case text.startsWith('*') && !text.startsWith('**') && chars === ' ':
        applyInlineStyle(state, 'BOLD', text, 1);
        console.log('bold')
        return 'handled';

      case text.startsWith('**') && !text.startsWith('***') && chars === ' ':
        applyInlineStyle(state, 'REDLINE', text, 2);
        console.log('redline')
        return 'handled';

      case text.startsWith('***') && chars === ' ':
        applyInlineStyle(state, 'UNDERLINE', text, 3);
        console.log('underline')
        return 'handled';

      default:
        return 'not-handled';
    }
  };

  // Helper function to apply block style
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
      'change-block-type'
    );
    setEditorState(RichUtils.toggleBlockType(newState, blockType));
  };

  // Helper function to apply inline style
  const applyInlineStyle = (state, style, text, symbolLength) => {
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
      'change-inline-style'
    );
    setEditorState(RichUtils.toggleInlineStyle(newState, style));
  };

  const handleSave = () => {
    const content = convertToRaw(editorState.getCurrentContent());
    onSave(content);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleSave} style={{ padding: '5px 10px', cursor: 'pointer' }}>
          Save
        </button>
      </div>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        handleBeforeInput={handleBeforeInput}
        customStyleMap={styleMap}
        placeholder="Type here..."
      />
    </div>
  );
};

export default EditorComponent;