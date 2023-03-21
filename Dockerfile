# refrence:
# https://blog.logrocket.com/containerized-development-nestjs-docker/

FROM node:18.12.1-alpine as development

WORKDIR /srv/

COPY . .

# Remove husky install since git is not existed in the image
RUN node scripts/set-script prepare ''
RUN npm ci

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run db
RUN npm run build

# -------------------- break point --------------------

FROM node:14.17.4-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/

COPY package.json ./

# Just copy the app directory and install the dependencies seems a good idea
# But I am afraid that the lock file will not work. So We keep the yarn workspaces structure
COPY --from=development /srv/.next ./.next

RUN node scripts/set-script prepare ''
RUN npm ci --omit=dev

# install node-prune (https://github.com/tj/node-prune)
RUN apk --no-cache add curl bash
RUN npx node-prune
RUN npx node-prune app/node_modules

WORKDIR /srv/

EXPOSE 3000

CMD ["npm", "start"]