FROM golang:1.18.3-bullseye

RUN mkdir /app 
ADD . /app/
WORKDIR /app 

ENV PATH="${PATH}:/app"

RUN go mod download && go mod verify
RUN go build -o compsole_server server.go

CMD ["./compsole_server"]