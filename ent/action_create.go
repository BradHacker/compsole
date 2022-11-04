// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/BradHacker/compsole/ent/action"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/google/uuid"
)

// ActionCreate is the builder for creating a Action entity.
type ActionCreate struct {
	config
	mutation *ActionMutation
	hooks    []Hook
}

// SetIPAddress sets the "ip_address" field.
func (ac *ActionCreate) SetIPAddress(s string) *ActionCreate {
	ac.mutation.SetIPAddress(s)
	return ac
}

// SetNillableIPAddress sets the "ip_address" field if the given value is not nil.
func (ac *ActionCreate) SetNillableIPAddress(s *string) *ActionCreate {
	if s != nil {
		ac.SetIPAddress(*s)
	}
	return ac
}

// SetType sets the "type" field.
func (ac *ActionCreate) SetType(a action.Type) *ActionCreate {
	ac.mutation.SetType(a)
	return ac
}

// SetMessage sets the "message" field.
func (ac *ActionCreate) SetMessage(s string) *ActionCreate {
	ac.mutation.SetMessage(s)
	return ac
}

// SetPerformedAt sets the "performed_at" field.
func (ac *ActionCreate) SetPerformedAt(t time.Time) *ActionCreate {
	ac.mutation.SetPerformedAt(t)
	return ac
}

// SetNillablePerformedAt sets the "performed_at" field if the given value is not nil.
func (ac *ActionCreate) SetNillablePerformedAt(t *time.Time) *ActionCreate {
	if t != nil {
		ac.SetPerformedAt(*t)
	}
	return ac
}

// SetID sets the "id" field.
func (ac *ActionCreate) SetID(u uuid.UUID) *ActionCreate {
	ac.mutation.SetID(u)
	return ac
}

// SetNillableID sets the "id" field if the given value is not nil.
func (ac *ActionCreate) SetNillableID(u *uuid.UUID) *ActionCreate {
	if u != nil {
		ac.SetID(*u)
	}
	return ac
}

// SetActionToUserID sets the "ActionToUser" edge to the User entity by ID.
func (ac *ActionCreate) SetActionToUserID(id uuid.UUID) *ActionCreate {
	ac.mutation.SetActionToUserID(id)
	return ac
}

// SetNillableActionToUserID sets the "ActionToUser" edge to the User entity by ID if the given value is not nil.
func (ac *ActionCreate) SetNillableActionToUserID(id *uuid.UUID) *ActionCreate {
	if id != nil {
		ac = ac.SetActionToUserID(*id)
	}
	return ac
}

// SetActionToUser sets the "ActionToUser" edge to the User entity.
func (ac *ActionCreate) SetActionToUser(u *User) *ActionCreate {
	return ac.SetActionToUserID(u.ID)
}

// Mutation returns the ActionMutation object of the builder.
func (ac *ActionCreate) Mutation() *ActionMutation {
	return ac.mutation
}

