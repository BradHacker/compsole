package providers

import (
	"fmt"

	"github.com/BradHacker/compsole/compsole/providers/openstack"
	"github.com/BradHacker/compsole/compsole/utils"
)

type CompsoleProvider interface {
	ID() string
	Name() string
	Author() string
	Version() string
	GetConsoleUrl(vmIdentifier string, consoleType utils.ConsoleType) (string, error)
	ListVMs() ([]utils.VmObject, error)
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
