# Personal CRM - Team 3:15 AM

## Partner Intro

Marc Gaudett, mgaudett@gmail.com

Marc helps B2B SaaS Startup companies scale their revenue. Currently he is running a boutique advisory firm for SaaS companies and helping the Founder replicate their success before bringing on a team to scale.

## Description about the project

The Personal CRM Web Application is designed to automate and simplify the process of maintaining relationships across personal and professional circles. For busy professionals, particularly those in fast-paced industries like tech, managing a growing network of contacts can be overwhelming. Life moves quickly, and it’s easy to forget birthdays, miss opportunities to reconnect, or let important relationships fall. Our application centralizes your contact information, aggregates data from platforms like LinkedIn and Google, and provides automated reminders for important milestones such as birthdays and anniversaries. It also offers AI-driven insights to help you understand the quality and strength of your connections, so you can prioritize relationships that matter most. By streamlining this process in a single, intuitive platform, users save time, enhance their outreach, and keep up-to-date on their social and professional circles without the burden of manual tracking.
​
## Key Features

Primary Features and functionalities currently implemented for D5:

1. A user can register and login (Inital Page)
	1. A user can login or create an account if they do not have one.
2. A user can create and add contacts to their account (Contacts Tab)
	1. A user can add contacts and input information about each of their contacts manually.
 	2. They can also choose to upload their contacts through LinkedIn with its CSV export by uploading the CSV file, or upload their contacts through Google by syncing with Google contacts.
	3. They can also take a quiz that asks questions about a contact to generate a relationship score using AI that determines the strength of their relationship.
	4. A user can view all their contacts in a consolidated overview.
 	5. A contact's relationship rating will change based on interactions the user makes via events or tasks
3. A user can add events and tasks to a calendar as reminders for when to reach out to contacts. (Calendar Tab)
	1. On the Calendar Tab, a user can view a calendar of all their upcoming events and tasks.
	2. A user can also add events or tasks to the calendar.
 	3. A user can sync their calendar with Google Calendars to see those events appear on their calendar on our website.
4. A user can view and interact with recent events and tasks from their network (Feed Tab)
 	1. A user can add an event taken from activity on a linked site that is not already on their calendar to their calendar through the feed page.
  	2. A user can build a streak off of adding events to their calendar, and add events in a "swipe right" gamified manner.
  	3. A user can see an AI summary of their recent tasks and events and what it recommends that they prioritize. (Added to Home Tab)
5. A user can complete missions and view a log of all their activity (Log Tab)
	1. A user can view all added events and tasks in a log to track their progress.
 	2. A user can filter, sort, and categorize events and tasks using tags.
 	3. A user can complete quests/gamified elements to strengthen their network.
6. A user can change their account settings (Settings Tab)
	1. A user can change their username, email or password.
 	2. A user can delete their account, and edit their streak goals. (Linked to Feed Tab)


The Final MVP for Personal CRM should accomplish the following 3 main user stories:

1. As a user I want to be reminded when I haven't communicated with someone for a while.
2. As a user, I want to be able to easily follow up on outstanding items and set due dates - that means I should be able to send a follow up message with one button press.
3. As a user, I want to be able to capture information easily. I want to be prompted to help me understand my relationship by only answering a few short questions about the person, after which a score from 0-100 that represents my relationship with them is generated.

## Screenshots, GIFs, or Short Videos:
View the following video for a walkthrough and user flow of our website:

(D5) https://drive.google.com/file/d/1yFwM5GGEoiyr4jf9c3LRai80oEQ2d-BD/view?usp=sharing 

(D4) https://drive.google.com/file/d/1p0NXsdapgDIGY1qg4pIRuvwF7i0os-z_/view?usp=drive_link

(D3) https://drive.google.com/file/d/1JW90mKkOl3xHRIIyQfsKz_y9BK-xlQT-/view?usp=sharing

