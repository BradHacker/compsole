// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/BradHacker/compsole/ent/competition"
	"github.com/BradHacker/compsole/ent/predicate"
	"github.com/BradHacker/compsole/ent/team"
	"github.com/BradHacker/compsole/ent/vmobject"
	"github.com/google/uuid"
)

// TeamUpdate is the builder for updating Team entities.
type TeamUpdate struct {
	config
	hooks    []Hook
	mutation *TeamMutation
}

// Where appends a list predicates to the TeamUpdate builder.
func (tu *TeamUpdate) Where(ps ...predicate.Team) *TeamUpdate {
	tu.mutation.Where(ps...)
	return tu
}

// SetTeamNumber sets the "team_number" field.
func (tu *TeamUpdate) SetTeamNumber(i int) *TeamUpdate {
	tu.mutation.ResetTeamNumber()
	tu.mutation.SetTeamNumber(i)
	return tu
}

// AddTeamNumber adds i to the "team_number" field.
func (tu *TeamUpdate) AddTeamNumber(i int) *TeamUpdate {
	tu.mutation.AddTeamNumber(i)
	return tu
}

// SetName sets the "name" field.
func (tu *TeamUpdate) SetName(s string) *TeamUpdate {
	tu.mutation.SetName(s)
	return tu
}

// SetNillableName sets the "name" field if the given value is not nil.
func (tu *TeamUpdate) SetNillableName(s *string) *TeamUpdate {
	if s != nil {
		tu.SetName(*s)
	}
	return tu
}

// ClearName clears the value of the "name" field.
func (tu *TeamUpdate) ClearName() *TeamUpdate {
	tu.mutation.ClearName()
	return tu
}

// SetTeamToCompetitionID sets the "TeamToCompetition" edge to the Competition entity by ID.
func (tu *TeamUpdate) SetTeamToCompetitionID(id uuid.UUID) *TeamUpdate {
	tu.mutation.SetTeamToCompetitionID(id)
	return tu
}

// SetTeamToCompetition sets the "TeamToCompetition" edge to the Competition entity.
func (tu *TeamUpdate) SetTeamToCompetition(c *Competition) *TeamUpdate {
	return tu.SetTeamToCompetitionID(c.ID)
}

// AddTeamToVmObjectIDs adds the "TeamToVmObjects" edge to the VmObject entity by IDs.
func (tu *TeamUpdate) AddTeamToVmObjectIDs(ids ...uuid.UUID) *TeamUpdate {
	tu.mutation.AddTeamToVmObjectIDs(ids...)
	return tu
}

// AddTeamToVmObjects adds the "TeamToVmObjects" edges to the VmObject entity.
func (tu *TeamUpdate) AddTeamToVmObjects(v ...*VmObject) *TeamUpdate {
	ids := make([]uuid.UUID, len(v))
	for i := range v {
		ids[i] = v[i].ID
	}
	return tu.AddTeamToVmObjectIDs(ids...)
}

// Mutation returns the TeamMutation object of the builder.
func (tu *TeamUpdate) Mutation() *TeamMutation {
	return tu.mutation
}

// ClearTeamToCompetition clears the "TeamToCompetition" edge to the Competition entity.
func (tu *TeamUpdate) ClearTeamToCompetition() *TeamUpdate {
	tu.mutation.ClearTeamToCompetition()
	return tu
}

// ClearTeamToVmObjects clears all "TeamToVmObjects" edges to the VmObject entity.
func (tu *TeamUpdate) ClearTeamToVmObjects() *TeamUpdate {
	tu.mutation.ClearTeamToVmObjects()
	return tu
}

// RemoveTeamToVmObjectIDs removes the "TeamToVmObjects" edge to VmObject entities by IDs.
func (tu *TeamUpdate) RemoveTeamToVmObjectIDs(ids ...uuid.UUID) *TeamUpdate {
	tu.mutation.RemoveTeamToVmObjectIDs(ids...)
	return tu
}

