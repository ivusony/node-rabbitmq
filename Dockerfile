FROM gitlab.sattrakt.net:5001/images/nodejs-alpine:13.2.0

MAINTAINER SAT-TRAKT D.O.O. <webmaster@stcable.net>

WORKDIR /var

RUN git init && \
	git remote add origin https://harpia:581R-Vubhb2hTsYokSE6@gitlab.sattrakt.net/vehicle-tracker/ms-listener.git && \
	git fetch --all && \
	git reset --hard origin/master && \
	git pull origin master

WORKDIR /var/ms-listener

EXPOSE 9000

COPY entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["entrypoint.sh"]
