# Personal CRM / Team 3:15 AM

## Link to prototype on Figma

[https://www.figma.com/design/I9kl6N0QCoiMsL8oPgZ4lJ/Personal-CRM-Prototype?node-id=15-124&t=F7IBOAgSHrvhpCZF-1](https://www.figma.com/design/I9kl6N0QCoiMsL8oPgZ4lJ/Personal-CRM-Prototype?node-id=15-124&t=F7IBOAgSHrvhpCZF-1)

## Product Details
#### Q1: What is the product?

Personal CRM is a web application and management/data aggregation system that actively enables busy users to stay on top of maintaining relationships so they can take action and directly engage with relationships while giving them an easy way to input information and better understand their personal and professional connections.

Most busy adults suck at maintaining their relationships. Life moves fast; staying in contact and up to date on relationships is difficult—you forget about birthdays, and in the blink of an eye, it's been 6 months since you saw one of your longtime best friends or business partners. Personal CRM connects multiple platforms of contacts and data to keep up-to-date with everything on one hub. Use cases include inputting contacts/aggregating socials (LinkedIn, Whatsapp, etc.), scoring contacts, automating birthday and anniversary reminders, and AI-driven insights/analytics. The system as a whole will be mobile-first with the web app as a browser extension, but our project/MVP will focus on the web app portion with the potential for mobile app development.

As such, Personal CRM targets two core problems: the greater loneliness epidemic, and the problem of humans only being able to properly maintain less than 100 relationships at a time.

---
#### Q2: Who are your target users?

The target users are busy professionals in the age range of 22 to 45 who primarily work in the tech industry. These are people who value relationships but are too overwhelmed with the demands of their fast-paced careers to maintain the relationships that often got them where they are in the first place. Being tech-savvy young individuals they are seeking tools that automate the tedious task of keeping up with these connections as well as a way to quantify the value of relationships within their social circle. 

Persona: Busy Susan  
Susan is a 40-year-old Marketing Executive based in Berlin. She often travels to meet with many clients and partners throughout Europe. Due to having an extensive network, she struggles to maintain all these relationships as she is often on an airplane without network connection and also has to balance her main job role of creating marketing campaigns and conducting market research. Susan is highly organized and loves tools that streamline her life. She’s looking for a personal CRM that automates the tedious manual task of keeping up with the things going on in her wide circle of connections as well as a tool that assesses the quality of her relationships so she can keep on top of the relationships that matter.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdxy3egDpYwu-a6aYdJcLyZQsnm6C7areOE-rEpnT3TlnaPuC66XxxuhXO_u-LHuQHmiIwkx0cSXJr4bPYnxYGGMaMe_HhBz8CdRR4qsY-6rn5wUgdK_pB_OfprZvsypgJeoZwDzQ?key=IDnHbsF_JwSuty_r_71HsnVx)

---
#### Q3: Why would your users choose your product? What are they using today to solve their problem/need?

Users would choose our product because it simplifies the process of tracking relationships with others across different apps by acting as a centralized hub of information. It provides automated reminders and scheduling to track relationships within a simple and intuitive UI. Other personal CRM services today do not provide enough integration or simplicity, so our product exists to solve that need. 

The benefits of our product include time-saving, discovering new insights and increasing outreach efficiency. By having everything centralized to one platform, users can reduce time searching through several apps. It also makes contacting those who you are less familiar with quicker and easier. Instead of a cold outreach, you can reach out to your mutual connections for help based on the strength of their connections which increases efficiency and time. The CRM also plans to include additional information such as birthdays, anniversaries, and other milestones that can be seen across all apps.

---
#### Q4: What are the user stories that make up the Minumum Viable Product (MVP)?

