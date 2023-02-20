// Code generated by entc, DO NOT EDIT.

package ent

import "context"

func (a *Action) ActionToUser(ctx context.Context) (*User, error) {
	result, err := a.Edges.ActionToUserOrErr()
	if IsNotLoaded(err) {
		result, err = a.QueryActionToUser().Only(ctx)
	}
	return result, MaskNotFound(err)
}

func (a *Action) ActionToServiceAccount(ctx context.Context) (*ServiceAccount, error) {
	result, err := a.Edges.ActionToServiceAccountOrErr()
	if IsNotLoaded(err) {
		result, err = a.QueryActionToServiceAccount().Only(ctx)
	}
	return result, MaskNotFound(err)
}

func (c *Competition) CompetitionToTeams(ctx context.Context) ([]*Team, error) {
	result, err := c.Edges.CompetitionToTeamsOrErr()
	if IsNotLoaded(err) {
		result, err = c.QueryCompetitionToTeams().All(ctx)
	}
	return result, err
}

func (c *Competition) CompetitionToProvider(ctx context.Context) (*Provider, error) {
	result, err := c.Edges.CompetitionToProviderOrErr()
	if IsNotLoaded(err) {
		result, err = c.QueryCompetitionToProvider().Only(ctx)
	}
	return result, err
}

func (pr *Provider) ProviderToCompetitions(ctx context.Context) ([]*Competition, error) {
	result, err := pr.Edges.ProviderToCompetitionsOrErr()
	if IsNotLoaded(err) {
		result, err = pr.QueryProviderToCompetitions().All(ctx)
	}
	return result, err
}

func (sa *ServiceAccount) ServiceAccountToToken(ctx context.Context) ([]*ServiceToken, error) {
	result, err := sa.Edges.ServiceAccountToTokenOrErr()
	if IsNotLoaded(err) {
		result, err = sa.QueryServiceAccountToToken().All(ctx)
	}
	return result, err
}

func (sa *ServiceAccount) ServiceAccountToActions(ctx context.Context) ([]*Action, error) {
	result, err := sa.Edges.ServiceAccountToActionsOrErr()
	if IsNotLoaded(err) {
		result, err = sa.QueryServiceAccountToActions().All(ctx)
	}
	return result, err
}

func (st *ServiceToken) TokenToServiceAccount(ctx context.Context) (*ServiceAccount, error) {
	result, err := st.Edges.TokenToServiceAccountOrErr()
	if IsNotLoaded(err) {
		result, err = st.QueryTokenToServiceAccount().Only(ctx)
	}
	return result, err
}

func (t *Team) TeamToCompetition(ctx context.Context) (*Competition, error) {
	result, err := t.Edges.TeamToCompetitionOrErr()
	if IsNotLoaded(err) {
		result, err = t.QueryTeamToCompetition().Only(ctx)
	}
	return result, err
}

func (t *Team) TeamToVmObjects(ctx context.Context) ([]*VmObject, error) {
	result, err := t.Edges.TeamToVmObjectsOrErr()
	if IsNotLoaded(err) {
		result, err = t.QueryTeamToVmObjects().All(ctx)
	}
	return result, err
}

func (t *Team) TeamToUsers(ctx context.Context) ([]*User, error) {
	result, err := t.Edges.TeamToUsersOrErr()
	if IsNotLoaded(err) {
		result, err = t.QueryTeamToUsers().All(ctx)
	}
	return result, err
}

func (t *Token) TokenToUser(ctx context.Context) (*User, error) {
	result, err := t.Edges.TokenToUserOrErr()
	if IsNotLoaded(err) {
		result, err = t.QueryTokenToUser().Only(ctx)
	}
	return result, err
}

func (u *User) UserToTeam(ctx context.Context) (*Team, error) {
	result, err := u.Edges.UserToTeamOrErr()
	if IsNotLoaded(err) {
		result, err = u.QueryUserToTeam().Only(ctx)
	}
	return result, MaskNotFound(err)
}

func (u *User) UserToToken(ctx context.Context) ([]*Token, error) {
	result, err := u.Edges.UserToTokenOrErr()
	if IsNotLoaded(err) {
		result, err = u.QueryUserToToken().All(ctx)
	}
	return result, err
}

func (u *User) UserToActions(ctx context.Context) ([]*Action, error) {
	result, err := u.Edges.UserToActionsOrErr()
	if IsNotLoaded(err) {
		result, err = u.QueryUserToActions().All(ctx)
	}
	return result, err
}

func (vo *VmObject) VmObjectToTeam(ctx context.Context) (*Team, error) {
	result, err := vo.Edges.VmObjectToTeamOrErr()
	if IsNotLoaded(err) {
		result, err = vo.QueryVmObjectToTeam().Only(ctx)
	}
	return result, MaskNotFound(err)
}
