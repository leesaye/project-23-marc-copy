import Layout from "../components/Layout";
import { FormControl, InputLabel, OutlinedInput, Box } from "@mui/material";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function AddContact() {
    const [image, setImage] = useState("https://cdn.vectorstock.com/i/500p/95/56/user-profile-icon-avatar-or-person-vector-45089556.jpg");
    const imageInputRef = useRef();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        job: "",
        relationship: "",
        notes: ""
    });

    const nav = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    function handleUploadClick() {
        imageInputRef.current.click();
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page reload

        try {
            const response = await axios.post("http://127.0.0.1:8000/contacts/add", formData);
            console.log("Contact added:", response.data);
            alert("Contact successfully added!");
            nav('/contacts/');
        } catch (error) {
            console.error("Error adding contact", error);
            alert("Failed to add contact.");
            // If we want to clear form fields, uncomment
            // setFormData({ name: "", email: "", job: "", relationship: "", notes: "" });
        }
    };

    return (
        <Layout>
            <div className="conatiner bg-primary-subtle rounded p-3 vh-100">
                <h2>Create a new contact</h2>
                <div className="row">
                    <Box className="col-8" component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <div className="row my-4">
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="name">Name</InputLabel>
                                    <OutlinedInput
                                    required
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    label="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <OutlinedInput
                                    required
                                    id="email"
                                    name="email"
                                    placeholder="johndoe@gmail.com"
                                    label="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                        </div>
                        <div className="row my-4">
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="job">Job</InputLabel>
                                    <OutlinedInput
                                    required
                                    id="job"
                                    name="job"
                                    placeholder="Software engineer"
                                    label="Job"
                                    value={formData.job}
                                    onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="relationship">Relationship</InputLabel>
                                    <OutlinedInput
                                    required
                                    id="relationship"
                                    name="relationship"
                                    placeholder="Coworker"
                                    label="Relationship"
                                    value={formData.relationship}
                                    onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="notes">Notes</InputLabel>
                                    <OutlinedInput
                                    required
                                    multiline
                                    rows={3}
                                    id="notes"
                                    name="notes"
                                    label="Notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                        </div>
                        <div className="row my-4">
                            <div className="col-4">
                                <button className="btn btn-info">Relationship rating quiz</button>
                            </div>
                            <div className="col-8">
                                <button className="btn btn-success float-end">Submit</button>
                            </div>
                        </div>
                    </Box>
                    <div className="col-4">
                        <div className="row">
                            {image && (<img className="rounded-5 mx-auto" src={image} alt="not found" style={{ maxWidth: "250px", maxHeight: "250px", objectFit: "cover" }}/>)}
                        </div>
                        <br />
                        <div className="row">
                            <button className="btn btn-primary w-50 mx-auto" onClick={handleUploadClick}>Upload image</button>
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                name="profile"
                                ref={imageInputRef}
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    if (e.target.files[0].type.startsWith("image/")) {
                                        console.log(e.target.files[0]);
                                        setImage(URL.createObjectURL(e.target.files[0]));
                                    }else {
                                        alert("Please upload a valid image file");
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AddContact;
