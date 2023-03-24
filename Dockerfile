# refrence:
# https://blog.logrocket.com/containerized-development-nestjs-docker/

FROM node:18.12.1-alpine as development

WORKDIR /srv/

COPY . .

# Remove husky install since git is not existed in the image
# RUN node scripts/set-script prepare ''
RUN npm install

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# -------------------- break point --------------------

FROM node:14.17.4-alpine as production

WORKDIR /srv/

COPY package.json ./
COPY package-lock.json ./
COPY next.config.mjs ./
COPY src/env.mjs ./src/
COPY public ./public
COPY prisma ./prisma

COPY --from=development /srv/node_modules ./node_modules
COPY --from=development /srv/.next ./.next

# RUN node scripts/set-script prepare ''
RUN npm ci

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV NEXT_TELEMETRY_DISABLED 1

# # install node-prune (https://github.com/tj/node-prune)
# RUN apk --no-cache add curl bash
# RUN npx node-prune

WORKDIR /srv/

EXPOSE 3000

CMD ["npm", "start"]