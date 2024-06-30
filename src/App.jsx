


import React, { useState } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [conversation, setConversation] = useState([]);

  async function generateAnswer() {
    setAnswer(<i className="fas fa-spinner fa-spin"></i>);

    // Define your custom prompts based on your website content
    const customPrompts = {
      contact: "You can contact us at contact@yourwebsite.com or call us at (123) 456-7890.",
      appointment: "To book an appointment, please visit our booking page or call us at (123) 456-7890.",
      componentAvailability: "Yes, we have a variety of components available. Please visit our components page for more details.",
      pricing: "For pricing information, please visit our pricing page or contact our sales team at sales@yourwebsite.com.",
      services: "We offer a range of services including custom component design, technical support, and consultancy. Visit our services page for more details.",
      support: "For technical support, please visit our support page or email support@yourwebsite.com.",
      shipping: "We offer worldwide shipping. For more information on shipping rates and delivery times, visit our shipping page.",
      returns: "Our return policy allows you to return products within 30 days of purchase. Visit our returns page for more information.",
      warranty: "Our products come with a one-year warranty. Visit our warranty page for more details.",
      paymentMethods: "We accept various payment methods including credit cards, PayPal, and bank transfers. Visit our payment methods page for more information.",
      faq: "Visit our FAQ page for answers to common questions."
    };

    // Check if the query matches any of the custom prompts
    let responseText = null;
    const lowerCaseQuery = query.toLowerCase();
    if (lowerCaseQuery.includes("contact")) {
      responseText = customPrompts.contact;
    } else if (lowerCaseQuery.includes("appointment")) {
      responseText = customPrompts.appointment;
    } else if (lowerCaseQuery.includes("component")) {
      responseText = customPrompts.componentAvailability;
    } else if (lowerCaseQuery.includes("price") || lowerCaseQuery.includes("cost")) {
      responseText = customPrompts.pricing;
    } else if (lowerCaseQuery.includes("service")) {
      responseText = customPrompts.services;
    } else if (lowerCaseQuery.includes("support")) {
      responseText = customPrompts.support;
    } else if (lowerCaseQuery.includes("shipping")) {
      responseText = customPrompts.shipping;
    } else if (lowerCaseQuery.includes("return")) {
      responseText = customPrompts.returns;
    } else if (lowerCaseQuery.includes("warranty")) {
      responseText = customPrompts.warranty;
    } else if (lowerCaseQuery.includes("payment")) {
      responseText = customPrompts.paymentMethods;
    } else if (lowerCaseQuery.includes("faq")) {
      responseText = customPrompts.faq;
    }

    if (responseText) {
      // If a custom response is found, use it
      setAnswer(responseText);

      // Add the query and answer to conversation history
      setConversation(prevConversation => [...prevConversation, { query, answer: responseText }]);
      // Clear the query after generating answer
      setQuery('');
    } else {
      // Otherwise, use the GPT API to generate a response
      try {
        const response = await axios({
          url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBwFybWlwIuEPnLSIJuaA5MOgvXTfhch80",
          method: "post",
          data: {
            "contents": [
              {
                "parts": [
                  {
                    "text": `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nUser: ${query}\nAI:`
                  }
                ]
              }
            ]
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const generatedText = response.data.candidates[0].content.parts[0].text.trim();
        setAnswer(generatedText);

        // Add the query and answer to conversation history
        setConversation(prevConversation => [...prevConversation, { query, answer: generatedText }]);
        // Clear the query after generating answer
        setQuery('');
      } catch (error) {
        console.error('Error fetching response from Gemini API:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          setAnswer(`An error occurred: ${error.response.status} - ${error.response.data.error.message}`);
        } else if (error.request) {
          console.error('Request data:', error.request);
          setAnswer('An error occurred: No response received from API.');
        } else {
          console.error('Error message:', error.message);
          setAnswer(`An error occurred: ${error.message}`);
        }
      }
    }
    
  }

  return (
    <>
      <div className='window'>
        <h1>Chat-bot</h1>
        <div className='question'>
          <input type="text" name="text" id="question" placeholder='Enter your message' value={query} onChange={(e) => { setQuery(e.target.value) }} />
        </div>
        <button onClick={generateAnswer}><i className="fas fa-paper-plane"></i></button>
        <div className='conversation'>
          {conversation.map((item, index) => (
            <div className='message' key={index}>
              <div className='user'>{item.query}</div>
              <div className='bot'>{item.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;

