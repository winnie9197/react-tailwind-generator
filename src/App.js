import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const { Configuration, OpenAIApi } = require("openai");

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

  return (
    <div className="flex flex-col h-screen bg-gray-300 items-center justify-center p-4">

      {/* Main Container */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl space-y-8">

          {/* Title */}
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Ask GPT</h1>
          
          {/* Prompt Section */}
          <div className="space-y-4 border-b-2 pb-6">
              <label className="block text-xl font-medium text-gray-700 mb-2">Prompt:</label>
              <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                      <textarea 
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                          rows="5"
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

          {/* Response Section */}
          <div className="space-y-4 mt-6">
              <label className="block text-xl font-medium text-gray-700 mb-2">Response:</label>
              <div className="flex-1 p-4 border rounded-lg bg-gray-100">
                  <CodeMirror
                      value={response || ""}
                      height="300px"
                      width="100%"
                      extensions={[javascript({ jsx: true })]}
                      onChange={onCodeChange}
                  />
              </div>
          </div>
      </div>

      {error && (
          <div className="mt-6 text-center">
              <p className="text-red-500 font-medium">{error}</p>
          </div>
      )}
  </div>

  );
}

export default App;

