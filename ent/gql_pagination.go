// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"strconv"
	"strings"

	"entgo.io/ent/dialect/sql"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/errcode"
	"github.com/BradHacker/compsole/ent/competition"
	"github.com/BradHacker/compsole/ent/provider"
	"github.com/BradHacker/compsole/ent/team"
	"github.com/BradHacker/compsole/ent/token"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/BradHacker/compsole/ent/vmobject"
	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"github.com/vmihailenco/msgpack/v5"
)

// OrderDirection defines the directions in which to order a list of items.
type OrderDirection string

const (
	// OrderDirectionAsc specifies an ascending order.
	OrderDirectionAsc OrderDirection = "ASC"
	// OrderDirectionDesc specifies a descending order.
	OrderDirectionDesc OrderDirection = "DESC"
)

// Validate the order direction value.
func (o OrderDirection) Validate() error {
	if o != OrderDirectionAsc && o != OrderDirectionDesc {
		return fmt.Errorf("%s is not a valid OrderDirection", o)
	}
	return nil
}

// String implements fmt.Stringer interface.
func (o OrderDirection) String() string {
	return string(o)
}

// MarshalGQL implements graphql.Marshaler interface.
func (o OrderDirection) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.Quote(o.String()))
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (o *OrderDirection) UnmarshalGQL(val interface{}) error {
	str, ok := val.(string)
	if !ok {
		return fmt.Errorf("order direction %T must be a string", val)
	}
	*o = OrderDirection(str)
	return o.Validate()
}

func (o OrderDirection) reverse() OrderDirection {
	if o == OrderDirectionDesc {
		return OrderDirectionAsc
	}
	return OrderDirectionDesc
}

func (o OrderDirection) orderFunc(field string) OrderFunc {
	if o == OrderDirectionDesc {
		return Desc(field)
	}
	return Asc(field)
}

func cursorsToPredicates(direction OrderDirection, after, before *Cursor, field, idField string) []func(s *sql.Selector) {
	var predicates []func(s *sql.Selector)
	if after != nil {
		if after.Value != nil {
			var predicate func([]string, ...interface{}) *sql.Predicate
			if direction == OrderDirectionAsc {
				predicate = sql.CompositeGT
			} else {
				predicate = sql.CompositeLT
			}
			predicates = append(predicates, func(s *sql.Selector) {
				s.Where(predicate(
					s.Columns(field, idField),
					after.Value, after.ID,
				))
			})
		} else {
			var predicate func(string, interface{}) *sql.Predicate
			if direction == OrderDirectionAsc {
				predicate = sql.GT
			} else {
				predicate = sql.LT
			}
			predicates = append(predicates, func(s *sql.Selector) {
				s.Where(predicate(
					s.C(idField),
					after.ID,
				))
			})
		}
	}
	if before != nil {
		if before.Value != nil {
			var predicate func([]string, ...interface{}) *sql.Predicate
			if direction == OrderDirectionAsc {
				predicate = sql.CompositeLT
			} else {
				predicate = sql.CompositeGT
			}
			predicates = append(predicates, func(s *sql.Selector) {
				s.Where(predicate(
					s.Columns(field, idField),
					before.Value, before.ID,
				))
			})
		} else {
			var predicate func(string, interface{}) *sql.Predicate
			if direction == OrderDirectionAsc {
				predicate = sql.LT
			} else {
				predicate = sql.GT
			}
			predicates = append(predicates, func(s *sql.Selector) {
				s.Where(predicate(
					s.C(idField),
					before.ID,
				))
			})
		}
	}
	return predicates
}

// PageInfo of a connection type.
type PageInfo struct {
	HasNextPage     bool    `json:"hasNextPage"`
	HasPreviousPage bool    `json:"hasPreviousPage"`
	StartCursor     *Cursor `json:"startCursor"`
	EndCursor       *Cursor `json:"endCursor"`
}

// Cursor of an edge type.
type Cursor struct {
	ID    uuid.UUID `msgpack:"i"`
	Value Value     `msgpack:"v,omitempty"`
}