// RemoveTeamToVmObjects removes "TeamToVmObjects" edges to VmObject entities.
func (tu *TeamUpdate) RemoveTeamToVmObjects(v ...*VmObject) *TeamUpdate {
	ids := make([]uuid.UUID, len(v))
	for i := range v {
		ids[i] = v[i].ID
	}
	return tu.RemoveTeamToVmObjectIDs(ids...)
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (tu *TeamUpdate) Save(ctx context.Context) (int, error) {
	var (
		err      error
		affected int
	)
	if len(tu.hooks) == 0 {
		if err = tu.check(); err != nil {
			return 0, err
		}
		affected, err = tu.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*TeamMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = tu.check(); err != nil {
				return 0, err
			}
			tu.mutation = mutation
			affected, err = tu.sqlSave(ctx)
			mutation.done = true
			return affected, err
		})
		for i := len(tu.hooks) - 1; i >= 0; i-- {
			if tu.hooks[i] == nil {
				return 0, fmt.Errorf("ent: uninitialized hook (forgotten import ent/runtime?)")
			}
			mut = tu.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, tu.mutation); err != nil {
			return 0, err
		}
	}
	return affected, err
}

// SaveX is like Save, but panics if an error occurs.
func (tu *TeamUpdate) SaveX(ctx context.Context) int {
	affected, err := tu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (tu *TeamUpdate) Exec(ctx context.Context) error {
	_, err := tu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (tu *TeamUpdate) ExecX(ctx context.Context) {
	if err := tu.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (tu *TeamUpdate) check() error {
	if _, ok := tu.mutation.TeamToCompetitionID(); tu.mutation.TeamToCompetitionCleared() && !ok {
		return errors.New(`ent: clearing a required unique edge "Team.TeamToCompetition"`)
	}
	return nil
}

func (tu *TeamUpdate) sqlSave(ctx context.Context) (n int, err error) {
	_spec := &sqlgraph.UpdateSpec{
		Node: &sqlgraph.NodeSpec{
			Table:   team.Table,
			Columns: team.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeUUID,
				Column: team.FieldID,
			},
		},
	}
	if ps := tu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := tu.mutation.TeamNumber(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeInt,
			Value:  value,
			Column: team.FieldTeamNumber,
		})
	}
	if value, ok := tu.mutation.AddedTeamNumber(); ok {
		_spec.Fields.Add = append(_spec.Fields.Add, &sqlgraph.FieldSpec{
			Type:   field.TypeInt,
			Value:  value,
			Column: team.FieldTeamNumber,
		})
	}
	if value, ok := tu.mutation.Name(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: team.FieldName,
		})
	}
	if tu.mutation.NameCleared() {
		_spec.Fields.Clear = append(_spec.Fields.Clear, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Column: team.FieldName,
		})
	}
	if tu.mutation.TeamToCompetitionCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   team.TeamToCompetitionTable,
			Columns: []string{team.TeamToCompetitionColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: competition.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := tu.mutation.TeamToCompetitionIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   team.TeamToCompetitionTable,
			Columns: []string{team.TeamToCompetitionColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: competition.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if tu.mutation.TeamToVmObjectsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   team.TeamToVmObjectsTable,
			Columns: []string{team.TeamToVmObjectsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: vmobject.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := tu.mutation.RemovedTeamToVmObjectsIDs(); len(nodes) > 0 && !tu.mutation.TeamToVmObjectsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   team.TeamToVmObjectsTable,
			Columns: []string{team.TeamToVmObjectsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: vmobject.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := tu.mutation.TeamToVmObjectsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   team.TeamToVmObjectsTable,
			Columns: []string{team.TeamToVmObjectsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: vmobject.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, tu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{team.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{err.Error(), err}
		}
		return 0, err
	}
	return n, nil
}

// TeamUpdateOne is the builder for updating a single Team entity.
type TeamUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *TeamMutation
}

// SetTeamNumber sets the "team_number" field.
func (tuo *TeamUpdateOne) SetTeamNumber(i int) *TeamUpdateOne {
	tuo.mutation.ResetTeamNumber()
	tuo.mutation.SetTeamNumber(i)
	return tuo
}

// AddTeamNumber adds i to the "team_number" field.
func (tuo *TeamUpdateOne) AddTeamNumber(i int) *TeamUpdateOne {
	tuo.mutation.AddTeamNumber(i)
	return tuo
}

// SetName sets the "name" field.
func (tuo *TeamUpdateOne) SetName(s string) *TeamUpdateOne {
	tuo.mutation.SetName(s)
	return tuo
}

// SetNillableName sets the "name" field if the given value is not nil.
func (tuo *TeamUpdateOne) SetNillableName(s *string) *TeamUpdateOne {
	if s != nil {
		tuo.SetName(*s)
	}
	return tuo
}

// ClearName clears the value of the "name" field.
func (tuo *TeamUpdateOne) ClearName() *TeamUpdateOne {
	tuo.mutation.ClearName()
	return tuo
}

// SetTeamToCompetitionID sets the "TeamToCompetition" edge to the Competition entity by ID.
func (tuo *TeamUpdateOne) SetTeamToCompetitionID(id uuid.UUID) *TeamUpdateOne {
	tuo.mutation.SetTeamToCompetitionID(id)
	return tuo
}

// SetTeamToCompetition sets the "TeamToCompetition" edge to the Competition entity.
func (tuo *TeamUpdateOne) SetTeamToCompetition(c *Competition) *TeamUpdateOne {
	return tuo.SetTeamToCompetitionID(c.ID)
}

// AddTeamToVmObjectIDs adds the "TeamToVmObjects" edge to the VmObject entity by IDs.
func (tuo *TeamUpdateOne) AddTeamToVmObjectIDs(ids ...uuid.UUID) *TeamUpdateOne {
	tuo.mutation.AddTeamToVmObjectIDs(ids...)
	return tuo
}

// AddTeamToVmObjects adds the "TeamToVmObjects" edges to the VmObject entity.
func (tuo *TeamUpdateOne) AddTeamToVmObjects(v ...*VmObject) *TeamUpdateOne {
	ids := make([]uuid.UUID, len(v))
	for i := range v {
		ids[i] = v[i].ID
	}
	return tuo.AddTeamToVmObjectIDs(ids...)
}

// Mutation returns the TeamMutation object of the builder.
func (tuo *TeamUpdateOne) Mutation() *TeamMutation {
	return tuo.mutation
}

// ClearTeamToCompetition clears the "TeamToCompetition" edge to the Competition entity.
func (tuo *TeamUpdateOne) ClearTeamToCompetition() *TeamUpdateOne {
	tuo.mutation.ClearTeamToCompetition()
	return tuo
}

// ClearTeamToVmObjects clears all "TeamToVmObjects" edges to the VmObject entity.
func (tuo *TeamUpdateOne) ClearTeamToVmObjects() *TeamUpdateOne {
	tuo.mutation.ClearTeamToVmObjects()
	return tuo
}

// RemoveTeamToVmObjectIDs removes the "TeamToVmObjects" edge to VmObject entities by IDs.
func (tuo *TeamUpdateOne) RemoveTeamToVmObjectIDs(ids ...uuid.UUID) *TeamUpdateOne {
	tuo.mutation.RemoveTeamToVmObjectIDs(ids...)
	return tuo
}

// RemoveTeamToVmObjects removes "TeamToVmObjects" edges to VmObject entities.
func (tuo *TeamUpdateOne) RemoveTeamToVmObjects(v ...*VmObject) *TeamUpdateOne {
	ids := make([]uuid.UUID, len(v))
	for i := range v {
		ids[i] = v[i].ID
	}
	return tuo.RemoveTeamToVmObjectIDs(ids...)
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (tuo *TeamUpdateOne) Select(field string, fields ...string) *TeamUpdateOne {
	tuo.fields = append([]string{field}, fields...)
	return tuo
}

// Save executes the query and returns the updated Team entity.
func (tuo *TeamUpdateOne) Save(ctx context.Context) (*Team, error) {
	var (
		err  error
		node *Team
	)
	if len(tuo.hooks) == 0 {
		if err = tuo.check(); err != nil {
			return nil, err
		}
		node, err = tuo.sqlSave(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*TeamMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			if err = tuo.check(); err != nil {
				return nil, err
			}
			tuo.mutation = mutation
			node, err = tuo.sqlSave(ctx)
			mutation.done = true
			return node, err
		})
		for i := len(tuo.hooks) - 1; i >= 0; i-- {
			if tuo.hooks[i] == nil {
				return nil, fmt.Errorf("ent: uninitialized hook (forgotten import ent/runtime?)")
			}
			mut = tuo.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, tuo.mutation); err != nil {
			return nil, err
		}
	}
	return node, err
}

// SaveX is like Save, but panics if an error occurs.
func (tuo *TeamUpdateOne) SaveX(ctx context.Context) *Team {
	node, err := tuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (tuo *TeamUpdateOne) Exec(ctx context.Context) error {
	_, err := tuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (tuo *TeamUpdateOne) ExecX(ctx context.Context) {
	if err := tuo.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (tuo *TeamUpdateOne) check() error {
	if _, ok := tuo.mutation.TeamToCompetitionID(); tuo.mutation.TeamToCompetitionCleared() && !ok {
		return errors.New(`ent: clearing a required unique edge "Team.TeamToCompetition"`)
	}
	return nil
}

func (tuo *TeamUpdateOne) sqlSave(ctx context.Context) (_node *Team, err error) {
	_spec := &sqlgraph.UpdateSpec{
		Node: &sqlgraph.NodeSpec{
			Table:   team.Table,
			Columns: team.Columns,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeUUID,
				Column: team.FieldID,
			},
		},
	}
	id, ok := tuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "Team.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := tuo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, team.FieldID)
		for _, f := range fields {
			if !team.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != team.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := tuo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := tuo.mutation.TeamNumber(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeInt,
			Value:  value,
			Column: team.FieldTeamNumber,
		})
	}
	if value, ok := tuo.mutation.AddedTeamNumber(); ok {
		_spec.Fields.Add = append(_spec.Fields.Add, &sqlgraph.FieldSpec{
			Type:   field.TypeInt,
			Value:  value,
			Column: team.FieldTeamNumber,
		})
	}
	if value, ok := tuo.mutation.Name(); ok {
		_spec.Fields.Set = append(_spec.Fields.Set, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Value:  value,
			Column: team.FieldName,
		})
	}
	if tuo.mutation.NameCleared() {
		_spec.Fields.Clear = append(_spec.Fields.Clear, &sqlgraph.FieldSpec{
			Type:   field.TypeString,
			Column: team.FieldName,
		})
	}
	if tuo.mutation.TeamToCompetitionCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   team.TeamToCompetitionTable,
			Columns: []string{team.TeamToCompetitionColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: competition.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := tuo.mutation.TeamToCompetitionIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   team.TeamToCompetitionTable,
			Columns: []string{team.TeamToCompetitionColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: competition.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if tuo.mutation.TeamToVmObjectsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   team.TeamToVmObjectsTable,
			Columns: []string{team.TeamToVmObjectsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: vmobject.FieldID,
				},
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := tuo.mutation.RemovedTeamToVmObjectsIDs(); len(nodes) > 0 && !tuo.mutation.TeamToVmObjectsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   team.TeamToVmObjectsTable,
			Columns: []string{team.TeamToVmObjectsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: vmobject.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := tuo.mutation.TeamToVmObjectsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: true,
			Table:   team.TeamToVmObjectsTable,
			Columns: []string{team.TeamToVmObjectsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeUUID,
					Column: vmobject.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &Team{config: tuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, tuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{team.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{err.Error(), err}
		}
		return nil, err
	}
	return _node, nil
}