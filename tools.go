//go:build tools
// +build tools

package tools

import (
	_ "entgo.io/ent/cmd/ent"
	_ "entgo.io/ent/cmd/internal/printer"
	_ "github.com/99designs/gqlgen"
)
