// Code generated by entc, DO NOT EDIT.

package ent

import (
	"time"

	"github.com/BradHacker/compsole/ent/action"
	"github.com/BradHacker/compsole/ent/competition"
	"github.com/BradHacker/compsole/ent/provider"
	"github.com/BradHacker/compsole/ent/schema"
	"github.com/BradHacker/compsole/ent/serviceaccount"
	"github.com/BradHacker/compsole/ent/servicetoken"
	"github.com/BradHacker/compsole/ent/team"
	"github.com/BradHacker/compsole/ent/token"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/BradHacker/compsole/ent/vmobject"
	"github.com/google/uuid"
)

// The init function reads all schema descriptors with runtime code
// (default values, validators, hooks and policies) and stitches it
// to their package variables.
func init() {
	actionFields := schema.Action{}.Fields()
	_ = actionFields
	// actionDescIPAddress is the schema descriptor for ip_address field.
	actionDescIPAddress := actionFields[1].Descriptor()
	// action.DefaultIPAddress holds the default value on creation for the ip_address field.
	action.DefaultIPAddress = actionDescIPAddress.Default.(string)
	// actionDescPerformedAt is the schema descriptor for performed_at field.
	actionDescPerformedAt := actionFields[4].Descriptor()
	// action.DefaultPerformedAt holds the default value on creation for the performed_at field.
	action.DefaultPerformedAt = actionDescPerformedAt.Default.(func() time.Time)
	// actionDescID is the schema descriptor for id field.
	actionDescID := actionFields[0].Descriptor()
	// action.DefaultID holds the default value on creation for the id field.
	action.DefaultID = actionDescID.Default.(func() uuid.UUID)
	competitionFields := schema.Competition{}.Fields()
	_ = competitionFields
	// competitionDescID is the schema descriptor for id field.
	competitionDescID := competitionFields[0].Descriptor()
	// competition.DefaultID holds the default value on creation for the id field.
	competition.DefaultID = competitionDescID.Default.(func() uuid.UUID)
	providerFields := schema.Provider{}.Fields()
	_ = providerFields
	// providerDescID is the schema descriptor for id field.
	providerDescID := providerFields[0].Descriptor()
	// provider.DefaultID holds the default value on creation for the id field.
	provider.DefaultID = providerDescID.Default.(func() uuid.UUID)
	serviceaccountFields := schema.ServiceAccount{}.Fields()
	_ = serviceaccountFields
	// serviceaccountDescID is the schema descriptor for id field.
	serviceaccountDescID := serviceaccountFields[0].Descriptor()
	// serviceaccount.DefaultID holds the default value on creation for the id field.
	serviceaccount.DefaultID = serviceaccountDescID.Default.(func() uuid.UUID)
	servicetokenFields := schema.ServiceToken{}.Fields()
	_ = servicetokenFields
	// servicetokenDescID is the schema descriptor for id field.
	servicetokenDescID := servicetokenFields[0].Descriptor()
	// servicetoken.DefaultID holds the default value on creation for the id field.
	servicetoken.DefaultID = servicetokenDescID.Default.(func() uuid.UUID)
	teamFields := schema.Team{}.Fields()
	_ = teamFields
	// teamDescID is the schema descriptor for id field.
	teamDescID := teamFields[0].Descriptor()
	// team.DefaultID holds the default value on creation for the id field.
	team.DefaultID = teamDescID.Default.(func() uuid.UUID)
	tokenFields := schema.Token{}.Fields()
	_ = tokenFields
	// tokenDescID is the schema descriptor for id field.
	tokenDescID := tokenFields[0].Descriptor()
	// token.DefaultID holds the default value on creation for the id field.
	token.DefaultID = tokenDescID.Default.(func() uuid.UUID)
	userFields := schema.User{}.Fields()
	_ = userFields
	// userDescFirstName is the schema descriptor for first_name field.
	userDescFirstName := userFields[3].Descriptor()
	// user.DefaultFirstName holds the default value on creation for the first_name field.
	user.DefaultFirstName = userDescFirstName.Default.(string)
	// userDescLastName is the schema descriptor for last_name field.
	userDescLastName := userFields[4].Descriptor()
	// user.DefaultLastName holds the default value on creation for the last_name field.
	user.DefaultLastName = userDescLastName.Default.(string)
	// userDescID is the schema descriptor for id field.
	userDescID := userFields[0].Descriptor()
	// user.DefaultID holds the default value on creation for the id field.
	user.DefaultID = userDescID.Default.(func() uuid.UUID)
	vmobjectFields := schema.VmObject{}.Fields()
	_ = vmobjectFields
	// vmobjectDescLocked is the schema descriptor for locked field.
	vmobjectDescLocked := vmobjectFields[4].Descriptor()
	// vmobject.DefaultLocked holds the default value on creation for the locked field.
	vmobject.DefaultLocked = vmobjectDescLocked.Default.(bool)
	// vmobjectDescID is the schema descriptor for id field.
	vmobjectDescID := vmobjectFields[0].Descriptor()
	// vmobject.DefaultID holds the default value on creation for the id field.
	vmobject.DefaultID = vmobjectDescID.Default.(func() uuid.UUID)
}
