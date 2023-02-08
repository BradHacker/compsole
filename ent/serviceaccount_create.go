// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/BradHacker/compsole/ent/action"
	"github.com/BradHacker/compsole/ent/serviceaccount"
	"github.com/BradHacker/compsole/ent/servicetoken"
	"github.com/google/uuid"
)

// ServiceAccountCreate is the builder for creating a ServiceAccount entity.
type ServiceAccountCreate struct {
	config
	mutation *ServiceAccountMutation
	hooks    []Hook
}

// SetDisplayName sets the "display_name" field.
func (sac *ServiceAccountCreate) SetDisplayName(s string) *ServiceAccountCreate {
	sac.mutation.SetDisplayName(s)
	return sac
}

// SetAPIKey sets the "api_key" field.
func (sac *ServiceAccountCreate) SetAPIKey(u uuid.UUID) *ServiceAccountCreate {
	sac.mutation.SetAPIKey(u)
	return sac
}

// SetAPISecret sets the "api_secret" field.
func (sac *ServiceAccountCreate) SetAPISecret(u uuid.UUID) *ServiceAccountCreate {
	sac.mutation.SetAPISecret(u)
	return sac
}

// SetActive sets the "active" field.
func (sac *ServiceAccountCreate) SetActive(b bool) *ServiceAccountCreate {
	sac.mutation.SetActive(b)
	return sac
}

// SetID sets the "id" field.
func (sac *ServiceAccountCreate) SetID(u uuid.UUID) *ServiceAccountCreate {
	sac.mutation.SetID(u)
	return sac
}

// SetNillableID sets the "id" field if the given value is not nil.
func (sac *ServiceAccountCreate) SetNillableID(u *uuid.UUID) *ServiceAccountCreate {
	if u != nil {
		sac.SetID(*u)
	}
	return sac
}

// AddServiceAccountToTokenIDs adds the "ServiceAccountToToken" edge to the ServiceToken entity by IDs.
func (sac *ServiceAccountCreate) AddServiceAccountToTokenIDs(ids ...uuid.UUID) *ServiceAccountCreate {
	sac.mutation.AddServiceAccountToTokenIDs(ids...)
	return sac
}

// AddServiceAccountToToken adds the "ServiceAccountToToken" edges to the ServiceToken entity.
func (sac *ServiceAccountCreate) AddServiceAccountToToken(s ...*ServiceToken) *ServiceAccountCreate {
	ids := make([]uuid.UUID, len(s))
	for i := range s {
		ids[i] = s[i].ID
	}
	return sac.AddServiceAccountToTokenIDs(ids...)
}

// AddServiceAccountToActionIDs adds the "ServiceAccountToActions" edge to the Action entity by IDs.
func (sac *ServiceAccountCreate) AddServiceAccountToActionIDs(ids ...uuid.UUID) *ServiceAccountCreate {
	sac.mutation.AddServiceAccountToActionIDs(ids...)
	return sac
}

// AddServiceAccountToActions adds the "ServiceAccountToActions" edges to the Action entity.
func (sac *ServiceAccountCreate) AddServiceAccountToActions(a ...*Action) *ServiceAccountCreate {
	ids := make([]uuid.UUID, len(a))
	for i := range a {
		ids[i] = a[i].ID
	}
	return sac.AddServiceAccountToActionIDs(ids...)
}

// Mutation returns the ServiceAccountMutation object of the builder.
func (sac *ServiceAccountCreate) Mutation() *ServiceAccountMutation {
	return sac.mutation
}

