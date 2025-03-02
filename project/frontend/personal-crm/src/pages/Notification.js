


import Layout from "../components/Layout";
import SampleAIChat from "../components/SampleAIChat";
import AIContextProvider from "../contexts/AIContext";

function Notification() {
    return (
        <Layout>
            <AIContextProvider><SampleAIChat/></AIContextProvider>
        </Layout>
    );
}

export default Notification;