# A simple QR code sign in app with google sheets as a backend.

# About the project:

### A bit of background:
I ran a hackathon named Scrapyard Boston in November, 2024. About 50 people showed up. Signing people in was really hectic and stressful as you had to get their name _(Figure out how to spell it)_, search it in a spreadsheet, and if they didn't have their liability forms in our system, help them find it or fill it out again (rushing so the 40 people waiting in line behind them would not have to wait too long).

### My solution:
A QR code we can send to event attendees ahead of time so they can pull up the QR code on their phone and we can scan them in really quickly. 

### What this project does:
I made a website to share credentials for the very user friendly check-in scanner webpage so multiple people can help sign people in. If the person being signed in doesn't have their forms in, it sends them an email with info on how to get their forms in and what to do after they get them in. Oh, and did I mention it automatically marks people as present in a Google sheet that is still human editable for edge cases? The whole project is based around google sheets. Once you populate attendee data into the sheet, a mail merge style spreadsheet is generated for ease of sending emails out with the attendee QR code.


# Setup:
<details>
<summary>Spreadsheet creation & setup</summary>

## Setup (3-4 min):
<details>
  <summary>Step 1: Make a Copy of the Document</summary>

1. Click here to open the document.
2. Click **File** in the top left-hand corner.
3. From the dropdown, select **Make a copy**.
   <img width="1674" alt="9" src="https://github.com/user-attachments/assets/7905b735-6a65-4a99-907b-a0b0b0b4dee8" />
     <!-- Screenshot: "File" menu dropdown with "Make a copy" option highlighted -->
   </details>

<details>
  <summary>Step 2: Open the Apps Script Editor</summary>

1. After making a copy, click **Extensions** in the top menu.
2. From the dropdown, select **Apps Script**.
   <img width="1674" alt="8" src="https://github.com/user-attachments/assets/f52910ce-4876-4487-ac50-f49c3d9cfb77" />
     <!-- Screenshot: Apps Script editor opened via the Extensions menu -->
   </details>

<details>
  <summary>Step 3: Deploy the Web App</summary>

1. In the Apps Script editor, click **Deploy** in the top right-hand corner.
2. From the dropdown, select **New deployment**.

<img width="1674" alt="7" src="https://github.com/user-attachments/assets/9fc4ba56-cceb-48b0-8925-f0d5c2846465" />

4. In the deployment dialog:
   - Click the cog icon next to "Select type" and choose **Web app**.
   - Add a description (e.g., “A wonderful deployment of the sign in app”).
   - Set **Execute as** to **Me**.
   - Set **Who has access** to **Anyone**.
5. Click **Deploy**.

![6r](https://github.com/user-attachments/assets/542d4e89-d07b-43e0-b43d-eb1b2cb21c37)

  <!-- Screenshot: Deployment configuration dialog showing "Web app" settings, description, and access options -->

> **Tip:** Double-check these settings to ensure the program functions properly.

</details>

<details>
  <summary>Step 4: Authorise Access</summary>

1. Click the **Authorise access** button (you might need to click it twice).

<img width="1674" alt="5" src="https://github.com/user-attachments/assets/03a0e694-e7e0-49e6-87ef-80cebd7e2ba3" />

3. When the popup warns that the app is unsafe, click **Show Advanced**.
4. Then, click **Go to [your document name] (unsafe)**.

![4r](https://github.com/user-attachments/assets/fa014494-e348-4746-a42c-d90bbebd1f05)

  <!-- Screenshot: Authorization popup highlighting "Show Advanced" and "Go to [your document] (unsafe)" -->
</details>

<details>
  <summary>Step 5: Retrieve the Deployment URL</summary>

1. Once authorised, you'll see a page with the Deployment ID and Web app URL.
2. Copy the URL under the **URL** heading.
   ![3r](https://github.com/user-attachments/assets/3d5cc24d-a87f-4f21-bacd-64af6d7dac9a)
     <!-- Screenshot: Deployment details page highlighting the Web app URL -->
   </details>

<details>
  <summary>Step 6: Configure the Sign-In Page</summary>

1. Open [this website](https://evan-gan.github.io/GoogleSheetsQRSignIn/share.html).
2. Paste the copied URL into the field labeled **Script URL**.
3. Return to your spreadsheet and copy the Spreadsheet ID (highlighted portion of the URL).
4. Paste it into the field labeled **Spreadsheet ID**.
   <img width="1674" alt="2" src="https://github.com/user-attachments/assets/2d35badf-bef9-49ed-867a-be6f0712a48d" />
     <!-- Screenshot: Website interface showing the "Script URL" and "Spreadsheet ID" fields -->
   </details>

<details>
  <summary>Step 7: Generate and Share the Link & QR Code</summary>

1. Click **Generate link & QR code**.
2. Save the generated link and QR code.
3. Share them with your sign-in helpers.
   ![1r](https://github.com/user-attachments/assets/9f769502-d910-492a-8952-38d3a449e34f)
     <!-- Screenshot: Display of the generated link and QR code on the website -->
   </details>
---
   </details> <!-- End "Spreadsheet creation & setup" dropdown -->


<details> <!-- Start "Spreadsheet data population & requirements" dropdown -->
<summary>Spreadsheet data population & requirements</summary>

## Spreadsheet Requirements

For the spreadsheet to function properly, ensure it includes the following columns with **exactly** the same headers:

| Email | ID  | Name | Legal Name | Arrived? | Forms? | Reminder email sent? |
| ----- | --- | ---- | ---------- | -------- | ------ | -------------------- |

- **Note:** You may reorder these columns as needed. However, **do not** change the spelling or modify any header names, as the code relies on them to locate the correct data.

## Columns to Populate

You need to populate the following columns:
- **Email**
- **Name**
- **Legal Name**

> **Tip:** I'd recommended to populating the **Forms?** column shortly before the event with people who filled out their forms before the event.

</details> <!-- End "Spreadsheet data population & requirements" dropdown -->