(D2)
[https://drive.google.com/file/d/1AE1FqYCjQAl-VvuZVgFaiwOJPLMCc7xf/view?usp=drive_link](https://drive.google.com/file/d/1AE1FqYCjQAl-VvuZVgFaiwOJPLMCc7xf/view?usp=drive_link)

## How the TA can test the features:
Visit our deployed website here:

**Newest D5 snapshot: https://personalcrm-d5.netlify.app/**

(D4 snapshot: https://personalcrm-d4.netlify.app/)

(D3 snapshot: https://personalcrm-d3.netlify.app/)

(D2 snapshot: https://personalcrm.netlify.app/)

	Note: Since we are using the free tier of our deployment services, it may take a while for our services to startup the first time as our server shutdowns after 15 minutes of inactivity. You may be seeing a loading screen for aprox 1-2 mins or a request may take a while to get sent.
	   
1. After clicking the link above you will be brought to the log in page.
	1. You can use the following test user to login
		1. username: testuser
		2. password: 123
	2. You may also register a new account instead by clicking the Sign Up link at the bottom of the Log In page.
		1. Here you can enter a username, email and password.
		2. Feel free to use this account instead of the test user above.
  		3. There is also a password strength calculator that shows under the password you created to ensure you are using a strong enough password.
  	3. You can also test the lockout feature that locks you out of logging in for 30 seconds after 5 failed login attempts
2. Click the login or register buttons after entering credentials to sign in. (Note: Since we are using the free tier of our deployment service it may take a while to log in after clicking the Login button)
3. Once Logged in, you will be brought to our home page. This is where you will see a sidebar and a motivational quote.
4. To test our second use case, click the Contacts tab on the left sidebar.
	1. Here you can add a new contact by clicking the green add contact button.
		1. This will bring you to an add contacts page where you can enter information about a new contact you want to add
		2. Try inputing a name, email, phone, job, relationship and notes.
		3. You can also try the relationship rating quiz by clicking the blue relationship rating quiz button at the top.
			1. This will determine a relationship score once you submit the contact measuring how well you know your contact
		4. You can also upload an image on the righthand side (200KB image size limit)
		5. To submit the contact and add it to the list of your contacts you must first consent to add this contact for compliance reasons.
		6. After the above fields are entered, click the green submit button to add the contact. You will be prompted with a dialog box saying the contact has been added
	2. Once a contact is added you will be brought back to the contacts page where you can see an overview of all your added contacts. You should see that your new contact has been added. You should also see a relationship rating status bar indicating how well you know your contact based on the relationship quiz taken earlier.
	3. If you would like to edit information about your contact click the edit link next to the contact on the right.
		1. this will bring you to a page where you can edit existing info or even delete the contact
	4. On the contact overview tab you can also sort your contacts by clicking the "Sort By" button
	5. You can also search your contacts using the search bar.
	6. Clicking the import/export button in the top-right, you can see three options, for uploading LinkedIn contacts and uploading Google contacts, and for exporting your contacts as a CSV.
 		1. Clicking import LinkedIn brings you to a page that gives you steps for how to download your LinkedIn contacts CSV file from LinkedIn. You can then upload this file using the upload button on that page and it will add all of your LinkedIn connections.
  		2. Clicking on the Connect With Google button brings you to a page where you can connect your account to Google if it is not already connected, and then you can sync your Google account's contacts, and it will add all of them to the contacts page.
       3. Clicking on the Export as CSV button will export all your contacts as a downloadable csv file.
5. To test our third use case, click the Calendar Tab on the left sidebar
	1. This will bring up a calendar view 
	2. To add an event to the calendar click the add event button located at the bottom right of the screen.
		1. This will bring up a dialog to add an event
			1. Enter the title of the event, the start date and the end date (either by typing or clicking on the calendar icon)
				1. There may be issues with the calendar icon popup so ensure that you use chrome for the best results. A time must be added for an event to be created
			2. Save the event
			3. This will add an event block to the calendar on the specified day selected
			4. You can click the x to delete the event on the calendar
	3. You can also add a task instead by clicking the add task button
		1. This process is similar to adding an event but without an end date
		2. For both tasks and events, you can link them to a contact (this will increase the relationship score of that contact)
		3. For both tasks and events, you can add a tag (default or custom) to categorize the activity (viewable and filterable in the Log Page)
	4. On the calendar tab you can also change the views by clicking the week, day and agenda views at the top right
	5. You can navigate back and forth in time using the buttons in the top left.
 	6. You can also add contacts through google by clicking the connect with google button. This will import the google calendar events of whatever google accouhnt you select.
6. To test our fourth use case, click the Feed Tab on the left sidebar
	1. This will bring up a view where you can see events from people in your network.
 	2. You can click the Next button to see a new Event or click the Add button to add the current event to your calendar.
  	3. Adding an event to the calendar will increment the daily event counter. A user can set a daily event goal (default is 3). If they add a number of events equal to their daily goal, their daily streak counter will increment on the following day. If a user fails to meet their daily goal, their counter will reset back to 0. Daily streaks are done using a Cron job and is not available using the free tier of our backend deployment as of right now. However developers can test this feature out in our local developer environment (see below).
7. To test our fifth use case, click the Log Tab on the left sidebar
	1. This will bring up a Mission log (for weekly quests) and Activity log (displays past events and completed tasks).
 	2. Quests will refresh automatically every week
 	3. The Sort By and Date Filter buttons allow you sort and filter your activities, and the CSV Export button will export all your activities as a downloadable csv file.
  	4. The search bar can filter by keywords or by Tag.
8. To test our sixth use case, click the Settings Tab on the left sidebar
	1. You can change your username, email and password, as well as your streak goals (for the interactive Feed Tab)
	2. By clicking the Save Changes button, you apply all changes
	3. By clicking the Delete Account button, you can confirm deletion—your account will be deleted and you will be returned to the login page
9. For more space you can collapse the sidebar by clicking the three lines in the top left corner
10. Lastly you can log out of your user by clicking the logout button on the sidebar (ensure that you expand the sidebar after collapsing it to see the logout button) 
	1. This will bring you back to the log in page

Notes for testing
- For any further clarity with the steps above, please refer to the walkthrough video above.
- If request are slow, please be patient as our backend server is using the free tier. (inactivity for 15 mins will cause server to shutdown and will cause next request to take longer (~2mins))
- Authentication access token expires after to 5 mins in which user may be prompted to log in (usually not the case)
- Authentication access refresh token expires after a day in which case the user must re-log in.

## Developer Instructions
Developers Instructions can be found in [README.dev.md](README.dev.md)
​
## Intellectual Property Confidality Agreement
 - We have agreed on option #2 - You can upload the code to GitHub or other similar publicly available domains. Marc owns the actual project but the code we worked on is on a private github repository in the CSC301 classroom. 

## Licenses 
 - Not Applicable. There are no licenses involved in the project as of now.
