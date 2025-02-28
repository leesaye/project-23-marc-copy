### **Deliverable breakdown**

#### **Part 1 – Planning:** 

1. **Identifying the problem/improvement**
   * **Define the problem you are solving.**                                                                                      
The Problem we are solving is the issue of prioritizing tasks and events that occur within a user's circle. Our feed user story involves highlighting all the upcoming tasks and events going on into one easy to comprehend “Feed Page”. This page will show all events that are coming up and organize these events by what would be the highest priority for the user to accomplish first.

   * **Explain how the AI component enhances your project (e.g., automation, decision-making, prediction, personalization, etc.).** 
     The use of AI will enhance the decision-making process for the user. AI is used to read all upcoming tasks/events and generate priority for each of these tasks. It will then consolidate all this information and give the user an order in which to complete these tasks.  
     
     For example, let’s say the user has three events: Go to Blue Jays game with Jeff (Event), Wish George a Happy Birthday (Task), Connect with Judy about a project she recently posted on LinkedIn (Task). The AI model will compare these events/tasks and build an order in which the user should complete these tasks based on a priority it has generated. Then it will output a simple message on how to handle these tasks. For example, “You have three upcoming events. We suggest you Wish George a Happy Birthday as his birthday is today. Then you should take a look at Judy’s LinkedIn Project and see if there is an interesting topic for you to connect on. Finally you should make sure to find a baseball cap to prepare for the Blue Jays game with Jeff tomorrow.”

2. **Criteria, Research, Selection**  
   * **Identify the criteria for your choice.** 
** Model must be able to take in our Event and Task objects
		   * Each object has a data associated with which our model should be able to take into account
** Model must be able to understand the type of event based on the title
		- Events have set dates on which they will occur and they cannot be done before that date.
		- Tasks must be done before their deadline.
		- AI must be able to understand the title of the event/task and generate predictions on the priority of the task.
			- Happy Birthdays have a single day in which the task must be completed whereas reaching out to someone to talk about a project can be done any day before a deadline.
	- Model must be able to prioritize events based on the Contact associated with the event.
		- The model must take into account the relationship rating between the user and their contact. If Judy has a low relationship score then tasks involving her will have lower priority. 
		- Contact’s occupations matter. A contacts boss may have events with higher priority than a contact’s close friend as it may be easier to reschedule events with close friends compared to events with a user’s boss.
	- The Model must be able to create coherent and concise sentences that action the user to complete tasks/events in a specific order.

   * **Identify potential AI models, frameworks, and libraries suitable for your goal.** 
	   * ChatGPT API (or any type of pre-trained model available such as google gemini)
	   * Scikit-learn (Untrained Model, Locally running and deployed models)

   * **Compare alternatives and justify your choices based on:**   
     * **Feasibility (e.g., dataset availability, model complexity)** 
	     * ChatGPT API
		     * Pro: no need to train a model making it very feasible to integrate into our project
		     * Pro: Great for easy to use NLP task required to read titles and output sentences to action users
		     * Con: ChatGPT Tokens are a paid Service with limited Free Tier 
		 * Scikit-Learn
			 * Pro: Perfect for decision making based on a given structure (Input/Output)
			 * Con: Model needs to be trained
			 * Con: Little to no online datasets available that map tasks to a priority. Not much on Kaggle.
			 * Con: Not Good for NLP tasks.
     * **Performance (e.g., speed, accuracy, resource efficiency)** 
	     * ChatGPT API
		     * Accuracy may be a concern as prioritization is subjective based on a user’s current circumstances and opinion. For example, going to a Blue Jay’s Game with Jeff may have higher priority if the User has already skipped out on events with Jeff multiple times prior.
		     * If a user has many events/tasks/contacts, compute time will drastically decline. Fast compute time is essential for something like a Feed page as constant updates are made.
		     * High resource efficiency as OpenAI servers are used and no resources or additional overhead is required to store data locally or on our own remote server
		 * Scikit-Learn
			 * Slow speed when training model. High speed when computing priority as model is specifically trained for the specialized task of accessing priority for tasks
			 * Low accuracy as existing datasets are scarce.
			 * Low resource efficiency as models need to be trained locally or on our own remote servers and data storage must be provided by us.
     * **How to integrate with your existing tech stack**
	     * Django Backend requests can make a ChatGPT API request using python.
	     * Scikit-Learn is python based which will integrate nicely with our Django backend as it is also written in python.
 * *If your goal involves model training/testing, outline any datasets required.**
	 * If Scikit-Learn is chosen, model training and testing is required. 
		 * User Task/Event Dataset required. Must be custom build as there are not a lot of dataset like this out there
			 * Must include task/event types
			 * Deadlines
			 * Relationships 
			 * Priority labels
		 * Models like ChatGPT do not need to be trained and therefore do not require datasets

   * **Discuss if you need to develop data preprocessing, bias mitigation and ethical consideration strategies.**  
	   * Data Preprocessing is required if Scikit-Learn is chosen as we must create our own dataset and create events and tasks with the required attributes. This means we need to sift through existing datasets and add appropriate information to train our model as no dataset online has all this information.
	   * Bias Mitigation: allowing users to reset and suggest metrics for the AI to consider when ranking prioritization can help mitigate bias
	   * Privacy: Allowing users to opt-out of this feature should be an option, in case they have concerns allowing AI to parse their relationship data
	   * Transparency: All users to see insights into why certain tasks were prioritized

   * **Justify why this feature is necessary and how it aligns with the project’s goals.**   
    This feature is necessary because the overarching goal of the Personal CRM is to keep track of and maintain relationships with others with minimal input from the user. An AI-driven algorithm to prioritize tasks and events relieves the mental burden to keep track of relationship-oriented tasks and events. It allows users to maintain and improve the strength of their relationships by focusing on the most important tasks and events and customize them to their needs.

