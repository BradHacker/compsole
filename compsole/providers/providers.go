package providers

import (
	"fmt"

	"github.com/BradHacker/compsole/compsole/providers/openstack"
	"github.com/BradHacker/compsole/compsole/utils"
	"github.com/BradHacker/compsole/ent"
)

type CompsoleProvider interface {
	ID() string
	Name() string
	Author() string
	Version() string
	GetConsoleUrl(vmObject *ent.VmObject, consoleType utils.ConsoleType) (string, error)
	ListVMs() ([]*ent.VmObject, error)
	RestartVM(vmObject *ent.VmObject, rebootType utils.RebootType) error
	PowerOnVM(vmObject *ent.VmObject) error
	PowerOffVM(vmObject *ent.VmObject) error
}

func NewProvider(providerType string, configFilePath string) (provider CompsoleProvider, err error) {
	switch providerType {
	case openstack.ID:
		return openstack.NewOpenstackProvider(configFilePath)
	default:
		err = fmt.Errorf("invalid provider type")
		return
	}
}
