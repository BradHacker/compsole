package providers

import (
	"encoding/json"
	"fmt"
	"sync"

	"github.com/BradHacker/compsole/compsole/providers/openstack"
	"github.com/BradHacker/compsole/compsole/utils"
	"github.com/BradHacker/compsole/ent"
	"github.com/google/uuid"
)

type CompsoleProvider interface {
	ID() string
	Name() string
	Author() string
	Version() string
	GetConsoleUrl(vmObject *ent.VmObject, consoleType utils.ConsoleType) (string, error)
	GetPowerState(vmObject *ent.VmObject) (utils.PowerState, error)
	ListVMs() ([]*ent.VmObject, error)
	RestartVM(vmObject *ent.VmObject, rebootType utils.RebootType) error
	PowerOnVM(vmObject *ent.VmObject) error
	PowerOffVM(vmObject *ent.VmObject) error
}

func NewProvider(providerType string, config string) (provider CompsoleProvider, err error) {
	switch providerType {
	case openstack.ID:
		return openstack.NewOpenstackProvider(config)
	default:
		err = fmt.Errorf("invalid provider type")
		return
	}
}

func ValidateConfig(providerType string, config string) error {
	switch providerType {
	case openstack.ID:
		var openstackConfig openstack.OpenstackConfig
		return json.Unmarshal([]byte(config), &openstackConfig)
	default:
		return fmt.Errorf("invalid provider type")
	}
}

type ProviderMap struct {
	*sync.Map
}

func (pm ProviderMap) Get(id uuid.UUID) (CompsoleProvider, error) {
	val, ok := pm.Load(id)
	if !ok {
		return nil, fmt.Errorf("provider %s not loaded", id)
	}
	p, ok := val.(CompsoleProvider)
	if !ok {
		return nil, fmt.Errorf("provider value is not a CompsoleProvider")
	}
	return p, nil
}

func (pm ProviderMap) Set(id uuid.UUID, p CompsoleProvider) {
	pm.Store(id, p)
}
