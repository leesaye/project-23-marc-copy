import Layout from "../components/Layout";
import axiosInstance from "../endpoints/api";
import { FormControl, InputLabel, OutlinedInput, Box, Collapse } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';

function ContactId() {
    const { contact_id } = useParams();
    const [contact, setContact] = useState(null);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 800px)' });
    const nav = useNavigate();
    const [image, setImage] = useState("https://cdn.vectorstock.com/i/500p/95/56/user-profile-icon-avatar-or-person-vector-45089556.jpg");
    const [imageFile, setImageFile] = useState("https://cdn.vectorstock.com/i/500p/95/56/user-profile-icon-avatar-or-person-vector-45089556.jpg");
    const imageInputRef = useRef();
    const [quizVisible, setQuizVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const BASE_URL = "http://127.0.0.1:8000/";

    const QUIZ_QUESTIONS = [
        "Have they ever supported you in a meaningful way? How?",
        "How well do you click with them?",
        "How often do you communicate with this person?",
        "Would you feel comfortable asking them for a favor? What kind?"
    ];

    const [quizAnswers, setQuizAnswers] = useState(
        Object.fromEntries(QUIZ_QUESTIONS.map((question) => [question, ""]))
    );


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

    const handleQuizChange = (e, question) => {
        setQuizAnswers({ ...quizAnswers, [question]: e.target.value });
    };

    // Convert to FormData instance so we can send pic and data in one req
    function createFormData(updatedFormData, formattedQuizAnswers, imageFile) {
        const newFormData = new FormData();

        Object.entries(updatedFormData).forEach(([key, value]) => {
            if (value !== undefined) {
                newFormData.append(key, value);
            }
        });

        newFormData.append("quiz_answers", JSON.stringify(formattedQuizAnswers));

        if (imageFile) {
            newFormData.append("pfp", imageFile);
        }

        return newFormData;
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page reload

        // Convert quizAnswers to list of { question, answer }
        const formattedQuizAnswers = Object.entries(quizAnswers).map(([question, answer]) => ({
            question,
            answer
        }));

        const updatedFormData = {
            ...formData,
        };

        try {
            const newFormData = createFormData(updatedFormData, formattedQuizAnswers, imageFile);
            const response = await axiosInstance.post(`${BASE_URL}contacts/${contact.id}`, newFormData);
            console.log("Contact updated:", response.data);
            alert("Contact successfully updated!");
            nav('/contacts/');
        } catch (error) {
            if (error.response && error.response.data) {
                 // Image validation error checker
                if (error.response.status === 400 && error.response.data.error) {
                    alert(error.response.data.error);
                } else {
                    setErrors(error.response.data);
                }
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
            if (response.data.pfp) {
                setImage(`data:image/png;base64,${response.data.pfp}`);
            }
        })
        .catch(error => {
            console.error("Error fetching contact:", error);
        });
    }, [contact_id]);

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`${BASE_URL}contacts/${contact_id}/delete`);
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
            {!contact && <p>Loading...</p>}
            {contact && (!isSmallScreen ? (
                <div className="container bg-primary-subtle rounded p-3 min-vh-100">
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
                                    {QUIZ_QUESTIONS.map((question, index) => (
                                        <div key={index} className="col-6">
                                            <div className="mb-3">
                                                <FormControl className="w-100">
                                                    <InputLabel htmlFor={`quiz-${index}`}>{question}</InputLabel>
                                                    <OutlinedInput
                                                        id={`quiz-${index}`}
                                                        name={`quiz-${index}`}
                                                        label={question}
                                                        value={quizAnswers[question]}
                                                        onChange={(e) => handleQuizChange(e, question)}
                                                    />
                                                </FormControl>
                                            </div>
                                        </div>
                                    ))}
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
                                            setImageFile(e.target.files[0])
                                        }else {
                                            alert("Please upload a valid image file");
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container bg-primary-subtle rounded p-3 min-vh-100">
                    <div className="row text-center">
                        <h2>Edit contact: {contact.name}</h2>
                    </div>
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
                                    setImageFile(e.target.files[0])
                                }else {
                                    alert("Please upload a valid image file");
                                }
                            }}
                        />
                    </div>
                    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <div className="row my-4">
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="name-s">Name</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    id="name-s"
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
                                    <InputLabel htmlFor="email-s">Email</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    id="email-s"
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
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="phone-s">Phone</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    id="phone-s"
                                    name="phone"
                                    defaultValue={formData.phone}
                                    label="phone"
                                    value={formData.phone}
                                    onChange={handleContactFormChange}
                                    />
                                    {errors.phone && <p className="text-danger">{errors.phone[0]}</p>}
                                </FormControl>
                            </div>
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="job-s">Job</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    id="job-s"
                                    name="job"
                                    defaultValue={formData.job}
                                    label="Job"
                                    value={formData.job}
                                    onChange={handleContactFormChange}
                                    />
                                    {errors.job && <p className="text-danger">{errors.job[0]}</p>}
                                </FormControl>
                            </div>
                        </div>
                        <div className="row my-4">
                            <div className="col-12">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="relationship-s">Relationship</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    id="relationship-s"
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
                        <div className="row my-2">
                            <div className="col-12">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="notes-s">Notes</InputLabel>
                                    <OutlinedInput
                                    required="required"
                                    multiline
                                    rows={3}
                                    id="notes-s"
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
                        <div className="row justify-content-center my-2">
                            <button className="btn btn-primary mt-1 w-75" type="button" onClick={() => setQuizVisible(!quizVisible)}>Relationship rating quiz</button>
                        </div>
                        <Collapse in={quizVisible} >
                            <div className="row my-4">
                                {QUIZ_QUESTIONS.map((question, index) => (
                                    <div key={index} className="col-12">
                                        <div className="mb-3">
                                            <InputLabel htmlFor={`quiz-${index}-s`}>{question}</InputLabel>
                                            <FormControl className="w-100">
                                                <OutlinedInput
                                                    id={`quiz-${index}-s`}
                                                    name={`quiz-${index}`}
                                                    label={question}
                                                    value={quizAnswers[question]}
                                                    onChange={(e) => handleQuizChange(e, question)}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Collapse>
                        <div className="row my-4 text-center">
                            <div className="col-6 mx-auto">
                                <button className="btn btn-success" type="submit">Update</button>
                            </div>
                            <div className="col-6 mx-auto">
                                <button className="btn btn-danger" onClick={handleDelete} type="button">Delete</button>
                            </div>
                        </div>
                    </Box>
                </div>
            ))}
        </Layout>
    );
}

export default ContactId;
