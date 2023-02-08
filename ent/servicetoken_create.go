// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/BradHacker/compsole/ent/serviceaccount"
	"github.com/BradHacker/compsole/ent/servicetoken"
	"github.com/google/uuid"
)

// ServiceTokenCreate is the builder for creating a ServiceToken entity.
type ServiceTokenCreate struct {
	config
	mutation *ServiceTokenMutation
	hooks    []Hook
}

// SetToken sets the "token" field.
func (stc *ServiceTokenCreate) SetToken(s string) *ServiceTokenCreate {
	stc.mutation.SetToken(s)
	return stc
}

// SetRefreshToken sets the "refresh_token" field.
func (stc *ServiceTokenCreate) SetRefreshToken(s string) *ServiceTokenCreate {
	stc.mutation.SetRefreshToken(s)
	return stc
}

// SetIssuedAt sets the "issued_at" field.
func (stc *ServiceTokenCreate) SetIssuedAt(i int64) *ServiceTokenCreate {
	stc.mutation.SetIssuedAt(i)
	return stc
}

// SetID sets the "id" field.
func (stc *ServiceTokenCreate) SetID(u uuid.UUID) *ServiceTokenCreate {
	stc.mutation.SetID(u)
	return stc
}

// SetNillableID sets the "id" field if the given value is not nil.
func (stc *ServiceTokenCreate) SetNillableID(u *uuid.UUID) *ServiceTokenCreate {
	if u != nil {
		stc.SetID(*u)
	}
	return stc
}

// SetTokenToServiceAccountID sets the "TokenToServiceAccount" edge to the ServiceAccount entity by ID.
func (stc *ServiceTokenCreate) SetTokenToServiceAccountID(id uuid.UUID) *ServiceTokenCreate {
	stc.mutation.SetTokenToServiceAccountID(id)
	return stc
}

// SetTokenToServiceAccount sets the "TokenToServiceAccount" edge to the ServiceAccount entity.
func (stc *ServiceTokenCreate) SetTokenToServiceAccount(s *ServiceAccount) *ServiceTokenCreate {
	return stc.SetTokenToServiceAccountID(s.ID)
}

// Mutation returns the ServiceTokenMutation object of the builder.
func (stc *ServiceTokenCreate) Mutation() *ServiceTokenMutation {
	return stc.mutation
}

