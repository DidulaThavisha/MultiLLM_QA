import PromptSuggestionsButton from "./PromptSuggestionBotton";

const PromptSuggestionsRow = ({onPromptClick}) => {
    const prompts = [
        "What type of current does a transformer work with?",
        "What is the purpose of a heat sink in electronics?",
        "What is the difference between TCP and UDP?",
        "Which data structure is used to implement a priority queue?",
    ]
    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => 
                <PromptSuggestionsButton 
                    key={`suggestion-${index}`} 
                    text={prompt} 
                    onClick={() => onPromptClick(prompt)}
                />
            )}
        </div>
    )
}

export default PromptSuggestionsRow;
