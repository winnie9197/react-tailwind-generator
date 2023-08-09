import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const { Configuration, OpenAIApi } = require("openai");

function getExtensionFromContent(firstLine) {
    switch (firstLine) {
        case "javascript":
            return ".js"
        case "css":
            return ".css"
        default:
            return ".txt"
    }
}

function processContent(rawContent) {
  const lines = rawContent.trim().split('\n');
  const firstLine = lines[0].trim().toLowerCase();

  const extension = getExtensionFromContent(firstLine);

  // Remove the first line for display
  const content = lines.slice(1).join('\n');

  return { extension, content };
}

function downloadContent(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const element = document.createElement('a');
  element.setAttribute('href', URL.createObjectURL(blob));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);  

  const handlePromptChange = event => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        console.log(prompt);
        const res = await axios.post('http://localhost:3001/api/gpt-3', { prompt }); // This POSTs to your server
        setResponse(res.data); // Capture the response from your server
        setError(null);
    } catch (err) {
        setError(err.response ? err.response.data.error : "An error occurred");
        console.error(err);
    }
};

  const onCodeChange = React.useCallback((value, viewUpdate) => {
    console.log('value:', value);
  }, []);

  // Split the response into code blocks
  const codeBlocks = response.split("```").filter(block => block.trim() !== "");

  return (
    <div className="flex h-screen bg-gray-300 p-4">

      {/* Sidebar for Prompt */}
      <div className="flex-none w-1/4 p-8 bg-white rounded-2xl shadow-lg space-y-8 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4 text-gray-700">Ask GPT</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Prompt:</label>
                  <textarea 
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      rows="10"
                      placeholder="Enter your prompt here..."
                      value={prompt}
                      onChange={handlePromptChange}
                  ></textarea>
              </div>
              <div>
                  <button 
                      type="submit"
                      className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                  >
                      Submit
                  </button>
              </div>
          </form>
      </div>

      {/* Main Content Area for Response */}
      <div className="flex-1 p-8 bg-gray-100 rounded-2xl shadow-lg overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Response:</h2>
          {codeBlocks.map((block, index) => {
            const { extension, content } = processContent(block);

            // Using a rudimentary check to decide if a block is code or not.
            const isCode = content.trim().startsWith('<') || content.trim().includes(';');

            return isCode ? 
            (
              <div key={index} className="flex-1 p-4 mb-4 border rounded-lg bg-white relative">
                  <button 
                      onClick={() => downloadContent(`codeblock_${index}${extension}`, block)}
                      className="absolute top-2 right-2 p-2 rounded transition-colors z-10"
                      title="Download" 
                  >
                      <i className="fas fa-download text-gray-300"></i>

                  </button>
                  <CodeMirror
                      value={content}
                      height="auto"
                      width="100%"
                      extensions={[javascript({ jsx: true })]}
                      onChange={onCodeChange}
                  />
              </div>
          
            ) : 
            (<p key={index} className="my-4 p-4 border rounded-lg bg-white">{block}</p>);
        })}
      </div>

  </div>

  );
}

export default App;

