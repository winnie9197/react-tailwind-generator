import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
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
        const res = await axios.post('http://localhost:3001/api/gpt-3', { prompt }); // This POSTs to your server
        setResponse(res.data); // Capture the response from your server
        setError(null);
    } catch (err) {
        setError(err.response ? err.response.data.error : "An error occurred");
        console.error(err);
    }
};

  return (
    <div className="App bg-gray-100 min-h-screen p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto">
            <form className="mb-4" onSubmit={handleSubmit}>
                <label className="block text-sm font-bold mb-2" htmlFor="prompt">
                    Prompt:
                </label>
                <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="prompt"
                    type="text"
                    value={prompt}
                    onChange={handlePromptChange}
                />
                <button 
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Submit
                </button>
            </form>
            <div className="mb-4">
                <p className="font-semibold">Response:</p>
                <p className="border p-4 rounded">{response}</p>
            </div>
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    </div>
  );
}

export default App;