#### **Part 2 – Impact Analysis:** 

The final step is to analyze the impact of the improvement on the performance of the product. Your report should include details on: 

* **How the product or process will get improved before and with AI integration.**  
	* Before AI Integration, the process of task and event prioritization can be improved by having the user manually create tags relating to certain event types. This allows the system to use this information to search for tag keywords to make more urgent tasks and events that contain said tags appear earlier in their feed.
	* After AI Integration, we can use a variety of metrics to fine-tune more accurate prioritization. AI can analyze the nature of the task/event itself to determine urgency (ex. Saying “Happy Birthday” vs “Attending a Wedding”), leverage relationship rating strength to determine how close the contact is to increase or decrease prioritization, and use past history to maintain relationship strength.

* **Explain how the improvement can be tested (e.g., unit tests, accuracy evaluation, A/B testing).** 
	* Unit Tests can be conducted to make sure the system actually produces a prioritization scheme, even in the absence of data, and applying a failsafe algorithm in case the AI were to produce problematic results.
	* Accuracy evaluation can be added by allowing users to rate prioritization lists or query the AI behind our system to consider other metrics more or less to produce more accurate results.
	* A/B testing can be employed similar to how ChatGPT applies A/B testing by generating different priority lists and allowing the user to choose one they prefer and using that information to alter prioritization metrics.

* **Discuss trade-offs (e.g., increased latency, resource consumption, user experience improvements).**  
	* Latency trade-offs between Locally trained models and API models:
		* ChatGPT API can reduce this latency but with an extra paid cost
		* Locally trained and deployed models may reduce external requests but require a lot of computational power and resources
		* Introducing AI in general into our algorithm may increase latency in feed updates by taking time to process data, and will consume more resources as it requires more computational power
	* Resource Consumption trade-offs between Locally trained models and API models::
		* All AI models require a lot of processing power
		* Locally running models avoid the API cost, but use local resources.
		* Local resources may also have their own additional cost which means in some cases API costs may be cheaper.
	* User experience trade offs between AI and no AI solutions
		* AI prioritization allows a more personalized and easy to use task management experience
		* AI allows for minimal cognitive effort as users have tasks automatically ordered for them
		* A downside of using AI is that there may be potential risks in misinterpretation of data and outputting incorrect priority ranking causing users to miss deadlines and events. In this case, it may be better to introduce a simple algorithm for computing priorities instead to ensure reproducibility and reliability
