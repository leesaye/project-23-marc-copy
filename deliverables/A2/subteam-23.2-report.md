### **Deliverable breakdown**

#### **Part 1 – Planning:** 

1. **Identifying the problem/improvement**  
   * **Define the problem you are solving.**
   
     Our website needs to calculate a relationship score between the user and the contact they are adding when adding manually or editing through a few questions in a relationship quiz. However, we want these questions to be open-ended rather than yes/no questions such that the user can explain what they think about the person with more detail and get a more accurate score. But because the questions are open-ended, so the user just types their answer into the box, there is no standardized way of grading their answer and returning a relationship score with just code.  
   * **Explain how the AI component enhances your project (e.g., automation, decision-making, prediction, personalization, etc.).**
   
     The AI would automate the process of giving a relationship score by making a decision about their relationship score from 0-100 based on the explanation given by the user. It would allow for personalization and more complex relationships to be accurately turned into a value that can be used to represent the relationship between the user and their contact for each contact uniquely.  
2. **Criteria, Research, Selection**  
   * **Identify the criteria for your choice.**  
   
     The AI would need to be able to take a post request with the information inputted by the user and return a response configured in a way that can be parsed for a number from 0-100, and this must be able to be done for free at any time.  
   * **Identify potential AI models, frameworks, and libraries suitable for your goal.**  
   
     Potential AI models that fit this are: OpenAI GPT (free tier that has some API usage limits), Microsoft Azure OpenAI, Cohere (generous free tier).
   * **Compare alternatives and justify your choices based on:**   
     * **Feasibility (e.g., dataset availability, model complexity)**  
     * **Performance (e.g., speed, accuracy, resource efficiency)**  
     * **How to integrate with your existing tech stack** 

       While Cohere does have more generous usage limits, our partner has mentioned the use of OpenAI and ChatGPT, and its API limits are well above what we need for a course project in the free tier. Each of them have similar performance and integrate easily into our tech stack, but OpenAPI GPT seems like the best fit.

   * **If your goal involves model training/testing, outline any datasets required.**  
   
     None, it just needs initial guidelines or configuration to create output that consistently gives a score from 0-100 based on the information given.
     As an extra—but not the focus of our application as a whole—if we want our model to be very accurate and specific to relationship assessment, training the model on datasets relating to human relationships, relationship science, or interpersonal psychology would aid in providing better outputs and assessments.  
   * **Discuss if you need to develop data preprocessing, bias mitigation and ethical consideration strategies.**  
   
     The use case is for manually added contacts where the user is expected to have a relationship with the contact that they can explain and can be viewed objectively by the API, so we would not need to develop much preprocessing or bias mitigation. 
     Some data preprocessing would be nice to filter for correct/relevant user input—and especially important if they input anything prejudiced or hateful. We should be able to detect abuse and handle it—the AI API will have restrictions on this, and prevent inappropriate inputs.
     Outlining terms of use is important. Ethics might be involved regarding privacy and what the user discloses about the relationship to the AI—if they mention personal information about a certain contact or revealing/private data of the contact without consent, that would be problematic. We may need to consider adding clauses to a Terms of Use agreement for the application as a whole, and specifically regarding AI.   
   * **Justify why this feature is necessary and how it aligns with the project’s goals.**   
   
     Our partner's goal for the project was to include a relationship score like this through either AI or through a very detailed quiz with questions he would come up with. However, he agreed that the quiz would be difficult to properly implement and would be too rigid because of the need to create a scoring system, so he thought an AI feature here would be perfect. This feature is not technically necessary but is very helpful as without it the relationship score would be either very difficult to accurately create, or too simple.

#### **Part 2 – Impact Analysis:** 

* **How the product or process will get improved before and with AI integration.**  

  Prior to AI integration, relationship rating calculations would have to be calculated manually—entailing the use of hard-coded value attributions for certain questions, and limiting our quiz to closed-ended multiple choice or yes/no answers. This is inflexible, scales badly, and primitive; it can be inaccurate, and requires extraneous/duplicate work every time we want to add a question. With AI integration and AI generated relationship scores, this expedites the process of adding questions, enables open ended quiz formats, more accurate assessments (via natural language processing and with dataset training, the AI can take more than just keywords into consideration) and could allow us to extend the relationship quiz feature to include not just AI generated rating assessments, but AI generated relationship questions as well. Overall, the product will become more flexible and allow for open ended questions, dynamic weighing for questions, and more accurate relationship rating calculations. Our development process will also be less repetitive, more streamlined, and the relationship assessment use case will be more scalable.  
* **Explain how the improvement can be tested (e.g., unit tests, accuracy evaluation, A/B testing).**  

  We can use unit tests to test that AI output for relationship ratings are between 0 and 100\. We can also generate dummy answers and run them as accuracy evaluations, or repeatedly run them to check that the AI is consistent. For example, a unit test for the question “How close am I to this contact?” with the answer “I am very close to this contact” that checks for an output score greater than 50 can ensure that the AI is being accurate. It will be hard to ensure the AI is consistent every time, but adding accuracy evaluations as unit tests as “sanity” checks on the model will help reduce errors. We can also use A/B testing to manually compare the scores with AI and without AI for the same set of questions and answers and assess which one performs better.  
* **Discuss trade-offs (e.g., increased latency, resource consumption, user experience improvements).**  

  One trade off of LLM APIs as opposed to locally performing calculations or using an algorithm is increased latency, since we will need to send and receive requests to OpenAI or Cohere, for example. Additionally, if their servers go down or have issues, our relationship rating service will also go down. Another trade off is reliability—there’s a risk of getting garbage ratings or values that are outside the 0 \- 100 scope with AI usage. Using AI also involves writing up more clauses in our Terms of Use and application usage agreements to prevent and handle malicious input. Cohere and ChatGPT all have decent performance, and we would be outsourcing that resource consumption to those AI provider companies, so there are no tradeoffs in that sense. Overall, there are some tradeoffs, but most of them can be mitigated (via error checks and service agreement write ups), or they are sporadic issues and would not impact user experience much.
