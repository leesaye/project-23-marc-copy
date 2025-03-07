# **Team 3:15 AM (Team \#23)**

## **Iteration XX \- Review & Retrospect**

* When: March 7th, 2025  
* Where: Online Zoom Call

## **Process \- Reflection**

#### **Q1. What worked well**

List process-related (i.e. team organization and how you work) decisions and actions that worked well.

* 2 \- 4 important decisions, processes, actions, or anything else that worked well for you, ordered from most to least important.  
  * We communicated daily using Discord to track progress without needing to attend full meetings  
  * We created separate channels for each user story to better organize and keep track of progress  
  * We used Notion to assign Deliverable tasks and keep notes of meetings  
* Give a supporting argument about what makes you think that way.  
  * Daily communication through Discord to discuss what features members are working on, their progress, and issues they faced is much faster than setting and attending Zoom meetings with each other  
  * Separate channels for user stories allowed members to collaborate in sub-groups more effectively and communicate progress  
  * Notion was useful to assign and manage the work with Deliverable write-ups and documentation, separately from user stories  
* Feel free to refer/link to process artifact(s).  
  * Notion Meeting Notes Example:
    ![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcfNMX7mobOTM6-OsE1x3JkavoxILtU_UAYbXjQCJyRoaLqfmYBMRt-FdC7lv_k5dgdPm2FIPUEzM7L0_Yj2-RIKve82BVNLcqCx-VUNr9TrnzAOzRADUaD9A8_jVKWAyAjMMfLpw?key=osAvPbDJQ-UYLfEeZCyKaose)
  * Discord User Story Channels Example:
	![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXduvzq_uK50Qv4oXsaFS3O3LH_SyRnFWt5yMGvFCtHxy8D0IRlI9YQI3lpksGKwNpC7aLMEcYOOSvMxbxFfYntGdmzwjjjtHpKxWbLqJIGEHsxMhLX4mZYuS7c1AEvovqfdFhUQ9Q?key=osAvPbDJQ-UYLfEeZCyKaose)
    

#### **Q2. What did not work well**

List process-related (i.e. team organization and how you work) decisions and actions that did not work well.

* 2 \- 4 important decisions, processes, actions, or anything else that did not work well for you, ordered from most to least important.  
  * Decided not not have any official team meetings this week (other than this)  
  * We cancelled our meeting with Marc (our partner) at the start of D3 because we hadn't started working on D3 yet but then our next weekly meeting was 1 day before the deadline  
  * Multiple people worked on separate branches doing similar things during D3 and there was some confusion  
* Give a supporting argument about what makes you think that way.  
  * We had some organization and communication difficulties this deliverable because of these decisions. Not having a team meeting made us less organized, although we communicated regularly through discord, which made multiple people work on google integration in a similar way at one point that could have caused some merging problems.   
  * Also we couldn't get feedback from Marc before the deadline because we cancelled the first meeting with him as we had not started yet, which was not ideal.

#### **Q3(a). Planned changes**

List any process-related (i.e. team organization and/or how you work) changes you are planning to make (if there are any)

* Ordered from most to least important, with a supporting argument explaining a change.  
* Right now we have weekly meetings set for 12 PM on Thursdays with our partner Marc. Although these meetings are recurring every week, we send emails in the morning on Thursdays to let eachother know if we will be attending. This was not the best strategy as there would be weeks where we were planning on meeting with Marc but he would have to cancel. In the future we are going to let Marc know if we plan on attending the recurring meeting a couple days beforehand so that we can reschedule earlier in the week if Marc cannot attend on thursdays.

#### **Q3(b). Integration & Next steps**

Briefly explain how you integrated the previously developed individuals components as one product (i.e. How did you combine the code from 3 sub-repos previously created) and if/how the assignment was helpful or not helpful.

* Keep this very short (1-3 lines).  
  * For each user story, we developed a separate branch to keep them as individual components while building and testing  
  * After each branch user story was completed, we merged them into main, and tested our product, to ensure that each merge was successful

## **Product \- Review**

#### **Q4. How was your product demo?**

* How did you prepare your demo?  
  * For our product demo, we prepared a screen recording going through each user story with a focus on the new user stories  
* What did you manage to demo to your partner?  
  * We sent him a screen recording of us going through the website, per his request. In this demo we were able to show him the changes with the Google and LinkedIn integration as well as the AI components, specifically the auto generated messages, task prioritization and relationship scoring  
* Did your partner accept the features? And were there change requests?  
  * Overall, our partner accepted all new features  
  * Moving forward, he wants us to focus on the design aspects of these features and ensure that all edge cases are handled  
* What were your learnings through this process? This can be either from a process and/or product perspective.  
  * One of the main focuses for this deliverable was the integration of third-party APIs, so we learned a lot about understanding authentication flows  
  * Another thing we learned was that reducing login for Google integration is important. It is redundant to have users login several times, thus we moved our login process to the backend to prevent redundancy
