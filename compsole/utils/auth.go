package utils

import (
	"context"
	"fmt"

	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/BradHacker/compsole/ent/vmobject"
)

func UserCanAccessVM(ctx context.Context, entVmObject *ent.VmObject, entUser *ent.User) (bool, error) {
	if entUser.Role != user.RoleADMIN {
		canAccessVm, err := entUser.QueryUserToTeam().QueryTeamToVmObjects().Where(vmobject.IDEQ(entVmObject.ID)).Exist(ctx)
		if err != nil {
			return false, fmt.Errorf("failed to query vm object from user")
		}
		if !canAccessVm {
			return false, nil
		}
	}
	return true, nil
}
