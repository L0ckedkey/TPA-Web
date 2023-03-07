package model

type Chat struct {
	ID       int `pg:",pk,type:bigserial"`
	Sender   int
	Receiver int
	UUID     string
}

type CustomerServiceChat struct {
	ID     int `pg:",pk,type:bigserial"`
	Sender int
	UUID   string
}
