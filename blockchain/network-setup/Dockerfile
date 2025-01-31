FROM node:20-alpine3.18

ARG SC_DEPLOYMENT_MNEMONIC
ENV DEV_MNEMONIC=${SC_DEPLOYMENT_MNEMONIC}

ARG SC_TOKEN_NAME
ENV TOKEN_NAME=${SC_TOKEN_NAME}

ARG SC_TOKEN_SYMBOL
ENV TOKEN_SYMBOL=${SC_TOKEN_SYMBOL}

WORKDIR /usr/src/app
COPY . .

RUN apk update && apk add --no-cache bash git openssh-client
RUN git clone https://github.com/fraunhofer-iml/nft-folder-smart-contracts.git

RUN chmod +x deploy-smart-contracts.sh ./wait-for-it.sh

ENTRYPOINT ["./deploy-smart-contracts.sh"]
