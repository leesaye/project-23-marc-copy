import Layout from "../components/Layout";
import SampleAIChat from "../components/SampleAIChat";
import TodoSentence from "../components/TodoSentence";
import AIContextProvider from "../contexts/AIContext";

function Notification() {
    return (
        <Layout>
            {/* <AIContextProvider><SampleAIChat/></AIContextProvider> */}
            {/* <AIContextProvider><TodoSentence/></AIContextProvider> */}
        </Layout>
    );
}

export default Notification;