Our partner gave us approval for the following user stories through the form of a live Q&A document. This is where we asked what user stories the MVP should have and he gave us a list to use: [https://docs.google.com/document/d/1xaU61YvkZRlfcYB_95nwnXfTGu-DjYqWfkrKD8cHgRk/edit?usp=sharing](https://docs.google.com/document/d/1xaU61YvkZRlfcYB_95nwnXfTGu-DjYqWfkrKD8cHgRk/edit?usp=sharing) 

He also created a nice video of him walking through the document: [https://www.loom.com/share/d287baf818964f56a2b58b53b19e0835](https://www.loom.com/share/d287baf818964f56a2b58b53b19e0835) 

1. As a user I want to be reminded that I haven't communicated with someone for a while.
    
2. As a user, I want to be able to easily action follow-ups or outstanding items and set due dates - that means I should be able to tap one button and the message sends.
    
3. As a user, I want to be able to capture information simply. I want to be prompted to help me understand my relationship, without having to remember specific information or input it directly (Example: scoring system, swipeable "yes/no" questions). Example: "Do you know Marc's favourite colour? --> Yes/No --> If yes, ask what it is. If no, move to the next question."
    
4. As a user, I want to see a prioritized list of people I should follow up with based on relationship strength or recent activity so I can manage my time efficiently.
    
5. As a user, I want to customize how and when reminders are sent (email, push notification, in-app alert) so I can manage notifications in a way that works for me.
    
6. As a user, I want to tag and categorize my contacts (e.g., ‘Work’, ‘Family’, ‘Friends’) so I can quickly filter and prioritize communication.
    
7. As a user, I want to sync my reminders and milestones with my calendar so I can see all my tasks in one place.
    
8. As a user, I want to automatically log my communication history (calls, emails, meetings) so I can easily track the progress of my relationships.

---
#### Q5: Have you decided on how you will build it? Share what you know now or tell us the options you are considering.

The architecture of the Personal CRM application will follow a client-server model, leveraging scalable and modular design principles. 

The technology stack currently includes:
- Frontend: We will use React.js to create a responsive and user-friendly UI.
- Backend: For API handling and data processing, we are considering Node.js with Express for its asynchronous capabilities or Python with Flask for its scalability.
- Database: PostgreSQL will serve as our relational database for storing and managing contact information and analytics data.
- AI Integration: The OpenAI API will be used for generating message suggestions
- Notification Service: Cron jobs will handle scheduling reminders for birthdays 

Deployment Plan: 
- The application will be deployed using AWS. Specifically- AWS Elastic Beanstalk for deploying the web application & AWS RDS for hosting the PostgreSQL database.

Third-Party Applications/APIs:
- OpenAI API: For AI-driven message suggestions. 
- Social Media APIs: To aggregate contacts from LinkedIn and sync data across platforms.

## Intellectual Property Confidentiality Agreement 

We have agreed on option #2 - You can upload the code to GitHub or other similar publicly available domains. He owns the actual project but the code we worked on is on a private github repository in the CSC301 classroom.

## Teamwork Details

#### Q6: Have you met with your team?

We met and did a team-building activity, and we have a form of communication through Discord. We played one of the built-in Discord games, Gartic Phone. While we did that in the background we talked to each other and got to know each other.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeQwc6LzsEnf0rVsJ2QRWWTakb2-K-DyKZMOE6kvZDVl5FZiAD0vrppgayBaOlUF_PcipgtLwE0hEKcF4Rgh4KpF7zLB79Kk7989lfq8PVxWIB8RS_d7Q-WCCgaglcCefLjc6-9-w?key=IDnHbsF_JwSuty_r_71HsnVx)

- Fun facts: 
	- Supriya plays flag football
	- Lisa has a chihuahua
	- Harvir likes to sleep
	- Idris has a lifeguarding certification

---
#### Q7: What are the roles & responsibilities on the team?

The CSV document is in the GitHub repo. The roles and experiences are listed beside each member: 

Idris - Backend Developer & Cloud Developer. Experience working with the backend from CSC309 and CSC409. I also am familiar with SQL from CSC343. From internship experiences, I have worked with SDLC and agile methodologies along with making/updating CI/CD pipelines. I also have worked with AWS during internships and in class as well.

James - Frontend Developer & Backend Developer & Scrum Master. Some experience with frontend and backend from CSC309, and interested in using React. Chosen for the role of scrum master because likes to keep people on track and organized.

Supriya - Backend Developer & Frontend Developer & Prototyping & Notetaking. Experience with frontend and backend from CSC309. I also learned a bit of JavaScript on my own. Experience working with Figma from CSC318. I enjoy being organized and keeping track of what is being said during meetings, so I signed up to be a notetaker for the team.

Arifa - Frontend Developer & Backend Developer & AI & Notetaking. Experience with frontend and backend from CSC309. Experience with NLP from CSC485 and CSC311. I want to take organized and clear notes to keep track of our meetings. 

Lisa - Backend Developer & DevOps & Project Manager. Experience with Postgres and databases from CSC343. Internship experience with DevOps/integration tools and quality assurance (unit testing). Experience working in SDLC (AGILE) and project management workflow from internship. OOP and design skills from CSC207.

Humraj - Backend Developer & Databases & Team Manager & Partner Liaison: Internship experience with using Databases as well as CSC343 course experience. Have taken CSC309 and CSC207 which has exposed me to writing backend systems with Django and Java Spring Boot. I have also taken a leadership role within my team for the CSC309 course project.

Harvir - Backend Developer & Databases & Prototyping.  Course experience with Database Systems from CSC343 and CSC443 (Includes a project associated with building an efficient LSM database). Course Experience with Backend development using Django in CSC309. I also have experience prototyping using Figma in CSC318 (Also taking CSC428). Looking forward to improving further on the fields I’m interested and experienced in.

---
#### Q8: How will you work as a team?

After our tutorial meeting with Omid on Tuesdays at 8:15 PM, we will have a mandatory scrum meeting in our Discord Server. This is where we will discuss what we have done the previous week if we haven’t already as well as discuss any suggestions given by Omid during the tutorials. This is also where we will create actionable tasks for every team member to work on for the next week. Our teams also agreed on meeting over Discord on Thursdays at 7 PM for a middle of the week check-in if needed. We have set up a recurring Zoom meeting with our partner on Thursdays at 12 PM where we will present our progress to our partner and clear up any questions we have. For code reviews and sessions, it will be on an ad hoc basis depending on if additional clarity is needed for pull requests. We had our first meeting with our partner on January 22nd at 12PM to discuss project expectations and ideas. We have scheduled a follow-up meeting to go over our deliverable on Monday at 9:30 AM. 

---
#### Q9: How will you organize your team?

Our group's main organization method is through Notion. This is where we keep track of all links, deadlines and resources related to the project. These are things such as meeting minutes for all of our meetings and To-Do list items to assign each of our team member’s tasks. Notion has a nice Kanban board functionality that allows us to set task status in terms of what is in the backlog, what should be done, what is in progress and what is completed. We prioritize tasks based on deadlines and how important they are in terms of course assignments and MVP. For course assignment-related tasks we split questions up evenly throughout the teams but for more tech-specific related items we will assign tasks to whoever is qualified for the role. Additionally, we use Discord for communication. This is where we can talk about ideas. We also ping each other to notify individuals of task deadlines and if anything is incomplete. GitHub is where our source code resides.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcW5f4oabMFRNBWrcPIvofo_qdS2uLFTEh4hCMSZzJqWKR-q4WFfWbWqs8hLlrJ7VcTC0MuAyLRMcBbaxf_R3kIarS16DWBNE8rqnAzCgOW0gydIn2grlcFxJ4YnO5KkWmK1FCIKA?key=IDnHbsF_JwSuty_r_71HsnVx)

---
#### Q10: What are the rules regarding how your team works?

Team meetings without the partner will be held once a week through our Discord server. We will be using Discord for all forms of communication and reminders. We also have a teamspace on Notion which we will be using to keep track of meeting minutes, todo lists and scheduling meetings. The teamspace has also been shared with our partner. As mentioned above, we will keep track of meeting minutes which will track participants at meetings to keep everyone accountable. The todo list will keep everyone on top of action items. It also allows us to assign tasks to our members to ensure that someone is responsible for it. We have assigned Humraj as our group leader. A part of his role is to ensure that everyone stays on track with their assigned tasks.  To communicate with our partner we will be using email per his request. We will be meeting with him weekly through Zoom with an optional in-person meeting monthly.

To prevent a lack of responsiveness or contribution, we have asked that all members communicate in advance with the team if they have circumstances that will prevent them from completing work. In the case where members are unresponsive, we will try to reach out to them through Discord and other means and see what we can do to create a better team environment for them. If they continue to be unresponsive, we will reach out to the TA for assistance.

Question from A1:  
How can your team members tell if you have disengaged from the project (i.e., not contribute to the project or do your best)? How should your teammates bring it up if that happens? (e.g., talk to me 1-1. Slack me directly. Give me a heads up a week before. Set deadlines and make me commit to them, ask the TA to let me know, etc.)

Harvir - Team members can tell I have disengaged if I am disconnected from group discussions, i.e. not responding quickly. Being direct, setting deadlines and communicating openly is the best way to bring it up if that happens. 

Lisa - I will communicate to my team members ahead of time if I've "disengaged from the project"; whether it be due to personal reasons, health reasons or anything else. If the work I'm putting in is not up to standards, I'd like my teammates to let me know whether it be 1 on 1 or in a team meeting. We should already have deadlines and we should all be making commitments to those, but if I'm disengaged and need accountability it would be great if they could give me a heads up via whatever communication method and set hard deadlines for me to meet.

James - My team members could tell that I am disengaged if I do not respond quickly to messages about what needs to be done or I don't do my required work by its due date without any message discussing a situation I didn't account for or what I might need help with. In such a case, my teammates should confront me about it directly and see if there is something going on, and figure out other deadlines or ways to split up or help me with my work if I'm struggling to the point of not being able to get my portion done.

Arifa - If I were to disengage from the project, I would have reduced participation in discussions or extra tasks beyond my core responsibilities. I encourage my teammates to address it directly with me through a conversation or a message on Discord.

Humraj - If I have disengaged from the project my teammates will notice that I have become very inconsistent when responding to text messages. If this happens then my teammates should try to set deadlines and come up with plans on how tasks should be completed. Additionally, my team should try to book 1-1 Zoom/Discord meetings to try to get me back on track and get me up to speed with what I have missed.

## Organisation Details

#### Q11. How does your team fit within the overall team organisation of the partner?

Our partner is building this platform with more than just what we are doing. He has made it so that the section that we are working on, the personal relationship manager, is not dependent or connected to any of his team's work or the other team from the class that is working with him as well. Our team will take on the role of developers for a section of his bigger platform project. We will be developing the features needed for that portion such as messaging, notifications and integration with other platforms and more. 

We are fit for this role because we can work on a fully self-enclosed project within a greater scale project so we don't have any effect on another part of his project if something goes badly. And if we do well, then this portion can be slotted into its place in the project easily through API integration. It also only uses technology that we are experienced in or interested in learning rather than the broader range of tools and skills needed to create the whole project or to collaborate on other parts of the project where we would need to read and understand the work their team has done with those other tools we would not have experience with.

---
#### Q12. How does your project fit within the overall product from the partner?

The project that we are working on is a web extension of the actual mobile-friendly CRM manager application. Based on our implementation/MVP, it can be converted into a mobile application later on. But in our case, we are just responsible for making the web version. Our MVP is the first prototype for the web version of the application, where we will build both the core front and back-end features. Also, our partner’s vision is to integrate two separate platforms into one later down the line. The products will consist of our Personal CRM applications and another more social media-like product.

## Potential Risks

#### Q13. What are some potential risks to your project?

Potential Project Risks:
- Difficulty in aggregating data from contacts across different apps
	- The project requires taking contact information and aggregating data associated with them from various different sources and API’s. It requires parsing all API’s and storing them in a centralized system.
- Brainstorming an intuitive UI that requires minimum input from scratch 
	- Other Personal CRM’s fail because their UI is difficult to understand or require too much input from the user. An intuitive and Simple UI must be built for the Personal CRM to be successful.
- Balancing MVP Scope to produce realistic Deliverables 
	- Must focus on tasks within MVP scope to produce Deliverables on time to produce a functional product that can be further improved and iterated upon.

---
#### Q14. What are some potential mitigation strategies for the risks you identified?

1. Begin by integrating a small subset of the APIs (e.g. LinkedIn) to simplify development and validate our process before scaling up. Furthermore, we will use API frameworks to streamline the process and plan for regular testing + debugging. 
2. Research successful CRMs to adapt proven UI design practices. Also, we plan to create a detailed user-centred prototype to focus on the design early in the process. 
3. Break down the MVP into smaller, achievable goals and prioritize essential features first. Communicate regularly with partners to align on deliverables and manage expectations.

---