// MarshalGQL implements graphql.Marshaler interface.
func (c Cursor) MarshalGQL(w io.Writer) {
	quote := []byte{'"'}
	w.Write(quote)
	defer w.Write(quote)
	wc := base64.NewEncoder(base64.RawStdEncoding, w)
	defer wc.Close()
	_ = msgpack.NewEncoder(wc).Encode(c)
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (c *Cursor) UnmarshalGQL(v interface{}) error {
	s, ok := v.(string)
	if !ok {
		return fmt.Errorf("%T is not a string", v)
	}
	if err := msgpack.NewDecoder(
		base64.NewDecoder(
			base64.RawStdEncoding,
			strings.NewReader(s),
		),
	).Decode(c); err != nil {
		return fmt.Errorf("cannot decode cursor: %w", err)
	}
	return nil
}

const errInvalidPagination = "INVALID_PAGINATION"

func validateFirstLast(first, last *int) (err *gqlerror.Error) {
	switch {
	case first != nil && last != nil:
		err = &gqlerror.Error{
			Message: "Passing both `first` and `last` to paginate a connection is not supported.",
		}
	case first != nil && *first < 0:
		err = &gqlerror.Error{
			Message: "`first` on a connection cannot be less than zero.",
		}
		errcode.Set(err, errInvalidPagination)
	case last != nil && *last < 0:
		err = &gqlerror.Error{
			Message: "`last` on a connection cannot be less than zero.",
		}
		errcode.Set(err, errInvalidPagination)
	}
	return err
}

func getCollectedField(ctx context.Context, path ...string) *graphql.CollectedField {
	fc := graphql.GetFieldContext(ctx)
	if fc == nil {
		return nil
	}
	oc := graphql.GetOperationContext(ctx)
	field := fc.Field

walk:
	for _, name := range path {
		for _, f := range graphql.CollectFields(oc, field.Selections, nil) {
			if f.Name == name {
				field = f
				continue walk
			}
		}
		return nil
	}
	return &field
}

func hasCollectedField(ctx context.Context, path ...string) bool {
	if graphql.GetFieldContext(ctx) == nil {
		return true
	}
	return getCollectedField(ctx, path...) != nil
}

const (
	edgesField      = "edges"
	nodeField       = "node"
	pageInfoField   = "pageInfo"
	totalCountField = "totalCount"
)

// CompetitionEdge is the edge representation of Competition.
type CompetitionEdge struct {
	Node   *Competition `json:"node"`
	Cursor Cursor       `json:"cursor"`
}

// CompetitionConnection is the connection containing edges to Competition.
type CompetitionConnection struct {
	Edges      []*CompetitionEdge `json:"edges"`
	PageInfo   PageInfo           `json:"pageInfo"`
	TotalCount int                `json:"totalCount"`
}

// CompetitionPaginateOption enables pagination customization.
type CompetitionPaginateOption func(*competitionPager) error

// WithCompetitionOrder configures pagination ordering.
func WithCompetitionOrder(order *CompetitionOrder) CompetitionPaginateOption {
	if order == nil {
		order = DefaultCompetitionOrder
	}
	o := *order
	return func(pager *competitionPager) error {
		if err := o.Direction.Validate(); err != nil {
			return err
		}
		if o.Field == nil {
			o.Field = DefaultCompetitionOrder.Field
		}
		pager.order = &o
		return nil
	}
}

// WithCompetitionFilter configures pagination filter.
func WithCompetitionFilter(filter func(*CompetitionQuery) (*CompetitionQuery, error)) CompetitionPaginateOption {
	return func(pager *competitionPager) error {
		if filter == nil {
			return errors.New("CompetitionQuery filter cannot be nil")
		}
		pager.filter = filter
		return nil
	}
}

type competitionPager struct {
	order  *CompetitionOrder
	filter func(*CompetitionQuery) (*CompetitionQuery, error)
}

func newCompetitionPager(opts []CompetitionPaginateOption) (*competitionPager, error) {
	pager := &competitionPager{}
	for _, opt := range opts {
		if err := opt(pager); err != nil {
			return nil, err
		}
	}
	if pager.order == nil {
		pager.order = DefaultCompetitionOrder
	}
	return pager, nil
}

func (p *competitionPager) applyFilter(query *CompetitionQuery) (*CompetitionQuery, error) {
	if p.filter != nil {
		return p.filter(query)
	}
	return query, nil
}

func (p *competitionPager) toCursor(c *Competition) Cursor {
	return p.order.Field.toCursor(c)
}

func (p *competitionPager) applyCursors(query *CompetitionQuery, after, before *Cursor) *CompetitionQuery {
	for _, predicate := range cursorsToPredicates(
		p.order.Direction, after, before,
		p.order.Field.field, DefaultCompetitionOrder.Field.field,
	) {
		query = query.Where(predicate)
	}
	return query
}

func (p *competitionPager) applyOrder(query *CompetitionQuery, reverse bool) *CompetitionQuery {
	direction := p.order.Direction
	if reverse {
		direction = direction.reverse()
	}
	query = query.Order(direction.orderFunc(p.order.Field.field))
	if p.order.Field != DefaultCompetitionOrder.Field {
		query = query.Order(direction.orderFunc(DefaultCompetitionOrder.Field.field))
	}
	return query
}

// Paginate executes the query and returns a relay based cursor connection to Competition.
func (c *CompetitionQuery) Paginate(
	ctx context.Context, after *Cursor, first *int,
	before *Cursor, last *int, opts ...CompetitionPaginateOption,
) (*CompetitionConnection, error) {
	if err := validateFirstLast(first, last); err != nil {
		return nil, err
	}
	pager, err := newCompetitionPager(opts)
	if err != nil {
		return nil, err
	}

	if c, err = pager.applyFilter(c); err != nil {
		return nil, err
	}

	conn := &CompetitionConnection{Edges: []*CompetitionEdge{}}
	if !hasCollectedField(ctx, edgesField) || first != nil && *first == 0 || last != nil && *last == 0 {
		if hasCollectedField(ctx, totalCountField) ||
			hasCollectedField(ctx, pageInfoField) {
			count, err := c.Count(ctx)
			if err != nil {
				return nil, err
			}
			conn.TotalCount = count
			conn.PageInfo.HasNextPage = first != nil && count > 0
			conn.PageInfo.HasPreviousPage = last != nil && count > 0
		}
		return conn, nil
	}

	if (after != nil || first != nil || before != nil || last != nil) && hasCollectedField(ctx, totalCountField) {
		count, err := c.Clone().Count(ctx)
		if err != nil {
			return nil, err
		}
		conn.TotalCount = count
	}

	c = pager.applyCursors(c, after, before)
	c = pager.applyOrder(c, last != nil)
	var limit int
	if first != nil {
		limit = *first + 1
	} else if last != nil {
		limit = *last + 1
	}
	if limit > 0 {
		c = c.Limit(limit)
	}

	if field := getCollectedField(ctx, edgesField, nodeField); field != nil {
		c = c.collectField(graphql.GetOperationContext(ctx), *field)
	}

	nodes, err := c.All(ctx)
	if err != nil || len(nodes) == 0 {
		return conn, err
	}

	if len(nodes) == limit {
		conn.PageInfo.HasNextPage = first != nil
		conn.PageInfo.HasPreviousPage = last != nil
		nodes = nodes[:len(nodes)-1]
	}

	var nodeAt func(int) *Competition
	if last != nil {
		n := len(nodes) - 1
		nodeAt = func(i int) *Competition {
			return nodes[n-i]
		}
	} else {
		nodeAt = func(i int) *Competition {
			return nodes[i]
		}
	}

	conn.Edges = make([]*CompetitionEdge, len(nodes))
	for i := range nodes {
		node := nodeAt(i)
		conn.Edges[i] = &CompetitionEdge{
			Node:   node,
			Cursor: pager.toCursor(node),
		}
	}

	conn.PageInfo.StartCursor = &conn.Edges[0].Cursor
	conn.PageInfo.EndCursor = &conn.Edges[len(conn.Edges)-1].Cursor
	if conn.TotalCount == 0 {
		conn.TotalCount = len(nodes)
	}

	return conn, nil
}

// CompetitionOrderField defines the ordering field of Competition.
type CompetitionOrderField struct {
	field    string
	toCursor func(*Competition) Cursor
}

// CompetitionOrder defines the ordering of Competition.
type CompetitionOrder struct {
	Direction OrderDirection         `json:"direction"`
	Field     *CompetitionOrderField `json:"field"`
}

// DefaultCompetitionOrder is the default ordering of Competition.
var DefaultCompetitionOrder = &CompetitionOrder{
	Direction: OrderDirectionAsc,
	Field: &CompetitionOrderField{
		field: competition.FieldID,
		toCursor: func(c *Competition) Cursor {
			return Cursor{ID: c.ID}
		},
	},
}

// ToEdge converts Competition into CompetitionEdge.
func (c *Competition) ToEdge(order *CompetitionOrder) *CompetitionEdge {
	if order == nil {
		order = DefaultCompetitionOrder
	}
	return &CompetitionEdge{
		Node:   c,
		Cursor: order.Field.toCursor(c),
	}
}

// ProviderEdge is the edge representation of Provider.
type ProviderEdge struct {
	Node   *Provider `json:"node"`
	Cursor Cursor    `json:"cursor"`
}

// ProviderConnection is the connection containing edges to Provider.
type ProviderConnection struct {
	Edges      []*ProviderEdge `json:"edges"`
	PageInfo   PageInfo        `json:"pageInfo"`
	TotalCount int             `json:"totalCount"`
}

// ProviderPaginateOption enables pagination customization.
type ProviderPaginateOption func(*providerPager) error

// WithProviderOrder configures pagination ordering.
func WithProviderOrder(order *ProviderOrder) ProviderPaginateOption {
	if order == nil {
		order = DefaultProviderOrder
	}
	o := *order
	return func(pager *providerPager) error {
		if err := o.Direction.Validate(); err != nil {
			return err
		}
		if o.Field == nil {
			o.Field = DefaultProviderOrder.Field
		}
		pager.order = &o
		return nil
	}
}

// WithProviderFilter configures pagination filter.
func WithProviderFilter(filter func(*ProviderQuery) (*ProviderQuery, error)) ProviderPaginateOption {
	return func(pager *providerPager) error {
		if filter == nil {
			return errors.New("ProviderQuery filter cannot be nil")
		}
		pager.filter = filter
		return nil
	}
}

type providerPager struct {
	order  *ProviderOrder
	filter func(*ProviderQuery) (*ProviderQuery, error)
}

func newProviderPager(opts []ProviderPaginateOption) (*providerPager, error) {
	pager := &providerPager{}
	for _, opt := range opts {
		if err := opt(pager); err != nil {
			return nil, err
		}
	}
	if pager.order == nil {
		pager.order = DefaultProviderOrder
	}
	return pager, nil
}

func (p *providerPager) applyFilter(query *ProviderQuery) (*ProviderQuery, error) {
	if p.filter != nil {
		return p.filter(query)
	}
	return query, nil
}

func (p *providerPager) toCursor(pr *Provider) Cursor {
	return p.order.Field.toCursor(pr)
}

func (p *providerPager) applyCursors(query *ProviderQuery, after, before *Cursor) *ProviderQuery {
	for _, predicate := range cursorsToPredicates(
		p.order.Direction, after, before,
		p.order.Field.field, DefaultProviderOrder.Field.field,
	) {
		query = query.Where(predicate)
	}
	return query
}

func (p *providerPager) applyOrder(query *ProviderQuery, reverse bool) *ProviderQuery {
	direction := p.order.Direction
	if reverse {
		direction = direction.reverse()
	}
	query = query.Order(direction.orderFunc(p.order.Field.field))
	if p.order.Field != DefaultProviderOrder.Field {
		query = query.Order(direction.orderFunc(DefaultProviderOrder.Field.field))
	}
	return query
}

// Paginate executes the query and returns a relay based cursor connection to Provider.
func (pr *ProviderQuery) Paginate(
	ctx context.Context, after *Cursor, first *int,
	before *Cursor, last *int, opts ...ProviderPaginateOption,
) (*ProviderConnection, error) {
	if err := validateFirstLast(first, last); err != nil {
		return nil, err
	}
	pager, err := newProviderPager(opts)
	if err != nil {
		return nil, err
	}

	if pr, err = pager.applyFilter(pr); err != nil {
		return nil, err
	}

	conn := &ProviderConnection{Edges: []*ProviderEdge{}}
	if !hasCollectedField(ctx, edgesField) || first != nil && *first == 0 || last != nil && *last == 0 {
		if hasCollectedField(ctx, totalCountField) ||
			hasCollectedField(ctx, pageInfoField) {
			count, err := pr.Count(ctx)
			if err != nil {
				return nil, err
			}
			conn.TotalCount = count
			conn.PageInfo.HasNextPage = first != nil && count > 0
			conn.PageInfo.HasPreviousPage = last != nil && count > 0
		}
		return conn, nil
	}

	if (after != nil || first != nil || before != nil || last != nil) && hasCollectedField(ctx, totalCountField) {
		count, err := pr.Clone().Count(ctx)
		if err != nil {
			return nil, err
		}
		conn.TotalCount = count
	}

	pr = pager.applyCursors(pr, after, before)
	pr = pager.applyOrder(pr, last != nil)
	var limit int
	if first != nil {
		limit = *first + 1
	} else if last != nil {
		limit = *last + 1
	}
	if limit > 0 {
		pr = pr.Limit(limit)
	}

	if field := getCollectedField(ctx, edgesField, nodeField); field != nil {
		pr = pr.collectField(graphql.GetOperationContext(ctx), *field)
	}

	nodes, err := pr.All(ctx)
	if err != nil || len(nodes) == 0 {
		return conn, err
	}

	if len(nodes) == limit {
		conn.PageInfo.HasNextPage = first != nil
		conn.PageInfo.HasPreviousPage = last != nil
		nodes = nodes[:len(nodes)-1]
	}

	var nodeAt func(int) *Provider
	if last != nil {
		n := len(nodes) - 1
		nodeAt = func(i int) *Provider {
			return nodes[n-i]
		}
	} else {
		nodeAt = func(i int) *Provider {
			return nodes[i]
		}
	}

	conn.Edges = make([]*ProviderEdge, len(nodes))
	for i := range nodes {
		node := nodeAt(i)
		conn.Edges[i] = &ProviderEdge{
			Node:   node,
			Cursor: pager.toCursor(node),
		}
	}

	conn.PageInfo.StartCursor = &conn.Edges[0].Cursor
	conn.PageInfo.EndCursor = &conn.Edges[len(conn.Edges)-1].Cursor
	if conn.TotalCount == 0 {
		conn.TotalCount = len(nodes)
	}

	return conn, nil
}

// ProviderOrderField defines the ordering field of Provider.
type ProviderOrderField struct {
	field    string
	toCursor func(*Provider) Cursor
}

// ProviderOrder defines the ordering of Provider.
type ProviderOrder struct {
	Direction OrderDirection      `json:"direction"`
	Field     *ProviderOrderField `json:"field"`
}

// DefaultProviderOrder is the default ordering of Provider.
var DefaultProviderOrder = &ProviderOrder{
	Direction: OrderDirectionAsc,
	Field: &ProviderOrderField{
		field: provider.FieldID,
		toCursor: func(pr *Provider) Cursor {
			return Cursor{ID: pr.ID}
		},
	},
}

// ToEdge converts Provider into ProviderEdge.
func (pr *Provider) ToEdge(order *ProviderOrder) *ProviderEdge {
	if order == nil {
		order = DefaultProviderOrder
	}
	return &ProviderEdge{
		Node:   pr,
		Cursor: order.Field.toCursor(pr),
	}
}

// TeamEdge is the edge representation of Team.
type TeamEdge struct {
	Node   *Team  `json:"node"`
	Cursor Cursor `json:"cursor"`
}

// TeamConnection is the connection containing edges to Team.
type TeamConnection struct {
	Edges      []*TeamEdge `json:"edges"`
	PageInfo   PageInfo    `json:"pageInfo"`
	TotalCount int         `json:"totalCount"`
}

// TeamPaginateOption enables pagination customization.
type TeamPaginateOption func(*teamPager) error

// WithTeamOrder configures pagination ordering.
func WithTeamOrder(order *TeamOrder) TeamPaginateOption {
	if order == nil {
		order = DefaultTeamOrder
	}
	o := *order
	return func(pager *teamPager) error {
		if err := o.Direction.Validate(); err != nil {
			return err
		}
		if o.Field == nil {
			o.Field = DefaultTeamOrder.Field
		}
		pager.order = &o
		return nil
	}
}

// WithTeamFilter configures pagination filter.
func WithTeamFilter(filter func(*TeamQuery) (*TeamQuery, error)) TeamPaginateOption {
	return func(pager *teamPager) error {
		if filter == nil {
			return errors.New("TeamQuery filter cannot be nil")
		}
		pager.filter = filter
		return nil
	}
}

type teamPager struct {
	order  *TeamOrder
	filter func(*TeamQuery) (*TeamQuery, error)
}

func newTeamPager(opts []TeamPaginateOption) (*teamPager, error) {
	pager := &teamPager{}
	for _, opt := range opts {
		if err := opt(pager); err != nil {
			return nil, err
		}
	}
	if pager.order == nil {
		pager.order = DefaultTeamOrder
	}
	return pager, nil
}

func (p *teamPager) applyFilter(query *TeamQuery) (*TeamQuery, error) {
	if p.filter != nil {
		return p.filter(query)
	}
	return query, nil
}

func (p *teamPager) toCursor(t *Team) Cursor {
	return p.order.Field.toCursor(t)
}

func (p *teamPager) applyCursors(query *TeamQuery, after, before *Cursor) *TeamQuery {
	for _, predicate := range cursorsToPredicates(
		p.order.Direction, after, before,
		p.order.Field.field, DefaultTeamOrder.Field.field,
	) {
		query = query.Where(predicate)
	}
	return query
}

func (p *teamPager) applyOrder(query *TeamQuery, reverse bool) *TeamQuery {
	direction := p.order.Direction
	if reverse {
		direction = direction.reverse()
	}
	query = query.Order(direction.orderFunc(p.order.Field.field))
	if p.order.Field != DefaultTeamOrder.Field {
		query = query.Order(direction.orderFunc(DefaultTeamOrder.Field.field))
	}
	return query
}

// Paginate executes the query and returns a relay based cursor connection to Team.
func (t *TeamQuery) Paginate(
	ctx context.Context, after *Cursor, first *int,
	before *Cursor, last *int, opts ...TeamPaginateOption,
) (*TeamConnection, error) {
	if err := validateFirstLast(first, last); err != nil {
		return nil, err
	}
	pager, err := newTeamPager(opts)
	if err != nil {
		return nil, err
	}

	if t, err = pager.applyFilter(t); err != nil {
		return nil, err
	}

	conn := &TeamConnection{Edges: []*TeamEdge{}}
	if !hasCollectedField(ctx, edgesField) || first != nil && *first == 0 || last != nil && *last == 0 {
		if hasCollectedField(ctx, totalCountField) ||
			hasCollectedField(ctx, pageInfoField) {
			count, err := t.Count(ctx)
			if err != nil {
				return nil, err
			}
			conn.TotalCount = count
			conn.PageInfo.HasNextPage = first != nil && count > 0
			conn.PageInfo.HasPreviousPage = last != nil && count > 0
		}
		return conn, nil
	}

	if (after != nil || first != nil || before != nil || last != nil) && hasCollectedField(ctx, totalCountField) {
		count, err := t.Clone().Count(ctx)
		if err != nil {
			return nil, err
		}
		conn.TotalCount = count
	}

	t = pager.applyCursors(t, after, before)
	t = pager.applyOrder(t, last != nil)
	var limit int
	if first != nil {
		limit = *first + 1
	} else if last != nil {
		limit = *last + 1
	}
	if limit > 0 {
		t = t.Limit(limit)
	}

	if field := getCollectedField(ctx, edgesField, nodeField); field != nil {
		t = t.collectField(graphql.GetOperationContext(ctx), *field)
	}

	nodes, err := t.All(ctx)
	if err != nil || len(nodes) == 0 {
		return conn, err
	}

	if len(nodes) == limit {
		conn.PageInfo.HasNextPage = first != nil
		conn.PageInfo.HasPreviousPage = last != nil
		nodes = nodes[:len(nodes)-1]
	}

	var nodeAt func(int) *Team
	if last != nil {
		n := len(nodes) - 1
		nodeAt = func(i int) *Team {
			return nodes[n-i]
		}
	} else {
		nodeAt = func(i int) *Team {
			return nodes[i]
		}
	}

	conn.Edges = make([]*TeamEdge, len(nodes))
	for i := range nodes {
		node := nodeAt(i)
		conn.Edges[i] = &TeamEdge{
			Node:   node,
			Cursor: pager.toCursor(node),
		}
	}

	conn.PageInfo.StartCursor = &conn.Edges[0].Cursor
	conn.PageInfo.EndCursor = &conn.Edges[len(conn.Edges)-1].Cursor
	if conn.TotalCount == 0 {
		conn.TotalCount = len(nodes)
	}

	return conn, nil
}

// TeamOrderField defines the ordering field of Team.
type TeamOrderField struct {
	field    string
	toCursor func(*Team) Cursor
}

// TeamOrder defines the ordering of Team.
type TeamOrder struct {
	Direction OrderDirection  `json:"direction"`
	Field     *TeamOrderField `json:"field"`
}

// DefaultTeamOrder is the default ordering of Team.
var DefaultTeamOrder = &TeamOrder{
	Direction: OrderDirectionAsc,
	Field: &TeamOrderField{
		field: team.FieldID,
		toCursor: func(t *Team) Cursor {
			return Cursor{ID: t.ID}
		},
	},
}

// ToEdge converts Team into TeamEdge.
func (t *Team) ToEdge(order *TeamOrder) *TeamEdge {
	if order == nil {
		order = DefaultTeamOrder
	}
	return &TeamEdge{
		Node:   t,
		Cursor: order.Field.toCursor(t),
	}
}

// TokenEdge is the edge representation of Token.
type TokenEdge struct {
	Node   *Token `json:"node"`
	Cursor Cursor `json:"cursor"`
}

// TokenConnection is the connection containing edges to Token.
type TokenConnection struct {
	Edges      []*TokenEdge `json:"edges"`
	PageInfo   PageInfo     `json:"pageInfo"`
	TotalCount int          `json:"totalCount"`
}

// TokenPaginateOption enables pagination customization.
type TokenPaginateOption func(*tokenPager) error

// WithTokenOrder configures pagination ordering.
func WithTokenOrder(order *TokenOrder) TokenPaginateOption {
	if order == nil {
		order = DefaultTokenOrder
	}
	o := *order
	return func(pager *tokenPager) error {
		if err := o.Direction.Validate(); err != nil {
			return err
		}
		if o.Field == nil {
			o.Field = DefaultTokenOrder.Field
		}
		pager.order = &o
		return nil
	}
}

// WithTokenFilter configures pagination filter.
func WithTokenFilter(filter func(*TokenQuery) (*TokenQuery, error)) TokenPaginateOption {
	return func(pager *tokenPager) error {
		if filter == nil {
			return errors.New("TokenQuery filter cannot be nil")
		}
		pager.filter = filter
		return nil
	}
}

type tokenPager struct {
	order  *TokenOrder
	filter func(*TokenQuery) (*TokenQuery, error)
}

func newTokenPager(opts []TokenPaginateOption) (*tokenPager, error) {
	pager := &tokenPager{}
	for _, opt := range opts {
		if err := opt(pager); err != nil {
			return nil, err
		}
	}
	if pager.order == nil {
		pager.order = DefaultTokenOrder
	}
	return pager, nil
}

func (p *tokenPager) applyFilter(query *TokenQuery) (*TokenQuery, error) {
	if p.filter != nil {
		return p.filter(query)
	}
	return query, nil
}

func (p *tokenPager) toCursor(t *Token) Cursor {
	return p.order.Field.toCursor(t)
}

func (p *tokenPager) applyCursors(query *TokenQuery, after, before *Cursor) *TokenQuery {
	for _, predicate := range cursorsToPredicates(
		p.order.Direction, after, before,
		p.order.Field.field, DefaultTokenOrder.Field.field,
	) {
		query = query.Where(predicate)
	}
	return query
}

func (p *tokenPager) applyOrder(query *TokenQuery, reverse bool) *TokenQuery {
	direction := p.order.Direction
	if reverse {
		direction = direction.reverse()
	}
	query = query.Order(direction.orderFunc(p.order.Field.field))
	if p.order.Field != DefaultTokenOrder.Field {
		query = query.Order(direction.orderFunc(DefaultTokenOrder.Field.field))
	}
	return query
}

// Paginate executes the query and returns a relay based cursor connection to Token.
func (t *TokenQuery) Paginate(
	ctx context.Context, after *Cursor, first *int,
	before *Cursor, last *int, opts ...TokenPaginateOption,
) (*TokenConnection, error) {
	if err := validateFirstLast(first, last); err != nil {
		return nil, err
	}
	pager, err := newTokenPager(opts)
	if err != nil {
		return nil, err
	}

	if t, err = pager.applyFilter(t); err != nil {
		return nil, err
	}

	conn := &TokenConnection{Edges: []*TokenEdge{}}
	if !hasCollectedField(ctx, edgesField) || first != nil && *first == 0 || last != nil && *last == 0 {
		if hasCollectedField(ctx, totalCountField) ||
			hasCollectedField(ctx, pageInfoField) {
			count, err := t.Count(ctx)
			if err != nil {
				return nil, err
			}
			conn.TotalCount = count
			conn.PageInfo.HasNextPage = first != nil && count > 0
			conn.PageInfo.HasPreviousPage = last != nil && count > 0
		}
		return conn, nil
	}

	if (after != nil || first != nil || before != nil || last != nil) && hasCollectedField(ctx, totalCountField) {
		count, err := t.Clone().Count(ctx)
		if err != nil {
			return nil, err
		}
		conn.TotalCount = count
	}

	t = pager.applyCursors(t, after, before)
	t = pager.applyOrder(t, last != nil)
	var limit int
	if first != nil {
		limit = *first + 1
	} else if last != nil {
		limit = *last + 1
	}
	if limit > 0 {
		t = t.Limit(limit)
	}

	if field := getCollectedField(ctx, edgesField, nodeField); field != nil {
		t = t.collectField(graphql.GetOperationContext(ctx), *field)
	}

	nodes, err := t.All(ctx)
	if err != nil || len(nodes) == 0 {
		return conn, err
	}

	if len(nodes) == limit {
		conn.PageInfo.HasNextPage = first != nil
		conn.PageInfo.HasPreviousPage = last != nil
		nodes = nodes[:len(nodes)-1]
	}

	var nodeAt func(int) *Token
	if last != nil {
		n := len(nodes) - 1
		nodeAt = func(i int) *Token {
			return nodes[n-i]
		}
	} else {
		nodeAt = func(i int) *Token {
			return nodes[i]
		}
	}

	conn.Edges = make([]*TokenEdge, len(nodes))
	for i := range nodes {
		node := nodeAt(i)
		conn.Edges[i] = &TokenEdge{
			Node:   node,
			Cursor: pager.toCursor(node),
		}
	}

	conn.PageInfo.StartCursor = &conn.Edges[0].Cursor
	conn.PageInfo.EndCursor = &conn.Edges[len(conn.Edges)-1].Cursor
	if conn.TotalCount == 0 {
		conn.TotalCount = len(nodes)
	}

	return conn, nil
}

// TokenOrderField defines the ordering field of Token.
type TokenOrderField struct {
	field    string
	toCursor func(*Token) Cursor
}

// TokenOrder defines the ordering of Token.
type TokenOrder struct {
	Direction OrderDirection   `json:"direction"`
	Field     *TokenOrderField `json:"field"`
}

// DefaultTokenOrder is the default ordering of Token.
var DefaultTokenOrder = &TokenOrder{
	Direction: OrderDirectionAsc,
	Field: &TokenOrderField{
		field: token.FieldID,
		toCursor: func(t *Token) Cursor {
			return Cursor{ID: t.ID}
		},
	},
}

// ToEdge converts Token into TokenEdge.
func (t *Token) ToEdge(order *TokenOrder) *TokenEdge {
	if order == nil {
		order = DefaultTokenOrder
	}
	return &TokenEdge{
		Node:   t,
		Cursor: order.Field.toCursor(t),
	}
}

// UserEdge is the edge representation of User.
type UserEdge struct {
	Node   *User  `json:"node"`
	Cursor Cursor `json:"cursor"`
}

// UserConnection is the connection containing edges to User.
type UserConnection struct {
	Edges      []*UserEdge `json:"edges"`
	PageInfo   PageInfo    `json:"pageInfo"`
	TotalCount int         `json:"totalCount"`
}

// UserPaginateOption enables pagination customization.
type UserPaginateOption func(*userPager) error

// WithUserOrder configures pagination ordering.
func WithUserOrder(order *UserOrder) UserPaginateOption {
	if order == nil {
		order = DefaultUserOrder
	}
	o := *order
	return func(pager *userPager) error {
		if err := o.Direction.Validate(); err != nil {
			return err
		}
		if o.Field == nil {
			o.Field = DefaultUserOrder.Field
		}
		pager.order = &o
		return nil
	}
}

// WithUserFilter configures pagination filter.
func WithUserFilter(filter func(*UserQuery) (*UserQuery, error)) UserPaginateOption {
	return func(pager *userPager) error {
		if filter == nil {
			return errors.New("UserQuery filter cannot be nil")
		}
		pager.filter = filter
		return nil
	}
}

type userPager struct {
	order  *UserOrder
	filter func(*UserQuery) (*UserQuery, error)
}

func newUserPager(opts []UserPaginateOption) (*userPager, error) {
	pager := &userPager{}
	for _, opt := range opts {
		if err := opt(pager); err != nil {
			return nil, err
		}
	}
	if pager.order == nil {
		pager.order = DefaultUserOrder
	}
	return pager, nil
}

func (p *userPager) applyFilter(query *UserQuery) (*UserQuery, error) {
	if p.filter != nil {
		return p.filter(query)
	}
	return query, nil
}

func (p *userPager) toCursor(u *User) Cursor {
	return p.order.Field.toCursor(u)
}

func (p *userPager) applyCursors(query *UserQuery, after, before *Cursor) *UserQuery {
	for _, predicate := range cursorsToPredicates(
		p.order.Direction, after, before,
		p.order.Field.field, DefaultUserOrder.Field.field,
	) {
		query = query.Where(predicate)
	}
	return query
}

func (p *userPager) applyOrder(query *UserQuery, reverse bool) *UserQuery {
	direction := p.order.Direction
	if reverse {
		direction = direction.reverse()
	}
	query = query.Order(direction.orderFunc(p.order.Field.field))
	if p.order.Field != DefaultUserOrder.Field {
		query = query.Order(direction.orderFunc(DefaultUserOrder.Field.field))
	}
	return query
}

// Paginate executes the query and returns a relay based cursor connection to User.
func (u *UserQuery) Paginate(
	ctx context.Context, after *Cursor, first *int,
	before *Cursor, last *int, opts ...UserPaginateOption,
) (*UserConnection, error) {
	if err := validateFirstLast(first, last); err != nil {
		return nil, err
	}
	pager, err := newUserPager(opts)
	if err != nil {
		return nil, err
	}

	if u, err = pager.applyFilter(u); err != nil {
		return nil, err
	}

	conn := &UserConnection{Edges: []*UserEdge{}}
	if !hasCollectedField(ctx, edgesField) || first != nil && *first == 0 || last != nil && *last == 0 {
		if hasCollectedField(ctx, totalCountField) ||
			hasCollectedField(ctx, pageInfoField) {
			count, err := u.Count(ctx)
			if err != nil {
				return nil, err
			}
			conn.TotalCount = count
			conn.PageInfo.HasNextPage = first != nil && count > 0
			conn.PageInfo.HasPreviousPage = last != nil && count > 0
		}
		return conn, nil
	}

	if (after != nil || first != nil || before != nil || last != nil) && hasCollectedField(ctx, totalCountField) {
		count, err := u.Clone().Count(ctx)
		if err != nil {
			return nil, err
		}
		conn.TotalCount = count
	}

	u = pager.applyCursors(u, after, before)
	u = pager.applyOrder(u, last != nil)
	var limit int
	if first != nil {
		limit = *first + 1
	} else if last != nil {
		limit = *last + 1
	}
	if limit > 0 {
		u = u.Limit(limit)
	}

	if field := getCollectedField(ctx, edgesField, nodeField); field != nil {
		u = u.collectField(graphql.GetOperationContext(ctx), *field)
	}

	nodes, err := u.All(ctx)
	if err != nil || len(nodes) == 0 {
		return conn, err
	}

	if len(nodes) == limit {
		conn.PageInfo.HasNextPage = first != nil
		conn.PageInfo.HasPreviousPage = last != nil
		nodes = nodes[:len(nodes)-1]
	}

	var nodeAt func(int) *User
	if last != nil {
		n := len(nodes) - 1
		nodeAt = func(i int) *User {
			return nodes[n-i]
		}
	} else {
		nodeAt = func(i int) *User {
			return nodes[i]
		}
	}

	conn.Edges = make([]*UserEdge, len(nodes))
	for i := range nodes {
		node := nodeAt(i)
		conn.Edges[i] = &UserEdge{
			Node:   node,
			Cursor: pager.toCursor(node),
		}
	}

	conn.PageInfo.StartCursor = &conn.Edges[0].Cursor
	conn.PageInfo.EndCursor = &conn.Edges[len(conn.Edges)-1].Cursor
	if conn.TotalCount == 0 {
		conn.TotalCount = len(nodes)
	}

	return conn, nil
}

// UserOrderField defines the ordering field of User.
type UserOrderField struct {
	field    string
	toCursor func(*User) Cursor
}

// UserOrder defines the ordering of User.
type UserOrder struct {
	Direction OrderDirection  `json:"direction"`
	Field     *UserOrderField `json:"field"`
}

// DefaultUserOrder is the default ordering of User.
var DefaultUserOrder = &UserOrder{
	Direction: OrderDirectionAsc,
	Field: &UserOrderField{
		field: user.FieldID,
		toCursor: func(u *User) Cursor {
			return Cursor{ID: u.ID}
		},
	},
}

// ToEdge converts User into UserEdge.
func (u *User) ToEdge(order *UserOrder) *UserEdge {
	if order == nil {
		order = DefaultUserOrder
	}
	return &UserEdge{
		Node:   u,
		Cursor: order.Field.toCursor(u),
	}
}

// VmObjectEdge is the edge representation of VmObject.
type VmObjectEdge struct {
	Node   *VmObject `json:"node"`
	Cursor Cursor    `json:"cursor"`
}

// VmObjectConnection is the connection containing edges to VmObject.
type VmObjectConnection struct {
	Edges      []*VmObjectEdge `json:"edges"`
	PageInfo   PageInfo        `json:"pageInfo"`
	TotalCount int             `json:"totalCount"`
}

// VmObjectPaginateOption enables pagination customization.
type VmObjectPaginateOption func(*vmObjectPager) error

// WithVmObjectOrder configures pagination ordering.
func WithVmObjectOrder(order *VmObjectOrder) VmObjectPaginateOption {
	if order == nil {
		order = DefaultVmObjectOrder
	}
	o := *order
	return func(pager *vmObjectPager) error {
		if err := o.Direction.Validate(); err != nil {
			return err
		}
		if o.Field == nil {
			o.Field = DefaultVmObjectOrder.Field
		}
		pager.order = &o
		return nil
	}
}

// WithVmObjectFilter configures pagination filter.
func WithVmObjectFilter(filter func(*VmObjectQuery) (*VmObjectQuery, error)) VmObjectPaginateOption {
	return func(pager *vmObjectPager) error {
		if filter == nil {
			return errors.New("VmObjectQuery filter cannot be nil")
		}
		pager.filter = filter
		return nil
	}
}

type vmObjectPager struct {
	order  *VmObjectOrder
	filter func(*VmObjectQuery) (*VmObjectQuery, error)
}

func newVmObjectPager(opts []VmObjectPaginateOption) (*vmObjectPager, error) {
	pager := &vmObjectPager{}
	for _, opt := range opts {
		if err := opt(pager); err != nil {
			return nil, err
		}
	}
	if pager.order == nil {
		pager.order = DefaultVmObjectOrder
	}
	return pager, nil
}

func (p *vmObjectPager) applyFilter(query *VmObjectQuery) (*VmObjectQuery, error) {
	if p.filter != nil {
		return p.filter(query)
	}
	return query, nil
}

func (p *vmObjectPager) toCursor(vo *VmObject) Cursor {
	return p.order.Field.toCursor(vo)
}

func (p *vmObjectPager) applyCursors(query *VmObjectQuery, after, before *Cursor) *VmObjectQuery {
	for _, predicate := range cursorsToPredicates(
		p.order.Direction, after, before,
		p.order.Field.field, DefaultVmObjectOrder.Field.field,
	) {
		query = query.Where(predicate)
	}
	return query
}

func (p *vmObjectPager) applyOrder(query *VmObjectQuery, reverse bool) *VmObjectQuery {
	direction := p.order.Direction
	if reverse {
		direction = direction.reverse()
	}
	query = query.Order(direction.orderFunc(p.order.Field.field))
	if p.order.Field != DefaultVmObjectOrder.Field {
		query = query.Order(direction.orderFunc(DefaultVmObjectOrder.Field.field))
	}
	return query
}

// Paginate executes the query and returns a relay based cursor connection to VmObject.
func (vo *VmObjectQuery) Paginate(
	ctx context.Context, after *Cursor, first *int,
	before *Cursor, last *int, opts ...VmObjectPaginateOption,
) (*VmObjectConnection, error) {
	if err := validateFirstLast(first, last); err != nil {
		return nil, err
	}
	pager, err := newVmObjectPager(opts)
	if err != nil {
		return nil, err
	}

	if vo, err = pager.applyFilter(vo); err != nil {
		return nil, err
	}

	conn := &VmObjectConnection{Edges: []*VmObjectEdge{}}
	if !hasCollectedField(ctx, edgesField) || first != nil && *first == 0 || last != nil && *last == 0 {
		if hasCollectedField(ctx, totalCountField) ||
			hasCollectedField(ctx, pageInfoField) {
			count, err := vo.Count(ctx)
			if err != nil {
				return nil, err
			}
			conn.TotalCount = count
			conn.PageInfo.HasNextPage = first != nil && count > 0
			conn.PageInfo.HasPreviousPage = last != nil && count > 0
		}
		return conn, nil
	}

	if (after != nil || first != nil || before != nil || last != nil) && hasCollectedField(ctx, totalCountField) {
		count, err := vo.Clone().Count(ctx)
		if err != nil {
			return nil, err
		}
		conn.TotalCount = count
	}

	vo = pager.applyCursors(vo, after, before)
	vo = pager.applyOrder(vo, last != nil)
	var limit int
	if first != nil {
		limit = *first + 1
	} else if last != nil {
		limit = *last + 1
	}
	if limit > 0 {
		vo = vo.Limit(limit)
	}

	if field := getCollectedField(ctx, edgesField, nodeField); field != nil {
		vo = vo.collectField(graphql.GetOperationContext(ctx), *field)
	}

	nodes, err := vo.All(ctx)
	if err != nil || len(nodes) == 0 {
		return conn, err
	}

	if len(nodes) == limit {
		conn.PageInfo.HasNextPage = first != nil
		conn.PageInfo.HasPreviousPage = last != nil
		nodes = nodes[:len(nodes)-1]
	}

	var nodeAt func(int) *VmObject
	if last != nil {
		n := len(nodes) - 1
		nodeAt = func(i int) *VmObject {
			return nodes[n-i]
		}
	} else {
		nodeAt = func(i int) *VmObject {
			return nodes[i]
		}
	}

	conn.Edges = make([]*VmObjectEdge, len(nodes))
	for i := range nodes {
		node := nodeAt(i)
		conn.Edges[i] = &VmObjectEdge{
			Node:   node,
			Cursor: pager.toCursor(node),
		}
	}

	conn.PageInfo.StartCursor = &conn.Edges[0].Cursor
	conn.PageInfo.EndCursor = &conn.Edges[len(conn.Edges)-1].Cursor
	if conn.TotalCount == 0 {
		conn.TotalCount = len(nodes)
	}

	return conn, nil
}

// VmObjectOrderField defines the ordering field of VmObject.
type VmObjectOrderField struct {
	field    string
	toCursor func(*VmObject) Cursor
}

// VmObjectOrder defines the ordering of VmObject.
type VmObjectOrder struct {
	Direction OrderDirection      `json:"direction"`
	Field     *VmObjectOrderField `json:"field"`
}

// DefaultVmObjectOrder is the default ordering of VmObject.
var DefaultVmObjectOrder = &VmObjectOrder{
	Direction: OrderDirectionAsc,
	Field: &VmObjectOrderField{
		field: vmobject.FieldID,
		toCursor: func(vo *VmObject) Cursor {
			return Cursor{ID: vo.ID}
		},
	},
}

// ToEdge converts VmObject into VmObjectEdge.
func (vo *VmObject) ToEdge(order *VmObjectOrder) *VmObjectEdge {
	if order == nil {
		order = DefaultVmObjectOrder
	}
	return &VmObjectEdge{
		Node:   vo,
		Cursor: order.Field.toCursor(vo),
	}
}
