import Layout from "../components/Layout";
import { useRef } from "react";
import axiosInstance from "../endpoints/api";
import { useNavigate } from "react-router-dom";

function CSVUpload() {
    const BASE_URL = `http://127.0.0.1:8000/`;
    const csvInputRef = useRef();
    const nav = useNavigate();
    
    // CSV upload
    const handleCSVUploadClick = () => {
        if (csvInputRef.current) {
            csvInputRef.current.click();
        }
    };

    const handleCSVUpload = async (e) => {
        const file = e.target.files[0];

        if (!file || file.type !== "text/csv") {
            alert("Please upload a valid CSV file.");
            return;
        }

        const formData = new FormData();
        formData.append("csv", file);

        try {
            const response = await axiosInstance.post(`${BASE_URL}contacts/importcsv/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                    // CSRF Tokens might be needed?
                },
            });

            console.log("Upload Success:", response.data);
            alert("CSV uploaded successfully");

            // Navigate back to Contacts
            nav("/contacts/")
        } catch (error) {
            console.error("Error uploading CSV:", error);
            console.error("Data:", error.response.data);
            alert("Error uploading CSV");
        }
    };
    
    return (
        <Layout>
            <div className="conatiner bg-primary-subtle rounded p-3 vh-100">
                <h2>How to export LinkedIn contacts as CSV:</h2>
                <ul>
                    <li><h5>1) Log into LinkedIn on your Desktop</h5></li>
                    <li><h5>2) Click "Me" (Your profile picture)</h5></li>
                    <li><h5>3) Click "Settings and Privacy"</h5></li>
                    <li><h5>4) Click "Data Privacy"</h5></li>
                    <li><h5>5) Click on "Get a copy of your data"</h5></li>
                    <li><h5>6) Select "Connections"</h5></li>
                    <li><h5>7) Click "Request Archive"</h5></li>
                    <li><h5>8) After some time, you will recieve an email with the download link</h5></li>
                    <li><h5>9) Click "Download archive"</h5></li>
                </ul>
                <div className="d-flex mt-4">
                    <h5>After downloading your connections on LinkedIn, upload the CSV file here: </h5>
                    <button className="btn btn-success mx-3" onClick={handleCSVUploadClick}>Upload</button>
                    {/* Hidden File Input */}
                    <input
                        type="file"
                        name="csv"
                        ref={csvInputRef}
                        style={{ display: "none" }}
                        accept=".csv"
                        onChange={handleCSVUpload}
                    />
                </div>
            </div>
        </Layout>
    )
}

export default CSVUpload;