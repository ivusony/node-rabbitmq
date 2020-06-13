#FROM need to be updated

FROM mhart/alpine-node:latest

RUN mkdir /var/ms-listener

WORKDIR /var/ms-listener

RUN git init && \
	git remote add origin https://harpia:581R-Vubhb2hTsYokSE6@gitlab.sattrakt.net/f1/ms-listener.git && \
	git fetch --all && \
	git reset --hard origin/master && \
	git pull origin master


WORKDIR /var/ms-listener/src/

EXPOSE 9000

COPY entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["entrypoint.sh"]
