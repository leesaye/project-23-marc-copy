import Layout from "../components/Layout";
import axiosInstance from "../endpoints/api";
import { FormControl, InputLabel, OutlinedInput, Box, Select, Collapse, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function AddContact() {
    const [image, setImage] = useState("https://cdn.vectorstock.com/i/500p/95/56/user-profile-icon-avatar-or-person-vector-45089556.jpg");
    const imageInputRef = useRef();
    const nav = useNavigate();
    const [consent, setConsent] = useState(false);
    const [quizVisible, setQuizVisible] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({
        knownLong: "",
        trust: "",
        communication: "",
        enjoyment: "",
    });
    const [errors, setErrors] = useState({});
    const BASE_URL = `http://127.0.0.1:8000/`;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        job: "",
        relationship: "",
        notes: "",
        relationship_rating: 0
    });

    const handleContactFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    function handleImageUploadClick() {
        imageInputRef.current.click();
    }

    const handleQuizChange = (e) => {
        setQuizAnswers({ ...quizAnswers, [e.target.name]: e.target.value})
    }

    const handleConsentChange = (e) => {
        setConsent(!consent);
    }

    const calculateRelationshipValue = (e) => {
        let value = 0;
        if (quizAnswers.knownLong === "yes") value += 25;
        if (quizAnswers.trust === "yes") value += 25;
        if (quizAnswers.communication === "yes") value += 25;
        if (quizAnswers.enjoyment === "yes") value += 25;
        return value;
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page reload

        const updatedFormData = { ...formData, relationship_rating: quizVisible ? calculateRelationshipValue() : formData.relationship_rating };

        setErrors({});

        // Additional check for the checkbox being selected and its error message
        if (!consent) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                consent: "Consent is required."
            }));
            return;
        }

        try {
            const response = await axiosInstance.post(`${BASE_URL}/contacts/add`, updatedFormData);
            console.log("Contact added:", response.data);
            alert("Contact successfully added!");
            nav('/contacts/');
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                console.error("Error adding contact", error);
                alert("Failed to add contact.");
            }
        }
    };

    return (
        <Layout>
            <div className="conatiner bg-primary-subtle rounded p-3 vh-100">
                <div className="row">
                    <div className="col-5">
                        <h2>Create a new contact</h2>
                    </div>
                    <div className="col-5">
                        <button className="btn btn-primary mt-1" onClick={() => setQuizVisible(!quizVisible)}>Relationship rating quiz</button>
                    </div>
                </div>
                <div className="row">
                    <Box className="col-8" component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <div className="row my-4">
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="name">Name</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    label="Name"
                                    value={formData.name}
                                    onChange={handleContactFormChange}
                                    />
                                    {errors.name && <p className="text-danger">{errors.name[0]}</p>}
                                </FormControl>
                            </div>
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    id="email"
                                    name="email"
                                    placeholder="johndoe@gmail.com"
                                    label="Email"
                                    value={formData.email}
                                    onChange={handleContactFormChange}
                                    />
                                    {errors.email && <p className="text-danger">{errors.email[0]}</p>}
                                </FormControl>
                            </div>
                        </div>
                        <div className="row my-4">
                            <div className="col-4">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="phone">Phone</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    id="phone"
                                    name="phone"
                                    placeholder="111-222-3333"
                                    label="phone"
                                    value={formData.phone}
                                    onChange={handleContactFormChange}
                                    />
                                    {errors.phone && <p className="text-danger">{errors.phone[0]}</p>}
                                </FormControl>
                            </div>
                            <div className="col-4">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="job">Job</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    id="job"
                                    name="job"
                                    placeholder="Software engineer"
                                    label="Job"
                                    value={formData.job}
                                    onChange={handleContactFormChange}
                                    />
                                    {errors.job && <p className="text-danger">{errors.job[0]}</p>}
                                </FormControl>
                            </div>
                            <div className="col-4">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="relationship">Relationship</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    id="relationship"
                                    name="relationship"
                                    placeholder="Coworker"
                                    label="Relationship"
                                    value={formData.relationship}
                                    onChange={handleContactFormChange}
                                    />
                                    {errors.relationship && <p className="text-danger">{errors.relationship[0]}</p>}
                                </FormControl>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="notes">Notes</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    multiline
                                    rows={3}
                                    id="notes"
                                    name="notes"
                                    label="Notes"
                                    value={formData.notes}
                                    onChange={handleContactFormChange}
                                    />
                                    {errors.notes && <p className="text-danger">{errors.notes[0]}</p>}
                                </FormControl>
                            </div>
                        </div>
                        <Collapse in={quizVisible} >
                            <div className="row my-4">
                                <div className="col-6">
                                    <FormControl className="w-100">
                                        <InputLabel htmlFor="knownLong">Have you known them for more than 10 years?</InputLabel>
                                        <Select
                                            id="knownLong"
                                            name="knownLong"
                                            label="Have you known them for more than 10 years?"
                                            value={quizAnswers.knownLong}
                                            onChange={handleQuizChange}
                                        >
                                            <MenuItem value="yes">Yes</MenuItem>
                                            <MenuItem value="no">No</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-6">
                                    <FormControl className="w-100">
                                        <InputLabel htmlFor="trust">Do you trust them?</InputLabel>
                                        <Select
                                            id="trust"
                                            name="trust"
                                            label="Do you trust them?"
                                            value={quizAnswers.trust}
                                            onChange={handleQuizChange}
                                        >
                                            <MenuItem value="yes">Yes</MenuItem>
                                            <MenuItem value="no">No</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="row my-4">
                                <div className="col-6">
                                    <FormControl className="w-100">
                                        <InputLabel htmlFor="communication">Do you feel like you communicate well with them?</InputLabel>
                                        <Select
                                            id="communication"
                                            name="communication"
                                            label="Do you feel like you communicate well with them?"
                                            value={quizAnswers.communication}
                                            onChange={handleQuizChange}
                                        >
                                            <MenuItem value="yes">Yes</MenuItem>
                                            <MenuItem value="no">No</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-6">
                                    <FormControl className="w-100">
                                        <InputLabel htmlFor="enjoyment">Do you enjoy being around them?</InputLabel>
                                        <Select
                                            id="enjoyment"
                                            name="enjoyment"
                                            label="Do you enjoy being around them?"
                                            value={quizAnswers.enjoyment}
                                            onChange={handleQuizChange}
                                        >
                                            <MenuItem value="yes">Yes</MenuItem>
                                            <MenuItem value="no">No</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </Collapse>
                        <FormControlLabel control={<Checkbox />} label="Consent to add this contact" required="required" onChange={handleConsentChange} />
                        {errors.consent && <p className="text-danger">{errors.consent}</p>}
                        <button className="btn btn-success float-end my-4">Submit</button>
                    </Box>
                    <div className="col-4">
                        <div className="row">
                            {image && (<img className="rounded-5 mx-auto" src={image} alt="not found" style={{ maxWidth: "250px", maxHeight: "250px", objectFit: "cover" }}/>)}
                        </div>
                        <br />
                        <div className="row">
                            <button className="btn btn-primary w-50 mx-auto" onClick={handleImageUploadClick}>Upload image</button>
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
