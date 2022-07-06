// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"fmt"
	"log"

	"github.com/BradHacker/compsole/ent/migrate"
	"github.com/google/uuid"

	"github.com/BradHacker/compsole/ent/competition"
	"github.com/BradHacker/compsole/ent/team"
	"github.com/BradHacker/compsole/ent/vmobject"

	"entgo.io/ent/dialect"
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
)

// Client is the client that holds all ent builders.
type Client struct {
	config
	// Schema is the client for creating, migrating and dropping schema.
	Schema *migrate.Schema
	// Competition is the client for interacting with the Competition builders.
	Competition *CompetitionClient
	// Team is the client for interacting with the Team builders.
	Team *TeamClient
	// VmObject is the client for interacting with the VmObject builders.
	VmObject *VmObjectClient
}

// NewClient creates a new client configured with the given options.
func NewClient(opts ...Option) *Client {
	cfg := config{log: log.Println, hooks: &hooks{}}
	cfg.options(opts...)
	client := &Client{config: cfg}
	client.init()
	return client
}

func (c *Client) init() {
	c.Schema = migrate.NewSchema(c.driver)
	c.Competition = NewCompetitionClient(c.config)
	c.Team = NewTeamClient(c.config)
	c.VmObject = NewVmObjectClient(c.config)
}

// Open opens a database/sql.DB specified by the driver name and
// the data source name, and returns a new client attached to it.
// Optional parameters can be added for configuring the client.
func Open(driverName, dataSourceName string, options ...Option) (*Client, error) {
	switch driverName {
	case dialect.MySQL, dialect.Postgres, dialect.SQLite:
		drv, err := sql.Open(driverName, dataSourceName)
		if err != nil {
			return nil, err
		}
		return NewClient(append(options, Driver(drv))...), nil
	default:
		return nil, fmt.Errorf("unsupported driver: %q", driverName)
	}
}

// Tx returns a new transactional client. The provided context
// is used until the transaction is committed or rolled back.
func (c *Client) Tx(ctx context.Context) (*Tx, error) {
	if _, ok := c.driver.(*txDriver); ok {
		return nil, fmt.Errorf("ent: cannot start a transaction within a transaction")
	}
	tx, err := newTx(ctx, c.driver)
	if err != nil {
		return nil, fmt.Errorf("ent: starting a transaction: %w", err)
	}
	cfg := c.config
	cfg.driver = tx
	return &Tx{
		ctx:         ctx,
		config:      cfg,
		Competition: NewCompetitionClient(cfg),
		Team:        NewTeamClient(cfg),
		VmObject:    NewVmObjectClient(cfg),
	}, nil
}

// BeginTx returns a transactional client with specified options.
func (c *Client) BeginTx(ctx context.Context, opts *sql.TxOptions) (*Tx, error) {
	if _, ok := c.driver.(*txDriver); ok {
		return nil, fmt.Errorf("ent: cannot start a transaction within a transaction")
	}
	tx, err := c.driver.(interface {
		BeginTx(context.Context, *sql.TxOptions) (dialect.Tx, error)
	}).BeginTx(ctx, opts)
	if err != nil {
		return nil, fmt.Errorf("ent: starting a transaction: %w", err)
	}
	cfg := c.config
	cfg.driver = &txDriver{tx: tx, drv: c.driver}
	return &Tx{
		ctx:         ctx,
		config:      cfg,
		Competition: NewCompetitionClient(cfg),
		Team:        NewTeamClient(cfg),
		VmObject:    NewVmObjectClient(cfg),
	}, nil
}

// Debug returns a new debug-client. It's used to get verbose logging on specific operations.
//
//	client.Debug().
//		Competition.
//		Query().
//		Count(ctx)
//
func (c *Client) Debug() *Client {
	if c.debug {
		return c
	}
	cfg := c.config
	cfg.driver = dialect.Debug(c.driver, c.log)
	client := &Client{config: cfg}
	client.init()
	return client
}

// Close closes the database connection and prevents new queries from starting.
func (c *Client) Close() error {
	return c.driver.Close()
}

// Use adds the mutation hooks to all the entity clients.
// In order to add hooks to a specific client, call: `client.Node.Use(...)`.
func (c *Client) Use(hooks ...Hook) {
	c.Competition.Use(hooks...)
	c.Team.Use(hooks...)
	c.VmObject.Use(hooks...)
}

// CompetitionClient is a client for the Competition schema.
type CompetitionClient struct {
	config
}

