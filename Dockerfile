FROM golang:1.23-bookworm AS builder
WORKDIR /app 
COPY go.mod go.sum ./
RUN go mod download && go mod verify
COPY . /app/
RUN --mount=type=cache,target="/root/.cache/go-build" \
    go build -o compsole_server server.go

FROM debian:bookworm
WORKDIR /app
COPY --from=builder /app/compsole_server .
CMD ["./compsole_server"]