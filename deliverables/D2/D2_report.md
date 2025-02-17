# Project Planning:

## Web App Link: [https://personalcrm.netlify.app/](https://personalcrm.netlify.app/) 

Walkthrough Video: [https://drive.google.com/file/d/1AE1FqYCjQAl-VvuZVgFaiwOJPLMCc7xf/view?usp=drive\_link](https://drive.google.com/file/d/1AE1FqYCjQAl-VvuZVgFaiwOJPLMCc7xf/view?usp=drive_link)

## 1\. Reviewing core requirements:

We will be doing a web application. Our application will be responsive, and it will be easily able to be deployed, added to and maintained by the nature of React's features. Our web application will have a login, a home page, a feed, reminders, a calendar integrated with Google Calendars and the ability to search for people, reminders and events. We will have unit tests as outlined in our plan in question 3 for the backend and database information that needs to be tested. Our backend will be converted from using SQLite locally to PostgreSQL and deployed through Render. Our Frontend will be deployed using Netlify.app.

## 2\. Mapping user stories to a product plan:

The logical flow of our user stories is in the following google sheets:  
[https://docs.google.com/spreadsheets/d/1Bsi5X7VVEMHT99LbBXt3Jwlmnn8wz7KIjlRux2i\_tGM/edit?gid=0\#gid=0](https://docs.google.com/spreadsheets/d/1Bsi5X7VVEMHT99LbBXt3Jwlmnn8wz7KIjlRux2i_tGM/edit?gid=0#gid=0)

## 3\. Establishing a technical framework:

Front end tech: React.js or Vue and Tailwind or Bootstrap  
Back end tech: Node.js or Django or Python  
Deployment: Vercel or Github Pages and AWS with Docker or Render  
Database: SQLite (for D2) and PostgreSQL (for MVP) or mySQL or MongoDB

Comparisons:

- Our team wants to work with / has experience with React, plus Marc planned for React, so we will use React. Either Tailwind or Bootstrap could be used depending on the visual scheme decided on.  
- Our team has more experience with Django and we think it would be too time consuming to learn Node.js, so we will use Django.  
- Some of our team has experience with Vercel and it is more versatile / more useful than Github Pages, so we will go with Vercel for the frontend. The backend will be hosted using Render.  
- Most of our team has experience with SQLite (with Django) and PostgreSQL, so we will do those two (SQLite for initial local debugging and Postgres for deployment. Also, Render, which is the platform we are going to use for backend deployment, makes it really easy to start a PostgreSQL database.

Final Decision:

- React.js and Bootstrap for frontend  
- Django for Backend  
- SQLite for local debugging and PostgreSQL for deployment  
- Netlify.app for deploying the frontend  
- Render for deploying the backend and PostgreSQL database.


Testing plan (Django Unittest for backend and Jest for frontend)

* **Unit testing**  
  * Testing source code (aim for high line coverage percentage)  
  * Automated test cases that can compile and run easily (so testing the code is as fast as possible)  
* **Functional testing**  
  * Automated test cases  
    * Want to cover all core use cases and corner cases  
  * User testing (get people to test the app manually)  
* Note: we should **integrate these tests** into Github Actions **to run functional/unit tests with every pull request** (ensures that we don’t break a feature/break the main branch whenever we do merging)  
  * If we don’t use Github Actions (or something like that), then we need to make sure everyone writes tests concurrently as they develop (to make sure whatever they’re working on works and doesn’t break other stuff), and make sure they run those tests on a PR before we merge that PR  
* **Write a checklist of pre-submit/pre-merge requirements**  
  * Includes code formatting requirements (make sure code isn’t messy), naming/oop stuff, dependency checks, and testing requirements

## 4\. Developing a system model:

Link to the system model diagram:  
[https://lucid.app/lucidchart/8baeccd9-c02e-4593-80c6-5462f7c97596/edit?invitationId=inv\_86bb35aa-3f6a-49b4-ab5b-09a7b3f9c412\&page=0\_0\#](https://lucid.app/lucidchart/8baeccd9-c02e-4593-80c6-5462f7c97596/edit?invitationId=inv_86bb35aa-3f6a-49b4-ab5b-09a7b3f9c412&page=0_0#)

**User flow diagram:**
![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXd6U2gNBZ0mPhapbU5BfUf1oX0eIxvU3iRTlDzPJhGFnCLYfTNlM-1AKLyB7jG0We4gs7BLHHVyOBcGdjeVm-isqn548CQFcbSxuwj-rKF1TYytC_Isb3BbvnR1UHa2NCLpJJ8B?key=Y9inWgrbARsizmGAsFQgb-Na)

**Class/Component Database Diagram:**
![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeBEwxBrNscmhPiHdUkkmsX_UV8f13I2eMI2--6trnESZfcQfKLOUFJLM7XPfkJsJHqQBzxuIZ2oBwgqj0S7lQYT4rd3yycMBvh26I6T3HWsmt0-CP5mXj_EPw1Q8dw0h4gQFeZ5w?key=Y9inWgrbARsizmGAsFQgb-Na)

**Authentication Flow Diagram:**
![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfEYUq7Hhx5FqKVsa5i4t_JiWNHd5sJsSBu74603UQiQthPJeogl0MnjdqQYAh4v7BOuyDu5DHp4YyvS_CWXqoKpDyO2C-0FNPFw3aToDIKIKfirpsf6yu1ved2pHVC1E39xTEW?key=Y9inWgrbARsizmGAsFQgb-Na)

**Contact (view and add) User Story Diagram:**
![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXd1ejUEioTc4WSI4gMTnqa3Dx6FQibd4vXxR9nDTaL5F7-hbnUgzPyVUCN1kK4tJ538Zahzmyzv_nupjCZyRKUHKJPG97hDQWnJaQG5Kg3WtvD2v8YYa5eeh_MHKfjjUni7znvwzg?key=Y9inWgrbARsizmGAsFQgb-Na)


## 5\. Dividing the work equally

Sub-teams:

1. Humraj, Harvir  
2. James, Lisa  
3. Arifa, Supriya, Idris

Breakdown of work based on user stories:

- User story 1: Create account/login/logout  
- User story 2: Adding/viewing/deleting contacts (Manual, then CSV and LinkedIn integration if possible)  
- User story 3: Add/view/delete interactions and tasks on a calendar (Manual, then Google Calendar Syncing if possible)

# Sub-team 1:

Team members in this sub-team and their roles.  (Sub Team 1: User Authentication and Login)
   1. Humraj: Backend Developer  
   2. Harvir: Frontend Developer

A description of the specific features, modules, or components built by the sub-team.  
   1. Authentication API (Implemented in the accounts django app)  
      1. Endpoints  
         1. POST  /api/token/   
            1. For retrieving token and attaching token to cookie  
            2. Used when use logs in or registers  
         2. POST /api/token/refresh/  
            1. For refreshing token   
            2. Called whenever page changes or whenever user sends backend request so that user does not time out  
         3. POST /api/logout/  
            1. Deletes access and refresh cookies  
            2. Used when user wants to log out  
         4. GET api/authenticated/  
            1. Checks if user is authenticated by looking at if browser access cookie is available and valid  
         5. POST api/register/  
            1. Allows user to register with username, email and password  
      2. Cross-Origin Resource Sharing (CORS) is used as a security measure when authenticated to allow only specific domains to send backend requests  
      3. Tokens are stored in cookies rather than local or session storage to prevent attackers from stealing tokens through javascript injection  
   2. Login UI (Login.js, api.js, useAuth.js, Login.css)  
      4. Login page that users interact with first when they access our website. It is described by Login.js and stylized by Login.css. It features the title of our project ‘Personal-CRM’ with two fields to enter their username and password. There is a button, labelled ‘Login’ for users to click to login once they have filled in their information. There is also a link titled ‘Sign up’ for users to be redirected to the Register page and register if they do not already have an account for our website. On a successful login, users are redirected to the homepage of our website.  
   3. Register UI (Register.js, api.js, useAuth.js)  
      1. Register page that users are redirected to when they click on the ‘Sign up’ link on the Login page. It is described by Register.js and also stylized by Login.css for a similar style. It features a username, email, password, and confirm-password fields. There is a button, labelled ‘Register’ for users to click to register once they have filled in their information. There is also a link titled ‘Login’ for users to be redirected to the Login page and login if they already have an account for our website. On a successful registration, users are redirected to the homepage of our website.   
   4. Private Routes so only authenticated users can access pages and make api calls (PrivateRoute.js, useAuth.js)  
   5. Field Validation (Login.js, Register.js)  
      1. All fields on the Login and Register pages are validated so that users can only login and register with appropriate information. For example, red-text will appear underneath the password field saying that username or password information is incorrect. In addition, the username and password fields are highlighted with a red border and they disappear, along with the error message, once users begin editing the fields again. Similar Field Validation happens on the Register page, displaying when a username is already taken, an email format is invalid, and the password fields do not match or are left blank. On this page, multiple errors can appear alongside each other so users know what information is incorrect all at once. For both pages, the login and register buttons do not allow the user to login or register if the field information is incorrect and produces error messages.  
   6. User Authentication Timeout  
      2. Session refreshes every time user navigates to a new page (useAuth.js triggers get\_authenticed on page change)  
      3. All authenticated backend responses are called with axiosInstance which is a custom wrapper around axios made to have extra functionality.  
         1. axiosInstance is Implemented in api.js  
         2. Everytime axios Instance is called it does two things:  
            1. First adds withCredentials: true to each request to ensure that tokens are used as credentials  
            2. Intercepts any 401 responses returned from requests and attempts to refresh the token to determine whether the 401 error is due to an unauthenticated user or not. If the 401 response comes from an unauthenticated user then the refresh token will be used to re-authenticate the user.  
      4. Flow Diagram
         
         ![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdjsNrJZp_weJoXDGqzp_KcZs71pQkro5XyBHDslqoAEa1RWi5l_REKLN1Bf7F-0lkLEGymnI-avjt_xv3gpR3sIRbGdXfBwChZYocpgbBXyMQxJNbOC0StYZY3zw7ddFxSL12M?key=Y9inWgrbARsizmGAsFQgb-Na)
      5. Backend Testing
	      1. A test suite was created to test backend apis for user authentication using django unittest.

Lessons learned from this phase.  
- What worked well?  
	- Dividing the work between one backend developer and one frontend developer increased the speed of coding time as both developers were able to work simultaneously.  
	- Having an initial figma to follow made it easy to created the login and register pages to ensure that they fit with the rest of the projects design. The initial creation of the Login and Register UI was easy to navigate. Error checking for simple cases that didn’t rely on the backend also went well (i.e checking if passwords matched or email was in a correct format).  
	- Regular User authentication using session storage worked well. However, storing these tokens in cookies instead was a little harder.  

- What didn’t work well? What can you do better for future deliverables?  
	- Some backend responses were not giving proper error codes when failing. This made it hard for the frontend to catch errors specific to certain error codes. In the future it is important to specify all the error cases an api should produce.  
	- It was a bit difficult to get error checking for login information and duplicate usernames on registration, because it relied on backend error checking to send specific error messages. In our subgroup, we both used different methods for checking error messages, and had to get on the same page to get it working. For future deliverables, it is better to communicate our methods before coding to make sure whatever backend/frontend we code is useful for our partner’s side.   
	- Too much abstraction can make it hard to debug. Initially we used many helper functions that spanned different files which caused some errors to not be caught. After simplifying the use of helper functions, the code became more readable and was easier to debug. In the future we will try to implement features with as little abstraction as possible to get things working and then create helper functions once the initial feature is working to avoid long debugging sessions and redundant code.

# Sub-team 2:

Team members in this sub-team and their roles. Sub-team for user story 2 (Contacts):
1. James (frontend)  
2. Lisa (backend)

A description of the specific features, modules, or components built by the sub-team.
- Frontend
	- Contacts page in Contacts.js. This page shows the important information about the contacts added by the logged in user such as their name, email, job, relationship and relationship score as a bar. It allows the user to click a button to add a contact through another page, click to edit any one of the listed contacts through another page, or search or sort through the contacts on the page.  
	- Add contact page through AddContact.js. This page presents the logged in user with a form of information about a contact for them to manually add someone to their contacts list. It has form fields for each piece of information about the contact, a button to check off that you have the consent of the contact for liability purposes (as suggested by partner), a place to upload a profile picture and preview it (though we have not implemented the profile picture in the contact object) and a submit button to add the contact. Optionally, there are also extra questions that can be expanded with the complete relationship quiz button that allows the user to express how close they are with the contact and give that contact a relationship score greater than the default of 0\. Submitting a contact with information that does not raise any errors (shown next to the form inputs) creates a new contact and redirects the user to the contacts page to see it.  
	- Specific contact page through ContactId.js. This page shows all the information about an existing contact of the logged in user in a similar layout to the add contact page. This serves the purpose of checking the information of the contact, but also being able to edit their information by changing the information in any of the given input fields and pressing the update button, or deleting the contact entirely by pressing the delete button. Both actions do their respective requests and send the user back to the contacts page to see the update or deletion of the contact.  
- Backend
	- Model for the Contact object (for each entry in the database). The model (so far) includes fields like name, email, a generated uuid for the contact, relationship, releationship\_rating, and some optional fields like notes or phone number. Note that a Contact is a foreign key of User (User being the model for the user of the app) to ensure users can only access their own contacts. The Contact model also has a serializer (converting between python and JSON). The urls are all under the /contacts path.  
	- APIs for different aspects of the use case. Namely:  
	  - Viewing all contacts on a contacts page (ContactView, /contacts)  
	    - GET that we link to the Contacts page in Contacts.js  
	    - Called when the user clicks on the contacts page tab, or in any redirect to the /contacts page (i.e. after successfully adding a contact)  
	  - Adding a contact (AddContactView, /contacts/add)  
	    - POST that we link to the Add contact form in AddContact.js  
	    - Called on form submit on the /contacts/add page  
	  - Viewing/editing a single contact’s info (IndividualContactView, /contacts/\<contact uuid\>)  
	    - GET and POST on a particular contact by uuid; we link this in ContactId.js  
	    - Called in the edit page, and on form submission for edits being made to the particular contact  
- Backend testing
	- This involves a couple python unit tests for each API endpoint and for testing the fields of the model (like checking defaults or blank values). There are also tests related to user to contact authentication which ensures that contacts “assigned” by a user are only accessible by that user.  
    
Lessons learned from this phase.  
- What worked well?

   The implementation of most of the basic features went actually pretty smoothly, in part because we had everything in separate components and a base to work off of, and the parts we made for this deliverable weren't too complex. We also worked well as a team and were able to communicate well and get what we needed done on time.

   We organized ourselves by use case and front/back end within each use case which helped minimized merge conflicts and simplify communication (so the subteam and role divisions worked well and made things more efficient). 

   We did very well staying frequently in touch with our partner Marc and having weekly meeting and asynchronous Q\&A documents. This ensured that the project was always moving in a direction that aligned with the end goals (for us and our partner) and enabled us to be very clear about what our use cases needed to be or do, which made development and documentation easier.

- What didn’t work well? What can you do better for future deliverables? 

   We thought we might have time to do more of the future implementations like with linkedin connection, csv import and profile pictures with Pillow Django, but we didn't have the time for those. We could do better by planning better and getting a better idea of what we can feasibly do in our given time. Also, we tried to make things responsive from the start but that did not work, and we ended up not having enough time to make the pages responsive. Going forward we plan on fixing that by having a version of the site that is built for mobile view that has a different layout.

   With more time we would’ve done more robust corner case checking as well.

   Doing prior testing on hosting sites (available to us and within the budget) to ensure that they were fit to use would have saved us the hassle of looking for more deployment options (and given us more time to iron out front to backend connection issues) when the hosting sites we had intended on using turned out to not work for us or not be within our budget. Doing some more research on build tools and unit testing would have been cool too—that way we could have had some quick and simple automated CICD/pull requests with unittest hooks or something similar done for this deliverable, which would have been good infrastructure and QA set up for development moving forward. 

# **Sub-team 3:** 

Team members in this sub-team and their roles.  
1. Arifa: Frontend, Backend, Backend Testing  
2. Supriya: Frontend, Google Calendar Integration  
3. Idris: Frontend, Deleting Tasks/Events  
     
A description of the specific features, modules, or components built by the sub-team.

- Frontend: 
	- Calendar.js: We chose React Big Calendar because it made our development process easier with its built-in features and viewing options, including month, week, and day. The functionalities in the calendar include:   
	  - Events management:   
	    - Users can create and remove events within the calendar interface.  
	    - When adding an event using the “+ Add Event” button, users are prompted to select a start and end date/time.  
	    - If the end date/time is earlier than the start date/time, an error message is displayed.  
	    - Events are displayed in light blue within the month, week, and day views, and are also included in the agenda view.  
	    - Users can delete events directly from the calendar using the “X” button located on the left of each event.  
	  - Task management-   
	    - Users can add and delete tasks for a specific date, similar to event creation.  
	    - Tasks appear in dark blue on the calendar.  
	    - A task list is included to provide users with an overview of their tasks.  
	    - Future enhancements for the next deliverable: We plan to introduce automated task creation (e.g., “Message \[your contact\] a Happy Birthday\!”) and a “Mark as Completed” option for better task tracking.  
	- Calendar.css:   
	  - The Calendar.css file styles the calendar interface, including buttons, modals, task lists, and events. The .blue-button and .cancel-button provide styles for adding and cancelling actions. Modals use .modal-overlay and .modal-content for a clean popup design. Tasks are displayed using .task-list, and past days are grayed out with .past-day. Events have a small delete button (X) styled with .delete-icon. These styles ensure a user-friendly experience.
- Backend:
	- Backend Integration:   
	  - Two main models: Event and Task, both linked to a user account. Events include a user (foreign key), title (charfield), start time/day (datetimefield), end time/day (datetimefield), and a colour for display. Tasks are simpler, with just the user (foreign key), title (charfield), date (datefield), and colour. These models are connected to the user to make sure that each user only sees their own calendar events and tasks.   
	  - To interact with the backend, there are API endpoints that handle creating, updating, viewing, and deleting events and tasks. Users can retrieve all their scheduled items, update existing ones, or remove them when they’re no longer needed. We used Django’s ModelViewSet to simplify most operations, while separate views handle individual event and task updates. The calendarapi views also includes authentication, so only logged-in users can access their data.  
	  - For smooth API routing, I structured our URLs so that the main endpoints are /api/events/ and /api/tasks/, where users can manage their schedules.   
	    - Viewing all events (EventViewSet, /api/events/) GET request to retrieve all events associated with the logged-in user.  
	    - Adding a new event (EventViewSet, /api/events/) POST request that allows users to add a new event  
	    - Deleting an event (DeleteEventView, /api/events/\<event\_id\>/delete/) DELETE request that removes the selected event.  
	    - Viewing all tasks (TaskViewSet, /api/tasks/) GET request to retrieve all tasks associated with the logged-in user.  
	    - Adding a new task (TaskViewSet, /api/tasks/) POST request that allows users to add a task with a title and date.  
	    - Deleting a task (DeleteTaskView, /api/tasks/\<task\_id\>/delete/) DELETE request removes the selected task.  
	  - Each event or task has a unique ID that allows for direct access, editing, or deletion. The backend also includes some unit tests to ensure everything initially works correctly, including checking model behaviour, validating data, and making sure only authorized users can manage their tasks and events.

Lessons learned from this phase.  
- What worked well?  
	- Smooth Frontend Implementation  
	  - The initial front-end development went well, especially in setting up the UI. The use of React Big Calendar for the calendar integration was a great choice as it provided a comprehensive set of features right from the start, including customizable views and event management tools. This saved significant development time compared to building a custom calendar component from scratch and delivered a polished user experience that we could customize.  
	- File Structure  
	  - The way we structured our files made it easy to navigate, maintain, and expand features. This organization helped keep the project manageable as more functionality was added.  
	- Organization with Separate Channels  
	  - The decision to create separate Discord channels for different aspects of the project—such as general discussions and specific feature development—greatly improved communication. Team members were able to focus on their areas of work without distractions, and it became easier to track and resolve issues when they arose. We all still had access to other channels as well, so we could keep checking in on others as well.  
- What didn’t work well? What can you do better for future deliverables?   
	- Task Division:  
	  - We split up our tasks in terms of features, which led to a lot of waiting time as we had to wait for each other to complete their respective parts before pushing updates. This caused inefficiencies, as one team member’s progress often depended on completing and understanding another's task. In the future, we should assign tasks based on specific areas to ensure that work can progress concurrently without unnecessary delays.   
	- Unclear Task Prioritization:  
	  - At times, the team struggled with prioritizing tasks effectively, leading to confusion about which features should be tackled first. Some features, like Google Calendar integration were started, however halfway through implementation, our partner decided it wasn’t necessary for this deliverable. In the future, it would be helpful to establish clearer priorities at the beginning of the phase, ensuring that critical features are completed before less urgent ones.


# **Team:**

A detailed explanation of the common foundation built at the start of the Implementation phase.	  
   - For our foundation we wanted to start at a place where everyone could work simultaneously with the least amount of merge conflicts possible. We also tried to implement the initial functionality required for each subteam to do their part such as fronted end page navigation and backend user authentication and registration.  
   - In the frontend James set up a React app. He made sure to use packages like react-router-dom to make it easier for page navigation. He also set up a Main component within App.js. The Main.js component used the routing from react-router-dom to allow for seamless switching between all pages rendered through that component. Main imported all other pages and components and rerouted to the correct page based on the current link, so that everyone could work in their own page or component file and not all need to touch higher level files like App.js that might cause merge problems, and to connect the component or page they would just need to add an import and a routing line to Main.js.  
   - In the backend Humraj set up a Django server and got a simple version of authentication working using simple JWT so that others could login and create users for testing their own features. He later made login more secure using CORS and cookie authentication. He then created multiple apps within the server directory to separate sections based on use cases so that each sub-team could work on their own views and other files without having to touch the same files as other sub-teams, and the higher level urls file would look at each app's own urls file to render the views.  
   - Finally, James also set up a sidebar and layout as a common foundation. Since most pages in our site use a sidebar for navigation and have the page content to the right of it, instead of making one in each file, he made a CRMSidebar.js component that had links to each page. Then he made a Layout.js component that would take that sidebar and format it properly with the other content of the page, so that any page that wanted to use the sidebar could just surround their page content in the \<Layout\> component.  
    
A summary of how the sub-teams' work contributed to the overall project.   
- Sub-team 1's work contributed to the Account and User object related functions of the web app. Users can register accounts to login and logout to the web app. Users are authenticated through tokens stored through cookies to ensure better security. User authentication is refreshed any time a page is changed or a backend request is called and times the user out after a certain period of inactivity. Fields for Login and Register are validated on the frontend before they are processed to notify the user quicker than if a backend request was made. Data fields are also sanitized on the backend to prevent injection attacks.  
- Sub-team 2's work contributed to the Contacts-related functions of the web app. The ability to view contacts, add a contact, edit a contact and delete a contact were all created by sub-team 2\.  
- Sub-team 3’s work contributed to the Calendar component of the web app.  Their focus was on calendar functionality and task management. Their work ensures that users can efficiently schedule, manage and track events and tasks and is integrated seamlessly with authentication.  
    
The team’s **overall progress** in the context of the roadmap from the Planning phase.
- As a whole, our team got everything we planned to do in the planning phase done. We planned to do all of the manual parts of our web app's most important user stories (register/login, contacts and calendars were the most important because everything else builds off of those), and we got them done as we wanted. There were some minor things that didn't get as done as we had hoped such as the responsiveness of pages or possible integrations with services like Google and LinkedIn, but those were not our priority for D2 so we are still on track with our plan. In D2 we planned to get all of the core manual functions of our app up and running, and we achieved that. Looking ahead, we want to now use these d2 features as a base to build our automated features like implementing LinkedIn integration to create contacts. We also want to address some more of the edge cases such as locking out the user after they have entered the password incorrectly 5 times as well as checking password strength for registration.

Any major technical or organizational challenges encountered and how they were handled.

  - There were some difficulties with attempts to do integration with google, as well as in trying to get deployment working. For integration, we were having some trouble getting google integration for google calendar as we were running out of time for the deadline of D2, but since integration with LinkedIn and Google was an extra to our D2 plan, we decided to focus on our plan and leave integration for after we got everything working smoothly manually. The deployment we originally struggled with since most services required our repository to be owned by us directly (which was not possible because the repository is in the 301 class group) or had to be public, but we found a solution by forking the classroom repo into our own personal accounts and deploying that. However since we are using the free plan for deployment, we had to come to a compromise with the deployment services used. The backend is deployed and usable using render, and even uses PostgreSQL which we thought we wouldn't be able to use in D2. However, the free tier on render only allows 15 minutes of inactivity before the deployment server gets shut down, and there is also a limit of 1GB of storage for our database, meaning that we can only make a few users, contacts and events. Our actual project MVP requires the ability to have a huge amount of users, contacts and other data, so this is not ideal, and for D2 marking it is also not ideal since before the TA marks it the backend has to be started again and they can't make too many objects. This means that the first request a TA makes to our server will take a long time as the backend has to start up again. However, this was the best we could get, so it is a major technical challenge that we had to handle. So future solutions that we are looking into for D3 is to use Cron jobs that trigger a backend request every 15 mins before the server shutdown. This will make sure the server does not shutdown even when using the free tier. 