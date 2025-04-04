import Layout from "../components/Layout";
import axiosInstance from "../endpoints/api";
import { FormControl, InputLabel, OutlinedInput, Box, Collapse, FormControlLabel, Checkbox, Select, MenuItem } from "@mui/material";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';

function AddContact() {
    const [image, setImage] = useState("https://cdn.vectorstock.com/i/500p/95/56/user-profile-icon-avatar-or-person-vector-45089556.jpg");
    const [imageFile, setImageFile] = useState("https://cdn.vectorstock.com/i/500p/95/56/user-profile-icon-avatar-or-person-vector-45089556.jpg");
    const imageInputRef = useRef();
    const isSmallScreen = useMediaQuery({ query: '(max-width: 800px)' });
    const nav = useNavigate();
    const [consent, setConsent] = useState(false);
    const [openQuizVisible, setOpenQuizVisible] = useState(false);
    const [staticQuizVisible, setStaticQuizVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [validImageMessage, setValidImageMessage] = useState(false);
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const OPEN_QUIZ_QUESTIONS = [
        "Have they ever supported you in a meaningful way? How?",
        "How well do you click with them?",
        "What is the most meaningful interaction you've had with them?",
        "Would you feel comfortable asking them for a favor? What kind?"
    ];

    const STATIC_QUIZ_QUESTIONS = [
        "How long have you known this person?",
        "How close is your working relationship?",
        "How was this relationship established?",
        "How often do you communicate with this person?"
    ];

    const STATIC_QUIZ_OPTIONS = [
        ["1-2 years", "2-4 years", "4+ years"],
        ["Very close (weekly/monthly interactions)", "Close (talked within the last year", "Neutral", "Somewhat distant", "Distant"],
        ["Co-workers", "Met at a conference", "Mutual connection", "Online introduction"],
        ["Weekly", "Monthly", "Annually", "Rarely", "Never"]
    ];

    const ALL_QUIZ_QUESTIONS = OPEN_QUIZ_QUESTIONS.concat(STATIC_QUIZ_QUESTIONS);

    const [quizAnswers, setQuizAnswers] = useState(
        Object.fromEntries(ALL_QUIZ_QUESTIONS.map((question) => [question, ""]))
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

    const handleConsentChange = (e) => {
        setConsent(!consent);
    }

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
        const formattedQuizAnswers = Object.entries(quizAnswers)
        .filter(([question, answer]) => answer !== "")
        .map(([question, answer]) => ({
            question,
            answer
        }));

        const updatedFormData = {
            ...formData
        };

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
            const newFormData = createFormData(updatedFormData, formattedQuizAnswers, imageFile);
            await axiosInstance.post(`${BASE_URL}contacts/add`, newFormData);
            nav('/contacts/');
        } catch (error) {
            if (error.response && error.response.data) {
                 // Image validation and name validation error checker
                if (error.response.status === 400 && error.response.data) {
                    if (error.response.data.name) {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            name: error.response.data.name,
                        }));
                    }

                    if (error.response.data.image) {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            image: error.response.data.image,
                        }));
                    }
                } else {
                    setErrors(error.response.data);
                }
            } else {
                console.error("Error adding contact", error);
            }
        }
    };

    return (
        <Layout>
            {!isSmallScreen ? ( /*For desktop screen size*/
                <div className="container bg-primary-subtle rounded p-3 min-vh-100">
                    <div className="row">
                        <div className="col-5">
                            <h2>Create a new contact</h2>
                        </div>
                        <div className="dropdown col-5">
                            <button className="btn btn-primary dropdown-toggle mt-1" type="button" id="quizDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Relationship rating quiz
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="quizDropdown">
                                <li><button className="dropdown-item" onClick={() => {setOpenQuizVisible(true); setStaticQuizVisible(false);}} type="button">Open-ended</button></li>
                                <li><button className="dropdown-item" onClick={() => {setOpenQuizVisible(false); setStaticQuizVisible(true);}} type="button">Multiple choice</button></li>
                                <li><button className="dropdown-item" onClick={() => {setOpenQuizVisible(true); setStaticQuizVisible(true);}} type="button">Both</button></li>
                                <li><button className="dropdown-item" onClick={() => {setOpenQuizVisible(false); setStaticQuizVisible(false);}} type="button">No quiz</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <Box className="col-8" component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <div className="row my-4">
                                <div className="col-6">
                                    <FormControl className="w-100">
                                        <InputLabel htmlFor="name">Name</InputLabel>
                                        <OutlinedInput
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
                            <div className="row mb-2">
                                <div className="col-12">
                                    <FormControl className="w-100">
                                        <InputLabel htmlFor="notes">Notes</InputLabel>
                                        <OutlinedInput
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
                            <Collapse in={openQuizVisible} >
                                <div className="row">
                                    {OPEN_QUIZ_QUESTIONS.map((question, index) => (
                                        <div key={index} className={"col-6"}>
                                            <div className="my-2">
                                                <FormControl className="w-100" style={{ minWidth: 0 }}>
                                                    <InputLabel htmlFor={`open-quiz-${index}`} >{question}</InputLabel>
                                                    <OutlinedInput
                                                        id={`open-quiz-${index}`}
                                                        name={`open-quiz-${index}`}
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
                            <Collapse in={staticQuizVisible} >
                                <div className="row">
                                    {STATIC_QUIZ_QUESTIONS.map((question, index) => (
                                        <div key={index} className={"col-6"}>
                                            <div className="my-2">
                                                <FormControl className="w-100" style={{ minWidth: 0 }}>
                                                    <InputLabel htmlFor={`static-quiz-${index}`} >{question}</InputLabel>
                                                    <Select
                                                        id={`static-quiz-${index}`}
                                                        labelId={`static-quiz-${index}`}
                                                        label={question}
                                                        value={quizAnswers[question]}
                                                        onChange={(e) => handleQuizChange(e, question)}
                                                    >
                                                        {STATIC_QUIZ_OPTIONS[index].map((option, option_index) => (
                                                            <MenuItem key={option_index} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Collapse>
                            <FormControlLabel control={<Checkbox />} label="Consent to add this contact" required={true} checked={consent} onChange={handleConsentChange} />
                            {errors.consent && <p className="text-danger">{errors.consent}</p>}
                            <button className="btn btn-success float-end my-4" type="submit">Submit</button>
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
                                            setValidImageMessage(false);
                                            setImage(URL.createObjectURL(e.target.files[0]));
                                            setImageFile(e.target.files[0])
                                        }else {
                                            setValidImageMessage(true);
                                        }
                                    }}
                                />
                                {errors.image && <p className="text-danger">{errors.image}</p>}
                            </div>
                            {validImageMessage && <p className="text-danger text-center mt-1">Please upload a valid image file</p>}
                        </div>
                    </div>
                </div>
            ) : ( /*For laptop/phone screen (not smallest size)*/
                <div className="container bg-primary-subtle rounded p-3 min-vh-100">
                    <div className="row text-center">
                        <h2>Create a new contact</h2>
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
                                    setValidImageMessage(false);
                                    setImage(URL.createObjectURL(e.target.files[0]));
                                    setImageFile(e.target.files[0])
                                }else {
                                    setValidImageMessage(true);
                                }
                            }}
                        />
                        {errors.image && <p className="text-danger">{errors.image}</p>}
                    </div>
                    {validImageMessage && <p className="text-danger text-center mt-1">Please upload a valid image file</p>}
                    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <div className="row my-4">
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="name-s">Name</InputLabel>
                                    <OutlinedInput
                                    id="name-s"
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
                                    <InputLabel htmlFor="email-s">Email</InputLabel>
                                    <OutlinedInput
                                    id="email-s"
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
                            <div className="col-6">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="phone-s">Phone</InputLabel>
                                    <OutlinedInput
                                    id="phone-s"
                                    name="phone"
                                    placeholder="111-222-3333"
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
                                    id="job-s"
                                    name="job"
                                    placeholder="Software engineer"
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
                                    id="relationship-s"
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
                        <div className="row my-2">
                            <div className="col-12">
                                <FormControl className="w-100">
                                    <InputLabel htmlFor="notes-s">Notes</InputLabel>
                                    <OutlinedInput
                                    multiline
                                    rows={3}
                                    id="notes-s"
                                    name="notes"
                                    label="Notes"
                                    value={formData.notes}
                                    onChange={handleContactFormChange}
                                    />
                                    {errors.notes && <p className="text-danger">{errors.notes[0]}</p>}
                                </FormControl>
                            </div>
                        </div>
                        <div className="dropdown row my-2 justify-content-center">
                            <button className="btn btn-primary dropdown-toggle mt-1 w-75" type="button" id="quizDropdownSmall" data-bs-toggle="dropdown" aria-expanded="false">
                                Relationship rating quiz
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="quizDropdownSmall">
                                <li><button className="dropdown-item" onClick={() => {setOpenQuizVisible(true); setStaticQuizVisible(false);}} type="button">Open-ended</button></li>
                                <li><button className="dropdown-item" onClick={() => {setOpenQuizVisible(false); setStaticQuizVisible(true);}} type="button">Multiple choice</button></li>
                                <li><button className="dropdown-item" onClick={() => {setOpenQuizVisible(true); setStaticQuizVisible(true);}} type="button">Both</button></li>
                                <li><button className="dropdown-item" onClick={() => {setOpenQuizVisible(false); setStaticQuizVisible(false);}} type="button">No quiz</button></li>
                            </ul>
                        </div>
                        <Collapse in={openQuizVisible} >
                            <div className="row">
                                {OPEN_QUIZ_QUESTIONS.map((question, index) => (
                                    <div key={index} className={"col-12"}>
                                        <div className="my-2">
                                            <InputLabel htmlFor={`open-quiz-${index}-s`}>{question}</InputLabel>
                                            <FormControl className="w-100">
                                                <OutlinedInput
                                                    id={`open-quiz-${index}-s`}
                                                    name={`open-quiz-${index}-s`}
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
                        <Collapse in={staticQuizVisible} >
                            <div className="row">
                                {STATIC_QUIZ_QUESTIONS.map((question, index) => (
                                    <div key={index} className={"col-12"}>
                                        <div className="my-2">
                                            <InputLabel htmlFor={`static-quiz-${index}-s`}>{question}</InputLabel>
                                            <FormControl className="w-100">
                                            <Select
                                                id={`static-quiz-${index}-s`}
                                                labelId={`static-quiz-${index}-s`}
                                                label={question}
                                                value={quizAnswers[question]}
                                                onChange={(e) => handleQuizChange(e, question)}
                                            >
                                                {STATIC_QUIZ_OPTIONS[index].map((option, option_index) => (
                                                    <MenuItem key={option_index} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Collapse>
                        <FormControlLabel control={<Checkbox />} label="Consent to add contact" required={true} checked={consent} onChange={handleConsentChange} />
                        {errors.consent && <p className="text-danger">{errors.consent}</p>}
                        <button className="btn btn-success float-end my-4" type="submit">Submit</button>
                    </Box>
                </div>
            )}
        </Layout>
    );
}

export default AddContact;
