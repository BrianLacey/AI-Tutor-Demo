DEPLOYED APP

Please find the deployed version of the app here: [https://ai-tutor-demo-jade.vercel.app/](https://ai-tutor-demo-jade.vercel.app/)

SETUP INSTRUCTIONS

1. Install Node.js
This app was built on NodeJS version 24.14.0, though I imagine the current Long Term Support (LTS) version 24.18.0 (as of this writing) should not cause any issues. NodeJS can be installed [here](https://nodejs.org/en/download) at nodejs.org, its official webpage.

    Run `node --version` and `npm --version` to confirm both are installed.


2. Install Git  
The version used in this app is 2.42.0 but the current version (2.55.0 as of this writing) should be fine as well. Git's official downlaod page is [here](https://git-scm.com/install).
Default setings during istallation are fine.


3. Clone the repo 
Inside your IDE of choice (this weas built with VSCode), run the command:

    `git clone https://github.com/BrianLacey/Ticket-Dashboard.git`

    in your terminal to clone the entire repo onto your system, followed by:

    `cd AI-Tutor-Demo`

    to access code in the app.


4. Install dependencies  
Run the command:

    `npm install`

    This pulls in All of the dependencies listed in package.json.


5. Create a .env file  
At the root of the project folder create a new file titled .env.local. Here's where API keys will live.

6. Create API keys  
Create an account at [supabase.com](https://supabase.com/). Navigate to the Dashboard and create a new project. Once that's done, click connect to find the supabase public API keys. Copy both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` into your .env.local file. Next, navigate to settings -> API Keys to find your secret key. Copy this into your .env.local as well under the name `SUPABASE_SERVICE_ROLE_KEY`.

    Next create an account at [vercel.com](https://vercel.com/). Navigate to AI Gateway -> API Keys. Create API Key here (Be sure to save it somewhere safe; Once the dialog box is closed, you won't be able to view it again.) and copy this key into your .env.local file under the name `AI_GATEWAY_API_KEY`.

7. Create tables for users and chat history  
In Supabase, navigate to your project and open the SQL Editor. Enter the following query to create the User Profiles table then click Run:

    ```
    create table user_profiles (
    user_id text primary key,
    inferences jsonb default '{}',
    updated_at timestamptz default now()
    );
    ```

    Create another table for Chat Messages and then click Run after entering the query below:

   ```
   create table chat_messages (
   id uuid primary key default gen_random_uuid(),
   user_id uuid not null references auth.users(id) on delete cascade,
   role text not null check (role in ('user', 'assistant')),
   parts jsonb not null,
   created_at timestamptz default now()
   );

   alter table chat_messages enable row level security;

   create policy "Users can view own messages"
   on chat_messages for select
   using (auth.uid() = user_id);

   create policy "Users can insert own messages"
   on chat_messages for insert
   with check (auth.uid() = user_id);
   ```

8. Run the App  
   In the IDE terminal run the command `npm run dev` to start the app locally. If everything has been entered correctly the app should be avaolable at localhost:3000.


ARCHITECTURE AND TECHNICAL DECISIONS  

When creating this app I of course stuck to the recommended tech stack, using many elements of Vercel's kit in hopes that integration between all these libraries would be on the simpler/more streamlined side.  For the frontend I chose NextJS, ShadCN and TailwindCSS. To handle the ChatUI I decided to use Vercel AI Elements. For the database I chose Supabase. Through Vercel's AI SDK agent I chose Google Gemini as my LLM, though I discovered later on that Varcel AI SDK streamlines the process of choosing AI models for me, so generating an API key directly through Google turned out to be unnecessary. Of course deployment would be done via Vercel for the reason mentioned above and it was the only recommended option according to the assignment.  

I decided to take an iterative approach to development of this app, in phases. Get things working generally first, then tailor them for a more focused purpose afterwards. Starting with a functional chat UI where I could see at least my inputs appear as chat bubble in the UI. Next came actual communication with the AI, followed by integrating Supabase in order for the AI to store data it deems noteworthy.

Some of the biggest technical hurdles and decisions appeared at this point in development. Namely, maintaining context vs token coonsumption. We want the AI to remember the context of the conversation it's been having with the user and store things it found noteworthy about them, but we also want to maximize efficiency with our use of tokens. In asking Claude for solutions, I settled on using tool calls as striking the right balance. The tool call I created of createProfileTool runs inside the POST request to the model and allows it to store/update data it thinks relevent in the moment (with somne isntruction modifications) as opposed to reviewing the conversation history _and then_ extracting profile information and storing in Supabase _as a second call_. The latter approach could quickly inflate use of tokens as conversation threads grow and is unsustainable in the long run.

With the basics out of the way, the next essential piece was creating user accounts as a way to identify multiple users so of course their profile data would be tied back to them. I decided this was the simplest way to address identification and data persistence. Luckily this integration is already built into Suapabase's kit, so I took full advantage of that. Also I integrated a protected route approach into the app so that a user had to be logged in to chat with the AI and only had acess to their own profile data via any API calls. After this, Displaying profile data was simple, with some help from Claude to create the regex I wanted to disply props and actegories the AI noted in English rather than camel casing. At this point it was also time to focus on iterating the AI chat bot into a proper AP Bio exam tutor, so I also began making changes to the model and becoming more specific on what the AI should take note of and recall from the profile when assisting the user. Reading the profile and appending past observations to its instructions with help it become more specific and as a result better at its goal of helping the user pass their test. Some example factors taken into account are test date, hints before answers, and anxiety level.

Once I'd gotten the profile display working to the point I was satisfied with, I realized clicking back to the chat UI takes me back to a blank conversation. Clearly I was missing chat persistence and here I had to make another technical decision: How to handle this? I could store the chat thread as a global variable so it wouldn't disappear when coming back from the profile display page, but when the user logs out then returns later they'd suffer the same problem. The chat thread had to be stored in the database. I ultimately decided it was most efficient to make small database create calls in the AI's POST route so that the user's input and the AI's response are captured without making an entirely separate (or potentially massive at least when posting) call. Claude also helped me with the setMessages method to "pre-load" the chat history if it exists, creating a seamless chat experience for the user. As far as _reading_ that chat history from the database after a certain point, that certainly would need to be addressed in the near future with some sort of approach but as a direct call to Supabase, it avoids token consumption.

The last touches were handling loading states and error handling feedback. This was very easy to do thanks to Vercel's useChat hook having a status prop built in, so I set the disabled status of the PromptInput component to mach the "submitted" and "streaming" status states. Alerts were simple to create. Claude did help me with avoiding page flashes when I wanted my Spinner component to behave more seamlessly as data was loaded. Deploying to Vercel was relatively simple, though I did run into a few hiccups with unused components when running `npm run build`.

Much of my correspondence with Claude consists of getting a bearing for these libraries and understanding their feature sets vs the "vanilla ReactJS" via Vite and Node/Express experience I'm accustomed to. Though I relied on the Claude for a majority of this feature development (again, especially not being very familiar with these libraries), I know better of course than to blindly copy/paste generated code, and was always sure to evaluate it's output against my experience, getting plenty of explanation and clarification (in some cases correcting it as a result when it used outdated methods or I had already written code following best practices). Overall it was a great experience and I learned _a lot_ about NextJS and Ai integration especially.
