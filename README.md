## ChatGTP Client

![screenshot](./.github/docs/screenshot.png)

### Getting started

1. If you do not have MongoDB, you can start with docker-compose

   ```
   docker-compose up -d
   ```

2. Copy and rename the `.env.example` to `.env`. Assign your OpenAI API key to `OPENAI_API_KEY`. If you are using your own MongoDB, remember to edit `DATABASE_URL`.

3. Install packages and setup

   ```
   npm ci
   npm run db
   ```

4. Start development

   ```
   npm run dev
   ```

5. Go to http://localhost:3000/admin and create a user. The admin page and related API only available in the development

6. Go to http://localhost:3000/ and sign in.

### Deployment

- The Dokerfile is not ready
- You can set up Vercel and MongoDB Atlas, and they are free.