// Save creates the Action in the database.
func (ac *ActionCreate) Save(ctx context.Context) (*Action, error) {
	var (
		err  error
		node *Action
	)
	ac.defaults()
	if len(ac.hooks) == 0 {
		if err = ac.check(); err != nil {
			return nil, err
		}
		node, err = ac.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*ActionMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = ac.check(); err != nil {
				return nil, err
			}
			ac.mutation = mutation
			if node, err = ac.sqlSave(ctx); err != nil {
				return nil, err
			}
			mutation.id = &node.ID
			mutation.done = true
			return node, err
		})
		for i := len(ac.hooks) - 1; i >= 0; i-- {
			if ac.hooks[i] == nil {
				return nil, fmt.Errorf("ent: uninitialized hook (forgotten import ent/runtime?)")
			}
			mut = ac.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, ac.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX calls Save and panics if Save returns an error.
func (ac *ActionCreate) SaveX(ctx context.Context) *Action {
	v, err := ac.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (ac *ActionCreate) Exec(ctx context.Context) error {
	_, err := ac.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (ac *ActionCreate) ExecX(ctx context.Context) {
	if err := ac.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (ac *ActionCreate) defaults() {
	if _, ok := ac.mutation.IPAddress(); !ok {
		v := action.DefaultIPAddress
		ac.mutation.SetIPAddress(v)
	}
	if _, ok := ac.mutation.PerformedAt(); !ok {
		v := action.DefaultPerformedAt()
		ac.mutation.SetPerformedAt(v)
	}
	if _, ok := ac.mutation.ID(); !ok {
		v := action.DefaultID()
		ac.mutation.SetID(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (ac *ActionCreate) check() error {
	if _, ok := ac.mutation.IPAddress(); !ok {
		return &ValidationError{Name: "ip_address", err: errors.New(`ent: missing required field "Action.ip_address"`)}
	}
	if _, ok := ac.mutation.GetType(); !ok {
		return &ValidationError{Name: "type", err: errors.New(`ent: missing required field "Action.type"`)}
	}
	if v, ok := ac.mutation.GetType(); ok {
		if err := action.TypeValidator(v); err != nil {
			return &ValidationError{Name: "type", err: fmt.Errorf(`ent: validator failed for field "Action.type": %w`, err)}
		}
	}
	if _, ok := ac.mutation.Message(); !ok {
		return &ValidationError{Name: "message", err: errors.New(`ent: missing required field "Action.message"`)}
	}
	if _, ok := ac.mutation.PerformedAt(); !ok {
		return &ValidationError{Name: "performed_at", err: errors.New(`ent: missing required field "Action.performed_at"`)}
	}
	return nil
}

func (ac *ActionCreate) sqlSave(ctx context.Context) (*Action, error) {
	_node, _spec := ac.createSpec()
	if err := sqlgraph.CreateNode(ctx, ac.driver, _spec); err != nil {
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

func (ac *ActionCreate) createSpec() (*Action, *sqlgraph.CreateSpec) {
	var (
		_node = &Action{config: ac.config}
		_spec = &sqlgraph.CreateSpec{
			Table: action.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeUUID,
				Column: action.FieldID,
			},
		}
	)
	if id, ok := ac.mutation.ID(); ok {
		_node.ID = id
		_spec.ID.Value = &id
	}
	if value, ok := ac.mutation.IPAddress(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: action.FieldIPAddress,
		})
		_node.IPAddress = value
	}
	if value, ok := ac.mutation.GetType(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeEnum,
			Value:  value,
			Column: action.FieldType,
		})
		_node.Type = value
	}
	if value, ok := ac.mutation.Message(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: action.FieldMessage,
		})
		_node.Message = value
	}
	if value, ok := ac.mutation.PerformedAt(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeTime,
			Value:  value,
			Column: action.FieldPerformedAt,
		})
		_node.PerformedAt = value
	}
	if nodes := ac.mutation.ActionToUserIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   action.ActionToUserTable,
			Columns: []string{action.ActionToUserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: user.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_node.action_action_to_user = &nodes[0]
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// ActionCreateBulk is the builder for creating many Action entities in bulk.
type ActionCreateBulk struct {
	config
	builders []*ActionCreate
}

// Save creates the Action entities in the database.
func (acb *ActionCreateBulk) Save(ctx context.Context) ([]*Action, error) {
	specs := make([]*sqlgraph.CreateSpec, len(acb.builders))
	nodes := make([]*Action, len(acb.builders))
	mutators := make([]Mutator, len(acb.builders))
	for i := range acb.builders {
		func(i int, root context.Context) {
			builder := acb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*ActionMutation)
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
					_, err = mutators[i+1].Mutate(root, acb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, acb.driver, spec); err != nil {
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
		if _, err := mutators[0].Mutate(ctx, acb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (acb *ActionCreateBulk) SaveX(ctx context.Context) []*Action {
	v, err := acb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (acb *ActionCreateBulk) Exec(ctx context.Context) error {
	_, err := acb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (acb *ActionCreateBulk) ExecX(ctx context.Context) {
	if err := acb.Exec(ctx); err != nil {
		panic(err)
	}
}
