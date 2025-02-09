import Layout from "../components/Layout";

import { useNavigate } from "react-router-dom"

import { logout } from "../endpoints/api";
function Home() {
    const nav = useNavigate();
    const handleLogout = async () => {
        const success = await logout();
        if (success){
            nav('/login')
        }
    }
    return (
        <Layout>
            <h1>Home</h1>
            <button className="btn btn-primary w-100 fs-6" onClick={()=>handleLogout()}>
                Logout
            </button>
        </Layout>
    );
}

export default Home;