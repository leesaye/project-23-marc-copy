### **Deliverable breakdown**

#### **Part 1 – Planning:** 

1. **Identifying the problem/improvement**  
   * Define the problem you are solving.

Currently, users can create and view tasks on their calendars, like “Wish Marc a Happy Birthday,” but they still have to come up with a message and manually send it. This extra step can be inconvenient and time-consuming for users with many contacts. Because of this, they might forget to send the message altogether, leading to missed opportunities to maintain and strengthen their connections, one of the main goals defined by our partner for the project (Personal CRM). While our calendar feature helps users remember important dates, it doesn't assist them in actually completing the tasks. This can create friction in the process of crafting the messages. Additionally, there is no built-in way to quickly send these messages directly from our website. 

Ex: Task- Wish Marc a “Happy Birthday” \-\> button to generate the message 

AI generates-   
“Happy Birthday Marc\!\! 🎉🎂 Wishing you a fantastic day filled with joy, laughter, and all the things that make you happiest. Here's to another amazing year ahead\! 🥳🎈”

The user has to option to edit the message and send the message on LinkedIn, messages, etc 

* Explain how the AI component enhances your project (e.g., automation, decision-making, prediction, personalization, etc.). 

We are integrating an AI-powered message generator to hopefully make communication more effortless. Here’s how AI would enhance our project:

- Automation: AI will instantly generate a personalized message for any task that involves communication.  
- Personalization: The AI will use the contact’s name and occasion (e.g., birthday, anniversary, professional milestone) to create the message.   
- Efficiency: Users can generate a message with one click, removing the time and effort needed to write one manually. After generating the message, users will have options to send it directly through LinkedIn, email, or SMS, streamlining the entire process.  
*   
2. **Criteria, Research, Selection**  
   * Identify the criteria for your choice.

First, the AI model must be able to take in our task objects and determine whether a message is required. Tasks can vary in nature—some involve communication (e.g., "Wish Marc a Happy Birthday"), while others are action-based (e.g., "Submit report by Friday"). The AI should be able to distinguish between these types and only focus on tasks that require message generation. If a task does not require a message, the website will inform the user “This task does not seem to require a message. Do you still wish to generate one?”

Second, message generation is user-initiated. The AI will not automatically create messages for every task. Instead, when viewing a task, the user will have the option to click "Create Message", at which point the AI will analyze the task title and generate a relevant message suggestion. The user can then review and edit the message before sending it via LinkedIn, messages, or another platform.

Lastly, the AI-generated message must be contextually relevant to the task. The message generation should not slow down the user experience and seamlessly integrate into our current calendar implementation without much overhaul. 

* Identify potential AI models, frameworks, and libraries suitable for your goal.

OpenAI API:

- Pre-trained on a vast dataset, capable of generating high-quality, natural-sounding messages  
- No need for fine-tuning or dataset preparation, making integration quick and easy  
- Can be easily integrated with our Django \+ React tech stack  
- API-based, meaning there is a dependency on external service availability  
- Has a free-tier 

Google PaLM API:

- Strong language generation capabilities, comparable to GPT-4  
- Good for contextual understanding and message personalization  
- Already using Google API for Calendar feature  
- API access and pricing may not be as flexible or developer-friendly

T5 (Hugging Face Spaces):

- Open-source and can be fine-tuned on specific datasets if needed  
- Cost-effective in the long run since it avoids API usage fees  
- Requires additional setup, fine-tuning, and hosting, increasing development complexity

Compare alternatives and justify your choices based on: 

* Feasibility (e.g., dataset availability, model complexity)  
  * Performance (e.g., speed, accuracy, resource efficiency)  
    * How to integrate with your existing tech stack 

We chose OpenAI’s API for generating task-related messages because it already provides a pre-trained model that can complete this task. Since GPT-4 already understands natural language relatively well, it can quickly analyze task titles and generate meaningful messages without requiring a large dataset or additional fine-tuning. Other alternatives, like Hugging Face’s models, would increase the complexity and development time. Furthermore, OpenAI's free tier will allow us to integrate the AI model without upfront costs. This will be useful for testing and refining the feature before committing to a paid plan. 

Since OpenAI is also already being considered for other features in our project, i.e in the contacts use case, this choice keeps our implementation consistent while ensuring that we don’t need to maintain additional infrastructure for hosting a separate AI model. From an integration standpoint, OpenAI’s API can work with our Django \+ React tech stack. The backend can send a request to OpenAI, process the generated message, and return it to the frontend. This makes it easy for users to click “Create Message” on a task and instantly receive a suggestion. 

* If your goal involves model training/testing, outline any datasets required.

Since we are using OpenAI’s API, we do not need to train our own model or collect a dataset.

* Discuss if you need to develop data preprocessing, bias mitigation and ethical consideration strategies.

Data preprocessing would be minimal for this implementation, we can still ensure that task titles are clean and well-structured before sending them to the AI. If a title is vague or contains unnecessary information, the AI might generate an incorrect or irrelevant message. 

Bias mitigation is primarily handled through user review. Since AI models can sometimes reflect biases in their training data, instead of fully automating message generation, we can ensure that users have control over the final message before sending it. Ethical considerations include user privacy by ensuring that sensitive or personal information is not unintentionally shared in generated messages.

* Justify why this feature is necessary and how it aligns with the project’s goals. 

Our project is a personal CRM that helps users manage their relationships. One of our partners' goals was to implement message automation. This feature is essential because it makes task completion easier by reducing the effort required to draft messages. With AI-generated message suggestions, users can quickly act on tasks like sending birthday wishes or following up on conversations. By integrating this feature, we align with our partner’s goal of making the personal CRM more intuitive and ensuring that no important interactions are missed. 

**Part 2 – Impact Analysis:** 

The final step is to analyze the impact of the improvement on the performance of the product. Your report should include details on: 

* How the product or process will get improved before and with AI integration.

Before AI integration: We will need to update tasks to include a “create message” button that would redirect users to another user’s messaging platform. As mentioned above, this would still require users to come up with their own message, which can be time-consuming. Additionally, there is no built-in functionality to quickly send messages from within the platform, requiring extra steps.

After AI integration: With AI, message creation becomes automated and effortless. Users can generate a personalized message with one click, reducing their workload. The direct integration with messaging platforms would streamline the process, ensuring users complete their tasks more efficiently. This improvement will enhance user engagement and help maintain relationships more effectively.

* Explain how the improvement can be tested (e.g., unit tests, accuracy evaluation, A/B testing).

A/B Testing: Since we will also allow users to send manual messages, we can compare how frequently users choose to send their own message versus the automated message.

Unit Testing & Functionality Testing: Ensure the “create message” button properly triggers AI message generation. Verify that AI-generated messages are related to the task title. Confirm seamless integration with messaging platforms (i.e. LinkedIn)

* Discuss trade-offs (e.g., increased latency, resource consumption, user experience improvements).

Latency vs. Convenience:

- Automated messages will introduce a slight delay in response time with the call to OpenAI, however this is outweighed by the efficiency gain in removing the need for manual messages  
- To optimize the response time we could use strategies such as pre-fetching common responses

Automation vs. Personalization:

- AI-generated messages could lead to generic or impersonal messages, reducing authenticity  
- Allowing user edits before sending mitigates this risk, maintaining a balance between automation and human touch.

Infrastructure vs. Integration:

- OpenAI’s API integrates well with Django \+ React, but reliance on an external API introduces a dependency.  
- If OpenAI’s service is unavailable, the system should fall back gracefully (i.e. default message templates)