"use client"
import Image from 'next/image'
import f1GPTlogo from "./assets/f1logo.png"
import { useChat } from "ai/react"
import { Message } from "ai"
import LoadingBubble from './components/LoadingBubble'
import PromptSuggestionsRow from './components/PromptSuggestionsRow'
import Bubble from './components/Bubble'



const Home = () => {
    const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat()

    const noMessages = !messages || messages.length === 0

    const handlePrompt = (promptText) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: 'user'
        }
        append(msg)
    }

    return (
        <main>
            <Image src={f1GPTlogo} width='250' alt="Formula 1 GPT Logo" />
            <section className={noMessages ? '' : 'populated'}>
                {noMessages ? (
                    <>
                        <p className='starter-text'>Ask me anything about the F1 season</p>
                        <br/>
                        <PromptSuggestionsRow onPromptClick = {handlePrompt}/>

                    </>
                ) : (
                    <>   
                        {messages.map((message, index) => <Bubble key={`message-${index}`} message={message}/>)}  
                        {isLoading && <LoadingBubble/>}
                        {/* <LoadingBubble/> */}
                    </>
                )}

            </section>
            <form onSubmit={handleSubmit}>
                    <input className='question-box' onChange={handleInputChange} value={input} placeholder='Ask me anything about the F1 season' />
                    <input type='submit'/>    
                    {/* <button type='submit'>Send</button> */}
            </form>
        </main>
    )
}

export default Home