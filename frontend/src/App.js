import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import GLOBE from 'vanta/dist/vanta.globe.min';
import './App.css';

const api_key = 'sk-***'; //Valid OpenAI API key to be entered
const fine_tuned_model_id = 'ft:gpt-3.5-turbo-0125:***';//Valid fine-tuned-model-id to be entered

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x3fffef,
          color2: 0xe0e0e0,
          size: 1.30,
          backgroundColor: 0x0,
          THREE: THREE // Pass the THREE object to Vanta
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        'accept': '*/*',
        'Content-Type': 'application/json',
      };
      const body = {
        prompt: prompt,
      };
      console.log('Request Headers:', headers);
      console.log('Request Body:', body);

      const result = await axios.post('v1/pw_ai_answer', body, { headers });
      console.log('Backend response:', result.data); // Debug log
      await handleOpenAIRequest(prompt, result.data);
    } catch (error) {
      console.error('Error making request:', error);
      if (error.response) {
        console.error('Error response:', error.response);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }
      setResponse('Error making request');
    }
  };

  const handleOpenAIRequest = async (userPrompt, llmAnswer) => {
    try {
      const openaiHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`,
      };
      const combinedPrompt = `Hey, you are a ClimeUp LLM, ClimeUp LLM is a sustainability-specific AI. The user's question is "${userPrompt}" and the information we have is "${llmAnswer}". Please rewrite and make the answer more comprehensive. If no information is available, then generate a response.`;

      const openaiBody = {
        model: fine_tuned_model_id,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: combinedPrompt },
        ],
      };
      console.log('OpenAI Request Headers:', openaiHeaders);
      console.log('OpenAI Request Body:', openaiBody);

      const openaiResult = await axios.post('https://api.openai.com/v1/chat/completions', openaiBody, { headers: openaiHeaders });
      console.log('OpenAI API response:', openaiResult.data); // Debug log
      const answer = openaiResult.data.choices[0].message.content;
      setResponse(answer);
    } catch (error) {
      console.error('Error making direct request to OpenAI:', error);
      setResponse('Error making direct request to OpenAI');
    }
  };

  return (
    <div>
      <div id="vanta-bg" ref={vantaRef}></div>
      <div class="logo"></div>
      <div className="chatbot-container">
        <div className="chatbot-body">
          <div className="response-box">
            <pre>{response}</pre>
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="prompt"></label>
              <input
                id="prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                 placeholder="Ask ClimeUp LLM"
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