// Save creates the ServiceToken in the database.
func (stc *ServiceTokenCreate) Save(ctx context.Context) (*ServiceToken, error) {
	var (
		err  error
		node *ServiceToken
	)
	stc.defaults()
	if len(stc.hooks) == 0 {
		if err = stc.check(); err != nil {
			return nil, err
		}
		node, err = stc.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*ServiceTokenMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = stc.check(); err != nil {
				return nil, err
			}
			stc.mutation = mutation
			if node, err = stc.sqlSave(ctx); err != nil {
				return nil, err
			}
			mutation.id = &node.ID
			mutation.done = true
			return node, err
		})
		for i := len(stc.hooks) - 1; i >= 0; i-- {
			if stc.hooks[i] == nil {
				return nil, fmt.Errorf("ent: uninitialized hook (forgotten import ent/runtime?)")
			}
			mut = stc.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, stc.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX calls Save and panics if Save returns an error.
func (stc *ServiceTokenCreate) SaveX(ctx context.Context) *ServiceToken {
	v, err := stc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (stc *ServiceTokenCreate) Exec(ctx context.Context) error {
	_, err := stc.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (stc *ServiceTokenCreate) ExecX(ctx context.Context) {
	if err := stc.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (stc *ServiceTokenCreate) defaults() {
	if _, ok := stc.mutation.ID(); !ok {
		v := servicetoken.DefaultID()
		stc.mutation.SetID(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (stc *ServiceTokenCreate) check() error {
	if _, ok := stc.mutation.Token(); !ok {
		return &ValidationError{Name: "token", err: errors.New(`ent: missing required field "ServiceToken.token"`)}
	}
	if _, ok := stc.mutation.RefreshToken(); !ok {
		return &ValidationError{Name: "refresh_token", err: errors.New(`ent: missing required field "ServiceToken.refresh_token"`)}
	}
	if _, ok := stc.mutation.IssuedAt(); !ok {
		return &ValidationError{Name: "issued_at", err: errors.New(`ent: missing required field "ServiceToken.issued_at"`)}
	}
	if _, ok := stc.mutation.TokenToServiceAccountID(); !ok {
		return &ValidationError{Name: "TokenToServiceAccount", err: errors.New(`ent: missing required edge "ServiceToken.TokenToServiceAccount"`)}
	}
	return nil
}

func (stc *ServiceTokenCreate) sqlSave(ctx context.Context) (*ServiceToken, error) {
	_node, _spec := stc.createSpec()
	if err := sqlgraph.CreateNode(ctx, stc.driver, _spec); err != nil {
		if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{err.Error(), err}
		}
		return nil, err
	}
	if _spec.ID.Value != nil {
		if id, ok := _spec.ID.Value.(*uuid.UUID); ok {
			_node.ID = *id
		} else if err := _node.ID.Scan(_spec.ID.Value); err != nil {
			return nil, err
		}
	}
	return _node, nil
}

func (stc *ServiceTokenCreate) createSpec() (*ServiceToken, *sqlgraph.CreateSpec) {
	var (
		_node = &ServiceToken{config: stc.config}
		_spec = &sqlgraph.CreateSpec{
			Table: servicetoken.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeUUID,
				Column: servicetoken.FieldID,
			},
		}
	)
	if id, ok := stc.mutation.ID(); ok {
		_node.ID = id
		_spec.ID.Value = &id
	}
	if value, ok := stc.mutation.Token(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: servicetoken.FieldToken,
		})
		_node.Token = value
	}
	if value, ok := stc.mutation.RefreshToken(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: servicetoken.FieldRefreshToken,
		})
		_node.RefreshToken = value
	}
	if value, ok := stc.mutation.IssuedAt(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeInt64,
			Value:  value,
			Column: servicetoken.FieldIssuedAt,
		})
		_node.IssuedAt = value
	}
	if nodes := stc.mutation.TokenToServiceAccountIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   servicetoken.TokenToServiceAccountTable,
			Columns: []string{servicetoken.TokenToServiceAccountColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: serviceaccount.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_node.service_account_service_account_to_token = &nodes[0]
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// ServiceTokenCreateBulk is the builder for creating many ServiceToken entities in bulk.
type ServiceTokenCreateBulk struct {
	config
	builders []*ServiceTokenCreate
}

// Save creates the ServiceToken entities in the database.
func (stcb *ServiceTokenCreateBulk) Save(ctx context.Context) ([]*ServiceToken, error) {
	specs := make([]*sqlgraph.CreateSpec, len(stcb.builders))
	nodes := make([]*ServiceToken, len(stcb.builders))
	mutators := make([]Mutator, len(stcb.builders))
	for i := range stcb.builders {
		func(i int, root context.Context) {
			builder := stcb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*ServiceTokenMutation)
				if !ok {
					return nil, fmt.Errorf("unexpected mutation type %T", m)
				}
				if err := builder.check(); err != nil {
					return nil, err
				}
				builder.mutation = mutation
				nodes[i], specs[i] = builder.createSpec()
				var err error
				if i < len(mutators)-1 {
					_, err = mutators[i+1].Mutate(root, stcb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, stcb.driver, spec); err != nil {
						if sqlgraph.IsConstraintError(err) {
							err = &ConstraintError{err.Error(), err}
						}
					}
				}
				if err != nil {
					return nil, err
				}
				mutation.id = &nodes[i].ID
				mutation.done = true
				return nodes[i], nil
			})
			for i := len(builder.hooks) - 1; i >= 0; i-- {
				mut = builder.hooks[i](mut)
			}
			mutators[i] = mut
		}(i, ctx)
	}
	if len(mutators) > 0 {
		if _, err := mutators[0].Mutate(ctx, stcb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (stcb *ServiceTokenCreateBulk) SaveX(ctx context.Context) []*ServiceToken {
	v, err := stcb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (stcb *ServiceTokenCreateBulk) Exec(ctx context.Context) error {
	_, err := stcb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (stcb *ServiceTokenCreateBulk) ExecX(ctx context.Context) {
	if err := stcb.Exec(ctx); err != nil {
		panic(err)
	}
}