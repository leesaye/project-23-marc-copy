import Layout from "../components/Layout";
import axiosInstance from "../endpoints/api";
import { FormControl, InputLabel, OutlinedInput, Box, Select, Collapse, MenuItem } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ContactId() {
    const { contact_id } = useParams();
    const [contact, setContact] = useState(null);
    const nav = useNavigate();
    const [image, setImage] = useState("https://cdn.vectorstock.com/i/500p/95/56/user-profile-icon-avatar-or-person-vector-45089556.jpg");
    const imageInputRef = useRef();
    const [quizVisible, setQuizVisible] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({
        knownLong: "",
        trust: "",
        communication: "",
        enjoyment: "",
    });
    const [errors, setErrors] = useState({});
    const BASE_URL = "http://127.0.0.1:8000/";

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

        try {
            const response = await axiosInstance.post(`${BASE_URL}/contacts/${contact.id}`, updatedFormData);
            console.log("Contact updated:", response.data);
            alert("Contact successfully updated!");
            nav('/contacts/');
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                console.error("Error updating contact", error);
                alert("Failed to update contact.");
            }
        }
    };

    useEffect(() => {
        axiosInstance.get(`${BASE_URL}contacts/${contact_id}`)
        .then(response => {
            setContact(response.data);
        })
        .catch(error => {
            console.error("Error fetching contact:", error);
        });
    }, [contact_id]);

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`${BASE_URL}/contacts/${contact_id}/delete`);
            console.log(`Contact ${contact_id} deleted successfully`);
            alert("Contact successfully deleted!");
            nav('/contacts/');
        } catch (error) {
            console.error("Error deleting contact:", error);
            alert("Failed to delete contact.");
        }
    };

    useEffect(() => {
        if (contact) {
            setFormData({
                name: contact.name || "",
                email: contact.email || "",
                phone: contact.phone || "",
                job: contact.job || "",
                relationship: contact.relationship || "",
                notes: contact.notes || "",
                relationship_rating: contact.relationship_rating || 0
            });
        }
    }, [contact]);

    return (
        <Layout>
            {!contact ? <p>Loading...</p>:
            <div className="conatiner bg-primary-subtle rounded p-3 vh-100">
                <div className="row">
                    <div className="col-5">
                        <h2>Edit contact: {contact.name}</h2>
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
                                    defaultValue={formData.name}
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
                                    defaultValue={formData.email}
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
                                    defaultValue={formData.phone}
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
                                    defaultValue={formData.job}
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
                                    defaultValue={formData.coworker}
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
                                    defaultValue={formData.notes}
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
                        <button className="btn btn-danger float-end my-4 ms-3" onClick={handleDelete} type="button">Delete contact</button>
                        <button className="btn btn-success float-end my-4" type="submit">Update</button>
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
            }

        </Layout>
    );
}

export default ContactId;
