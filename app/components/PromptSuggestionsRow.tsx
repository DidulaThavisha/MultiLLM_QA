import PromptSuggestionsButton from "./PromptSuggestionBotton";

const PromptSuggestionsRow = ({onPromptClick}) => {
    const prompts = [
        "Who won the 2021 F1 championship?",
        "Who will win the 2022 F1 championship?",
        "What is the best team in F1?",
        "Who is the best driver in F1?",
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
