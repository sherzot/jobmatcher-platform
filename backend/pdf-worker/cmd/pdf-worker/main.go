package main

import (
	"log"
	"os"
	"time"
)

func main() {
	log.Println("pdf-worker started…")
	_ = os.Getenv("NATS_URL")
	// TODO: NATS subscribe("resume.pdf.requested") -> Gotenberg -> S3 -> publish("resume.pdf.generated")
	for {
		time.Sleep(30 * time.Second)
		log.Println("pdf-worker heartbeat")
	}
}
