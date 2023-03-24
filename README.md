## ChatGTP Client

![screenshot](./.github/docs/screenshot.png)

### Prerequisites

- MongoDB
  - Using [MongoDB Atlas](https://www.mongodb.com/)
  - Or run `docker-compose up -d` to start a MongoDB server locally
- OpenAI API key

<!-- ### Start with the Docker image


Replace below environment variables and run

```
docker run \
  --name chatgpt \
  -p 3000:3000 \
  -e DATABASE_URL=<mongodb://USERNAME:PASSWORD@HOST/DATABASE> \
  -e NEXTAUTH_SECRET=<any_string> \
  -e OPENAI_API_KEY=<key> \
  -it ghcr.io/pong420/chat-gpt-client:latest
``` -->

### Development

1. Create `.env.development.local` at the project root. Copy the content from `.env` and replace the corresponding variables

2. Install packages and setup

   ```
   npm ci
   npm run db
   ```

3. Start development

   ```
   npm run dev
   ```

4. Go to http://localhost:3000/admin and create a user. The admin page and related API only available in the development

5. Go to http://localhost:3000/ and sign in.
