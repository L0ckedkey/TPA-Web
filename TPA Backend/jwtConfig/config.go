package config

import (
	"github.com/golang-jwt/jwt/v4"
)

var JWT_KEY = []byte(";OEJFGBOIebgoweibgoweigb")

type JWTClaim struct {
	Name             string
	ID               int
	Email            string
	Role             string
	NewsLetterStatus string
	PhoneNumber      string
	jwt.RegisteredClaims
}

type JWTClaimSeller struct {
	Name             string
	ID               int
	Email            string
	Role             string
	ShopID           int
	NewsLetterStatus string
	PhoneNumber      string
	jwt.RegisteredClaims
}

type ResponseSeller struct {
	Key     string
	Payload JWTClaimSeller
}
