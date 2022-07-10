// Code generated by entc, DO NOT EDIT.

package ent

import "context"

func (c *Competition) CompetitionToTeams(ctx context.Context) ([]*Team, error) {
	result, err := c.Edges.CompetitionToTeamsOrErr()
	if IsNotLoaded(err) {
		result, err = c.QueryCompetitionToTeams().All(ctx)
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

func (vo *VmObject) VmObjectToTeam(ctx context.Context) (*Team, error) {
	result, err := vo.Edges.VmObjectToTeamOrErr()
	if IsNotLoaded(err) {
		result, err = vo.QueryVmObjectToTeam().Only(ctx)
	}
	return result, MaskNotFound(err)
}