// NewCompetitionClient returns a client for the Competition from the given config.
func NewCompetitionClient(c config) *CompetitionClient {
	return &CompetitionClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `competition.Hooks(f(g(h())))`.
func (c *CompetitionClient) Use(hooks ...Hook) {
	c.hooks.Competition = append(c.hooks.Competition, hooks...)
}

// Create returns a create builder for Competition.
func (c *CompetitionClient) Create() *CompetitionCreate {
	mutation := newCompetitionMutation(c.config, OpCreate)
	return &CompetitionCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of Competition entities.
func (c *CompetitionClient) CreateBulk(builders ...*CompetitionCreate) *CompetitionCreateBulk {
	return &CompetitionCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for Competition.
func (c *CompetitionClient) Update() *CompetitionUpdate {
	mutation := newCompetitionMutation(c.config, OpUpdate)
	return &CompetitionUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *CompetitionClient) UpdateOne(co *Competition) *CompetitionUpdateOne {
	mutation := newCompetitionMutation(c.config, OpUpdateOne, withCompetition(co))
	return &CompetitionUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *CompetitionClient) UpdateOneID(id uuid.UUID) *CompetitionUpdateOne {
	mutation := newCompetitionMutation(c.config, OpUpdateOne, withCompetitionID(id))
	return &CompetitionUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for Competition.
func (c *CompetitionClient) Delete() *CompetitionDelete {
	mutation := newCompetitionMutation(c.config, OpDelete)
	return &CompetitionDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a delete builder for the given entity.
func (c *CompetitionClient) DeleteOne(co *Competition) *CompetitionDeleteOne {
	return c.DeleteOneID(co.ID)
}

// DeleteOneID returns a delete builder for the given id.
func (c *CompetitionClient) DeleteOneID(id uuid.UUID) *CompetitionDeleteOne {
	builder := c.Delete().Where(competition.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &CompetitionDeleteOne{builder}
}

// Query returns a query builder for Competition.
func (c *CompetitionClient) Query() *CompetitionQuery {
	return &CompetitionQuery{
		config: c.config,
	}
}

// Get returns a Competition entity by its id.
func (c *CompetitionClient) Get(ctx context.Context, id uuid.UUID) (*Competition, error) {
	return c.Query().Where(competition.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *CompetitionClient) GetX(ctx context.Context, id uuid.UUID) *Competition {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// QueryCompetitionToTeams queries the CompetitionToTeams edge of a Competition.
func (c *CompetitionClient) QueryCompetitionToTeams(co *Competition) *TeamQuery {
	query := &TeamQuery{config: c.config}
	query.path = func(ctx context.Context) (fromV *sql.Selector, _ error) {
		id := co.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(competition.Table, competition.FieldID, id),
			sqlgraph.To(team.Table, team.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, true, competition.CompetitionToTeamsTable, competition.CompetitionToTeamsColumn),
		)
		fromV = sqlgraph.Neighbors(co.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// Hooks returns the client hooks.
func (c *CompetitionClient) Hooks() []Hook {
	return c.hooks.Competition
}

// TeamClient is a client for the Team schema.
type TeamClient struct {
	config
}

// NewTeamClient returns a client for the Team from the given config.
func NewTeamClient(c config) *TeamClient {
	return &TeamClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `team.Hooks(f(g(h())))`.
func (c *TeamClient) Use(hooks ...Hook) {
	c.hooks.Team = append(c.hooks.Team, hooks...)
}

// Create returns a create builder for Team.
func (c *TeamClient) Create() *TeamCreate {
	mutation := newTeamMutation(c.config, OpCreate)
	return &TeamCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of Team entities.
func (c *TeamClient) CreateBulk(builders ...*TeamCreate) *TeamCreateBulk {
	return &TeamCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for Team.
func (c *TeamClient) Update() *TeamUpdate {
	mutation := newTeamMutation(c.config, OpUpdate)
	return &TeamUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *TeamClient) UpdateOne(t *Team) *TeamUpdateOne {
	mutation := newTeamMutation(c.config, OpUpdateOne, withTeam(t))
	return &TeamUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *TeamClient) UpdateOneID(id uuid.UUID) *TeamUpdateOne {
	mutation := newTeamMutation(c.config, OpUpdateOne, withTeamID(id))
	return &TeamUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for Team.
func (c *TeamClient) Delete() *TeamDelete {
	mutation := newTeamMutation(c.config, OpDelete)
	return &TeamDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a delete builder for the given entity.
func (c *TeamClient) DeleteOne(t *Team) *TeamDeleteOne {
	return c.DeleteOneID(t.ID)
}

// DeleteOneID returns a delete builder for the given id.
func (c *TeamClient) DeleteOneID(id uuid.UUID) *TeamDeleteOne {
	builder := c.Delete().Where(team.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &TeamDeleteOne{builder}
}

// Query returns a query builder for Team.
func (c *TeamClient) Query() *TeamQuery {
	return &TeamQuery{
		config: c.config,
	}
}

// Get returns a Team entity by its id.
func (c *TeamClient) Get(ctx context.Context, id uuid.UUID) (*Team, error) {
	return c.Query().Where(team.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *TeamClient) GetX(ctx context.Context, id uuid.UUID) *Team {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// QueryTeamToCompetition queries the TeamToCompetition edge of a Team.
func (c *TeamClient) QueryTeamToCompetition(t *Team) *CompetitionQuery {
	query := &CompetitionQuery{config: c.config}
	query.path = func(ctx context.Context) (fromV *sql.Selector, _ error) {
		id := t.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(team.Table, team.FieldID, id),
			sqlgraph.To(competition.Table, competition.FieldID),
			sqlgraph.Edge(sqlgraph.M2O, false, team.TeamToCompetitionTable, team.TeamToCompetitionColumn),
		)
		fromV = sqlgraph.Neighbors(t.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// QueryTeamToVmObjects queries the TeamToVmObjects edge of a Team.
func (c *TeamClient) QueryTeamToVmObjects(t *Team) *VmObjectQuery {
	query := &VmObjectQuery{config: c.config}
	query.path = func(ctx context.Context) (fromV *sql.Selector, _ error) {
		id := t.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(team.Table, team.FieldID, id),
			sqlgraph.To(vmobject.Table, vmobject.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, true, team.TeamToVmObjectsTable, team.TeamToVmObjectsColumn),
		)
		fromV = sqlgraph.Neighbors(t.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// Hooks returns the client hooks.
func (c *TeamClient) Hooks() []Hook {
	return c.hooks.Team
}

// VmObjectClient is a client for the VmObject schema.
type VmObjectClient struct {
	config
}

// NewVmObjectClient returns a client for the VmObject from the given config.
func NewVmObjectClient(c config) *VmObjectClient {
	return &VmObjectClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `vmobject.Hooks(f(g(h())))`.
func (c *VmObjectClient) Use(hooks ...Hook) {
	c.hooks.VmObject = append(c.hooks.VmObject, hooks...)
}

// Create returns a create builder for VmObject.
func (c *VmObjectClient) Create() *VmObjectCreate {
	mutation := newVmObjectMutation(c.config, OpCreate)
	return &VmObjectCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of VmObject entities.
func (c *VmObjectClient) CreateBulk(builders ...*VmObjectCreate) *VmObjectCreateBulk {
	return &VmObjectCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for VmObject.
func (c *VmObjectClient) Update() *VmObjectUpdate {
	mutation := newVmObjectMutation(c.config, OpUpdate)
	return &VmObjectUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *VmObjectClient) UpdateOne(vo *VmObject) *VmObjectUpdateOne {
	mutation := newVmObjectMutation(c.config, OpUpdateOne, withVmObject(vo))
	return &VmObjectUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *VmObjectClient) UpdateOneID(id uuid.UUID) *VmObjectUpdateOne {
	mutation := newVmObjectMutation(c.config, OpUpdateOne, withVmObjectID(id))
	return &VmObjectUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for VmObject.
func (c *VmObjectClient) Delete() *VmObjectDelete {
	mutation := newVmObjectMutation(c.config, OpDelete)
	return &VmObjectDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a delete builder for the given entity.
func (c *VmObjectClient) DeleteOne(vo *VmObject) *VmObjectDeleteOne {
	return c.DeleteOneID(vo.ID)
}

// DeleteOneID returns a delete builder for the given id.
func (c *VmObjectClient) DeleteOneID(id uuid.UUID) *VmObjectDeleteOne {
	builder := c.Delete().Where(vmobject.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &VmObjectDeleteOne{builder}
}

// Query returns a query builder for VmObject.
func (c *VmObjectClient) Query() *VmObjectQuery {
	return &VmObjectQuery{
		config: c.config,
	}
}

// Get returns a VmObject entity by its id.
func (c *VmObjectClient) Get(ctx context.Context, id uuid.UUID) (*VmObject, error) {
	return c.Query().Where(vmobject.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *VmObjectClient) GetX(ctx context.Context, id uuid.UUID) *VmObject {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// QueryVmObjectToTeam queries the VmObjectToTeam edge of a VmObject.
func (c *VmObjectClient) QueryVmObjectToTeam(vo *VmObject) *TeamQuery {
	query := &TeamQuery{config: c.config}
	query.path = func(ctx context.Context) (fromV *sql.Selector, _ error) {
		id := vo.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(vmobject.Table, vmobject.FieldID, id),
			sqlgraph.To(team.Table, team.FieldID),
			sqlgraph.Edge(sqlgraph.M2O, false, vmobject.VmObjectToTeamTable, vmobject.VmObjectToTeamColumn),
		)
		fromV = sqlgraph.Neighbors(vo.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// Hooks returns the client hooks.
func (c *VmObjectClient) Hooks() []Hook {
	return c.hooks.VmObject
}