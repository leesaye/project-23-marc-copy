import { useState, createContext } from "react";
import run from "../endpoints/gemini";

export const Context = createContext();

const AIContextProvider = (props) => {

    const [input, setInput] = useState(""); //save the input data
    const [recentPrompt, setRecentPrompt] = useState(""); //input field data will be saved here
    const [prevPrompt, setPrevPrompts] = useState([]); //stores all input history
    const [showResult, setShowResult] = useState(false); //when true hide text and boxes
    const [loading,setLoading] = useState(false); //if true it will display loading animation and after getting data we make it false
    const [resultData, setResultData] = useState(""); //display result on webpage

    const onSent = async (prompt) => {
        setResultData("") //remove preivoius response
        setLoading(true) //display loading animation
        setShowResult(true)
        setRecentPrompt(input)
        setPrevPrompts(prev=>[...prev,input])
        const response = await run(input)
        //formatting for api response
        let responseArray = response.split("**")
        let newResponse = "";
        //for bold **
        for (let i = 0; i < responseArray.length; i++){
            if ( i === 0 || i%2 !== 1) { //if index divided by 2 and the remainder is not 1 then it is even and then we will add a new array
                newResponse += responseArray[i];
            }
            else{
                newResponse += "<b>"+responseArray[i]+"</b>"; //this will bold double stars
            }
        }
        // for new line when *
        let newResponse2 = newResponse.split("*").join("</br>")
        // setResultData(response) //save the response this is the unformatted response
        setResultData(newResponse2)
        setLoading(false)
        setInput("") //reset the input 
        // await run(prompt)
    }

    // onSent("what is react js")
    const contextValue = {
        prevPrompt,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default AIContextProvider 