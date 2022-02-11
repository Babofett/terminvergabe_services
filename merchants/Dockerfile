FROM python:3.8

WORKDIR /app

RUN apt-get clean

RUN apt-get update && \
    yes | apt-get upgrade

RUN apt-get -y install nginx \
    && apt-get -y install python3-dev \
    && apt-get -y install build-essential

COPY requirements.txt .

RUN pip install -r requirements.txt # Write Flask in this file

COPY . /app

RUN chmod -R ugo+rw /app/images

COPY nginx.conf /etc/nginx
RUN chmod +x ./start.sh
CMD ["./start.sh"]