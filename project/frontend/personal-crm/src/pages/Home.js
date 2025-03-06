import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { getRandom, getAll } from "@divyanshu013/inspirational-quotes";
import TodoSentence from "../components/TodoSentence";
import AIContextProvider from "../contexts/AIContext";

function Home() {
    const [quote, setQuote] = useState([]);

    useEffect(() => {
        const quoteData = getRandom();
        setQuote(quoteData);
    }, []);

    return (
        <Layout>
            <div className="container bg-primary-subtle rounded p-3 min-vh-100">
                <div className="row">
                    <div className="col-2">
                        <h2>Home</h2>
                    </div>
                </div>
                <div className="text-center mx-5">
                    <h3 className="mb-4"></h3>
                    {quote && 
                    <blockquote className="blockquote">
                        <h4><em>{quote.quote}</em></h4>
                        <p>{quote.author}</p>
                    </blockquote>
                    }
                </div>
                <AIContextProvider><TodoSentence/></AIContextProvider>
            </div>
        </Layout>
    );
}

export default Home;