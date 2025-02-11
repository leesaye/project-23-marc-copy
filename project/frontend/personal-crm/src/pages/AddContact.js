import Layout from "../components/Layout";
import { FormControl, InputLabel, OutlinedInput, Box } from "@mui/material";
import { useState, useRef } from "react";

function AddContact() {
    const [image, setImage] = useState("https://cdn.vectorstock.com/i/500p/95/56/user-profile-icon-avatar-or-person-vector-45089556.jpg");
    const imageInputRef = useRef();

    function handleUploadClick() {
        imageInputRef.current.click();
    }

    return (
        <Layout>
            <div className="conatiner bg-primary-subtle rounded p-3 vh-100">
                <h2>Create a new contact</h2>
                <div className="row">
                    <Box className="col-8" component="form" noValidate autoComplete="off">
                        <div className="row my-4">
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="component-outlined">Name</InputLabel>
                                    <OutlinedInput
                                    required
                                    id="component-outlined"
                                    placeholder="John Doe"
                                    label="Name"
                                    />
                                </FormControl>
                            </div>
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="component-outlined">Email</InputLabel>
                                    <OutlinedInput
                                    required
                                    id="component-outlined"
                                    placeholder="johndoe@gmail.com"
                                    label="Email"
                                    />
                                </FormControl>
                            </div>
                        </div>
                        <div className="row my-4">
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="component-outlined">Job</InputLabel>
                                    <OutlinedInput
                                    required
                                    id="component-outlined"
                                    placeholder="Software engineer"
                                    label="Job"
                                    />
                                </FormControl>
                            </div>
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="component-outlined">Relationship</InputLabel>
                                    <OutlinedInput
                                    required
                                    id="component-outlined"
                                    placeholder="Coworker"
                                    label="Relationship"
                                    />
                                </FormControl>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="component-outlined">Notes</InputLabel>
                                    <OutlinedInput
                                    required
                                    multiline
                                    rows={3}
                                    id="component-outlined"
                                    label="Notes"
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