// Save creates the ServiceAccount in the database.
func (sac *ServiceAccountCreate) Save(ctx context.Context) (*ServiceAccount, error) {
	var (
		err  error
		node *ServiceAccount
	)
	sac.defaults()
	if len(sac.hooks) == 0 {
		if err = sac.check(); err != nil {
			return nil, err
		}
		node, err = sac.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*ServiceAccountMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = sac.check(); err != nil {
				return nil, err
			}
			sac.mutation = mutation
			if node, err = sac.sqlSave(ctx); err != nil {
				return nil, err
			}
			mutation.id = &node.ID
			mutation.done = true
			return node, err
		})
		for i := len(sac.hooks) - 1; i >= 0; i-- {
			if sac.hooks[i] == nil {
				return nil, fmt.Errorf("ent: uninitialized hook (forgotten import ent/runtime?)")
			}
			mut = sac.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, sac.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX calls Save and panics if Save returns an error.
func (sac *ServiceAccountCreate) SaveX(ctx context.Context) *ServiceAccount {
	v, err := sac.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (sac *ServiceAccountCreate) Exec(ctx context.Context) error {
	_, err := sac.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (sac *ServiceAccountCreate) ExecX(ctx context.Context) {
	if err := sac.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (sac *ServiceAccountCreate) defaults() {
	if _, ok := sac.mutation.ID(); !ok {
		v := serviceaccount.DefaultID()
		sac.mutation.SetID(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (sac *ServiceAccountCreate) check() error {
	if _, ok := sac.mutation.DisplayName(); !ok {
		return &ValidationError{Name: "display_name", err: errors.New(`ent: missing required field "ServiceAccount.display_name"`)}
	}
	if _, ok := sac.mutation.APIKey(); !ok {
		return &ValidationError{Name: "api_key", err: errors.New(`ent: missing required field "ServiceAccount.api_key"`)}
	}
	if _, ok := sac.mutation.APISecret(); !ok {
		return &ValidationError{Name: "api_secret", err: errors.New(`ent: missing required field "ServiceAccount.api_secret"`)}
	}
	if _, ok := sac.mutation.Active(); !ok {
		return &ValidationError{Name: "active", err: errors.New(`ent: missing required field "ServiceAccount.active"`)}
	}
	return nil
}

func (sac *ServiceAccountCreate) sqlSave(ctx context.Context) (*ServiceAccount, error) {
	_node, _spec := sac.createSpec()
	if err := sqlgraph.CreateNode(ctx, sac.driver, _spec); err != nil {
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

func (sac *ServiceAccountCreate) createSpec() (*ServiceAccount, *sqlgraph.CreateSpec) {
	var (
		_node = &ServiceAccount{config: sac.config}
		_spec = &sqlgraph.CreateSpec{
			Table: serviceaccount.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeUUID,
				Column: serviceaccount.FieldID,
			},
		}
	)
	if id, ok := sac.mutation.ID(); ok {
		_node.ID = id
		_spec.ID.Value = &id
	}
	if value, ok := sac.mutation.DisplayName(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: serviceaccount.FieldDisplayName,
		})
		_node.DisplayName = value
	}
	if value, ok := sac.mutation.APIKey(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeUUID,
			Value:  value,
			Column: serviceaccount.FieldAPIKey,
		})
		_node.APIKey = value
	}
	if value, ok := sac.mutation.APISecret(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeUUID,
			Value:  value,
			Column: serviceaccount.FieldAPISecret,
		})
		_node.APISecret = value
	}
	if value, ok := sac.mutation.Active(); ok {
		_spec.Fields = append(_spec.Fields, &sqlgraph.FieldSpec{
			Type:   field.TypeBool,
			Value:  value,
			Column: serviceaccount.FieldActive,
		})
		_node.Active = value
	}
	if nodes := sac.mutation.ServiceAccountToTokenIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   serviceaccount.ServiceAccountToTokenTable,
			Columns: []string{serviceaccount.ServiceAccountToTokenColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: servicetoken.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges = append(_spec.Edges, edge)
	}
	if nodes := sac.mutation.ServiceAccountToActionsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   serviceaccount.ServiceAccountToActionsTable,
			Columns: []string{serviceaccount.ServiceAccountToActionsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: action.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// ServiceAccountCreateBulk is the builder for creating many ServiceAccount entities in bulk.
type ServiceAccountCreateBulk struct {
	config
	builders []*ServiceAccountCreate
}

// Save creates the ServiceAccount entities in the database.
func (sacb *ServiceAccountCreateBulk) Save(ctx context.Context) ([]*ServiceAccount, error) {
	specs := make([]*sqlgraph.CreateSpec, len(sacb.builders))
	nodes := make([]*ServiceAccount, len(sacb.builders))
	mutators := make([]Mutator, len(sacb.builders))
	for i := range sacb.builders {
		func(i int, root context.Context) {
			builder := sacb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*ServiceAccountMutation)
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
					_, err = mutators[i+1].Mutate(root, sacb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, sacb.driver, spec); err != nil {
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
		if _, err := mutators[0].Mutate(ctx, sacb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (sacb *ServiceAccountCreateBulk) SaveX(ctx context.Context) []*ServiceAccount {
	v, err := sacb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (sacb *ServiceAccountCreateBulk) Exec(ctx context.Context) error {
	_, err := sacb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (sacb *ServiceAccountCreateBulk) ExecX(ctx context.Context) {
	if err := sacb.Exec(ctx); err != nil {
		panic(err)
	}
}
