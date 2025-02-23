// "use client"
// import Image from 'next/image'
// import f1GPTlogo from "./assets/f1logo.png"
// import { useChat } from "ai/react"
// import { Message } from "ai"
// import LoadingBubble from './components/LoadingBubble'
// import PromptSuggestionsRow from './components/PromptSuggestionsRow'
// import Bubble from './components/Bubble'



// const Home = () => {
//     const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat()

//     const noMessages = !messages || messages.length === 0

//     const handlePrompt = (promptText) => {
//         const msg: Message = {
//             id: crypto.randomUUID(),
//             content: promptText,
//             role: 'user'
//         }
//         append(msg)
//     }

//     return (
//         <main>
//             <Image src={f1GPTlogo} width='250' alt="Formula 1 GPT Logo" />
//             <section className={noMessages ? '' : 'populated'}>
//                 {noMessages ? (
//                     <>
//                         <p className='starter-text'>Ask me anything about the F1 season</p>
//                         <br/>
//                         <PromptSuggestionsRow onPromptClick = {handlePrompt}/>

//                     </>
//                 ) : (
//                     <>  
//                         <div className="bubble-container">
//                         {messages.map((message, index) => (
//                             <div key={`message-${index}`} className="message-group">
//                                 {message.llmResponses.map((response, idx) => (
//                                     <Bubble key={`response-${idx}`} message={response} />
//                                 ))}
//                             </div>
//                         ))}
//                         </div> 
//                         {/* {messages.map((message, index) => <Bubble key={`message-${index}`} message={message}/>)}   */}
//                         {isLoading && <LoadingBubble/>}
//                         {/* <LoadingBubble/> */}
//                     </>
//                 )}

//             </section>
//             <form onSubmit={handleSubmit}>
//                     <input className='question-box' onChange={handleInputChange} value={input} placeholder='Ask me anything about the F1 season' />
//                     <input type='submit'/>    
//                     {/* <button type='submit'>Send</button> */}
//             </form>
//         </main>
//     )
// }

// export default Home



"use client";

import Image from "next/image";
import f1GPTlogo from "./assets/student.webp";
import metalogo from "./assets/meta.png";
import deepseeklogo from "./assets/deepseek.png";
import mixtrallogo from "./assets/mistral.webp";
import React, { useState } from "react";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import Bubble from "./components/Bubble";

const Home = () => {
  // conversations will be an array of objects, each with a userMessage and a responses object
  const [conversations, setConversations] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update input state as the user types.
  const handleInputChange = (e) => setInput(e.target.value);

  // For example, if you have prompt suggestions you can simply set the input.
  const handlePromptClick = (promptText) => setInput(promptText);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new conversation object with the user’s message.
    const userMessage = { role: "user", content: input };
    const newConversation = { userMessage, responses: null };

    // Append the new conversation to your conversation state.
    setConversations((prev) => [...prev, newConversation]);

    // Clear input and indicate loading.
    setInput("");
    setIsLoading(true);

    // Call your API endpoint that returns both models’ responses.
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // You can pass along additional conversation history if needed.
        messages: [userMessage],
      }),
    });
    const data = await response.json();

    // Assume the API returns an object like:
    // { llama: { choices: [ { message: { content: "..." } } ] }, gemma: { choices: [ { message: { content: "..." } } ] } }
    const responses = {
      llama: {
        role: "assistant",
        content: data.llama.choices[0].message.content,
        model: "llama-3.3-70b-versatile",
      },
      deepseek: {
        role: "assistant",
        content: data.deepseek.choices[0].message.content,
        model: "deepseek-r1-distill-qwen-32b",
      },
      mixtral: {
        role: "assistant",
        content: data.mixtral.choices[0].message.content,
        model: "mixtral-8x7b-32768",
      },
    };

    // Update the last conversation with the responses.
    setConversations((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = { ...updated[updated.length - 1], responses };
      return updated;
    });

    setIsLoading(false);
  };

  return (
    <main>
      <Image src={f1GPTlogo} width="250" alt="Formula 1 GPT Logo" />

      <section className="chat-container">
        {conversations.length === 0 ? (
          <>
            <p className="starter-text">Ask me any MCQ/Short Answer question</p>
            <br />
            <PromptSuggestionsRow onPromptClick={handlePromptClick} />
          </>
        ) : (
          conversations.map((conv, idx) => (
            <div key={idx} className="conversation">
              {/* Display the user’s question */}
              <Bubble message={conv.userMessage} />

              {/* Once responses have arrived, display them side by side */}
              {conv.responses && (
                <div className="bubble-container">
                  <div className="response-group">
                    <Image src={metalogo} alt='llama' className="model-logo" />
                    <Bubble message={conv.responses.llama} />
                  </div>
                  <div className="response-group">
                    <Image src={deepseeklogo} alt='deepseek' className="model-logo" />
                    <Bubble message={conv.responses.deepseek} />
                  </div>
                    <div className="response-group">
                        <Image src={mixtrallogo} alt='mixtral' className="model-logo" />
                        <Bubble message={conv.responses.mixtral} />
                    </div>
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && <LoadingBubble />}
      </section>

      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me anything..."
        />
        <input type="submit" value="Send" />
      </form>
    </main>
  );
};

export default Home;
