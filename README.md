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
