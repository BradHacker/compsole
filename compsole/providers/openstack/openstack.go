package openstack

import (
	"encoding/json"
	"fmt"
	"net/url"
	"path"
	"strings"

	"github.com/BradHacker/compsole/compsole/utils"
	"github.com/BradHacker/compsole/ent"
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/diagnostics"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/remoteconsoles"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/startstop"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/servers"
	"github.com/gophercloud/gophercloud/pagination"
)

// #########
// # TYPES #
// #########
type CompsoleProviderOpenstack struct {
	Config OpenstackConfig
}

type OpenstackConfig struct {
	AuthUrl          string `json:"auth_url"`
	IdentityVersion  string `json:"identify_version"`
	NovaMicroversion string `json:"nova_microversion,omitempty"`
	Username         string `json:"username"`
	Password         string `json:"password"`
	ProjectID        string `json:"project_id"`
	ProjectName      string `json:"project_name"`
	RegionName       string `json:"region_name"`
	DomainName       string `json:"domain_name"`
	DomainId         string `json:"domain_id"`
}

const (
	NOVNC  utils.ConsoleType = "NOVNC"
	SPICE  utils.ConsoleType = "SPICE"
	RDP    utils.ConsoleType = "RDP"
	SERIAL utils.ConsoleType = "SERIAL"
	MKS    utils.ConsoleType = "MKS"
)

// ############
// # METADATA #
// ############
const (
	ID      string = "OPENSTACK"
	Name    string = "Bradley Harker"
	Author  string = "BradHacker"
	Version string = "v0.1"
)

func (provider CompsoleProviderOpenstack) ID() string      { return ID }
func (provider CompsoleProviderOpenstack) Name() string    { return Name }
func (provider CompsoleProviderOpenstack) Author() string  { return Author }
func (provider CompsoleProviderOpenstack) Version() string { return Version }

// #############
// # FUNCTIONS #
// #############
// NewOpenstackProvider creates a provider for the Openstack cloud provider
func NewOpenstackProvider(config string) (provider CompsoleProviderOpenstack, err error) {
	var providerConfig OpenstackConfig
	err = json.Unmarshal([]byte(config), &providerConfig)
	if err != nil {
		err = fmt.Errorf("failed to unmarshal Openstack config: %v", err)
		return
	}
	provider = CompsoleProviderOpenstack{
		Config: providerConfig,
	}
	return
}

func (provider CompsoleProviderOpenstack) newAuthProvider() (*gophercloud.ProviderClient, error) {
	u, err := url.Parse(provider.Config.AuthUrl)
	if err != nil {
		return nil, fmt.Errorf("unable to parse auth_url \"%s\" from Openstack provider config", provider.Config.AuthUrl)
	}
	u.Path = path.Join(u.Path, provider.Config.IdentityVersion)

	authOpts := gophercloud.AuthOptions{
		IdentityEndpoint: u.String(),
		Username:         provider.Config.Username,
		Password:         provider.Config.Password,
		TenantID:         provider.Config.ProjectID,
		TenantName:       provider.Config.ProjectName,
	}
	if provider.Config.DomainName != "" {
		authOpts.DomainName = provider.Config.DomainName
	} else {
		authOpts.DomainID = provider.Config.DomainId
	}
	return openstack.AuthenticatedClient(authOpts)
}

func (provider CompsoleProviderOpenstack) newComputeClient() (*gophercloud.ServiceClient, error) {
	// Generate authenticated compute client for Openstack
	gopherProvider, err := provider.newAuthProvider()
	if err != nil {
		return nil, fmt.Errorf("failed to authenticate with Openstack: %v", err)
	}
	computeClient, err := openstack.NewComputeV2(gopherProvider, gophercloud.EndpointOpts{
		Region: provider.Config.RegionName,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to make Openstack compute client: %v", err)
	}
	if provider.Config.NovaMicroversion != "" {
		computeClient.Microversion = provider.Config.NovaMicroversion
	} else {
		computeClient.Microversion = "2.8"
	}
	return computeClient, nil
}

func (provider CompsoleProviderOpenstack) GetConsoleUrl(vmObject *ent.VmObject, consoleType utils.ConsoleType) (string, error) {
	// Create Openstack compute client
	computeClient, err := provider.newComputeClient()
	if err != nil {
		return "", fmt.Errorf("failed to generate Openstack compute client: %v", err)
	}

	// Determine the type of console we want to generate
	var remoteConsoleProtocol remoteconsoles.ConsoleProtocol
	var remoteConsoleType remoteconsoles.ConsoleType
	switch consoleType {
	case NOVNC:
		remoteConsoleProtocol = remoteconsoles.ConsoleProtocolVNC
		remoteConsoleType = remoteconsoles.ConsoleTypeNoVNC
	case SPICE:
		remoteConsoleProtocol = remoteconsoles.ConsoleProtocolSPICE
		remoteConsoleType = remoteconsoles.ConsoleTypeSPICEHTML5
	case RDP:
		remoteConsoleProtocol = remoteconsoles.ConsoleProtocolRDP
		remoteConsoleType = remoteconsoles.ConsoleTypeRDPHTML5
	case SERIAL:
		remoteConsoleProtocol = remoteconsoles.ConsoleProtocolSerial
		remoteConsoleType = remoteconsoles.ConsoleTypeSerial
	case MKS:
		remoteConsoleProtocol = remoteconsoles.ConsoleProtocolMKS
		remoteConsoleType = remoteconsoles.ConsoleTypeWebMKS
	default:
		remoteConsoleProtocol = remoteconsoles.ConsoleProtocolVNC
		remoteConsoleType = remoteconsoles.ConsoleTypeNoVNC
	}

	// Create the remote console and return the URL
	remoteConsole, err := remoteconsoles.Create(computeClient, vmObject.Identifier, remoteconsoles.CreateOpts{
		Protocol: remoteConsoleProtocol,
		Type:     remoteConsoleType,
	}).Extract()
	if err != nil {
		return "", fmt.Errorf("failed to create Openstack remote console: %v", err)
	}
	finalURL := remoteConsole.URL
	if !strings.Contains(finalURL, "scale=true") {
		finalURL = finalURL + "&scale=true"
	}
	return finalURL, nil
}

func (provider CompsoleProviderOpenstack) GetPowerState(vmObject *ent.VmObject) (utils.PowerState, error) {
	// Create Openstack compute client
	computeClient, err := provider.newComputeClient()
	if err != nil {
		return "", fmt.Errorf("failed to generate Openstack compute client: %v", err)
	}

	// Create the remote console and return the URL
	diagnosticsResult, err := diagnostics.Get(computeClient, vmObject.Identifier).Extract()
	if err != nil {
		return "", fmt.Errorf("failed to get Openstack vm diagnostics: %v", err)
	}
	vmState, ok := diagnosticsResult["state"]
	if !ok {
		return "", fmt.Errorf("failed to parse diagnostics results for vm state: %v", err)
	}

	var powerState utils.PowerState
	switch vmState {
	case "pending":
		powerState = utils.Unknown
	case "running":
		powerState = utils.PoweredOn
	case "paused":
		powerState = utils.Suspended
	case "shutdown":
		powerState = utils.PoweredOff
	case "suspended":
		powerState = utils.Suspended
	case "crashed":
		powerState = utils.Unknown
	default:
		powerState = utils.Unknown
	}
	return powerState, nil
}

func (provider CompsoleProviderOpenstack) ListVMs() ([]*ent.VmObject, error) {
	// Create Openstack compute client
	computeClient, err := provider.newComputeClient()
	if err != nil {
		return nil, fmt.Errorf("failed to generate Openstack compute client: %v", err)
	}

	serverPager := servers.List(computeClient, servers.ListOpts{})
	if err != nil {
		return nil, fmt.Errorf("failed to get list of Openstack instances: %v", err)
	}
	serverList := make([]*ent.VmObject, 0)
	err = serverPager.EachPage(func(page pagination.Page) (bool, error) {
		list, err := servers.ExtractServers(page)
		if err != nil {
			return false, fmt.Errorf("failed to extract servers from page: %v", err)
		}

		for _, s := range list {
			addressPager := servers.ListAddresses(computeClient, s.ID)

			ipAddresses := make([]string, 0)
			err = addressPager.EachPage(func(p pagination.Page) (bool, error) {
				addressList, err := servers.ExtractAddresses(p)
				if err != nil {
					return false, fmt.Errorf("failed to extract ip addresses from page: %v", err)
				}

				for _, addresses := range addressList {
					for _, address := range addresses {
						ipAddresses = append(ipAddresses, address.Address)
					}
				}
				return true, nil
			})
			if err != nil {
				return false, fmt.Errorf("failed to iterate over ip addresses: %v", err)
			}
			serverList = append(serverList, &ent.VmObject{
				ID:          [16]byte{},
				Name:        s.Name,
				Identifier:  s.ID,
				IPAddresses: ipAddresses,
				Edges: ent.VmObjectEdges{
					VmObjectToTeam: nil,
				},
			})
		}
		return true, nil
	})
	if err != nil {
		return nil, fmt.Errorf("failed to iterate over servers: %v", err)
	}
	return serverList, nil
}

func (provider CompsoleProviderOpenstack) RestartVM(vmObject *ent.VmObject, rebootType utils.RebootType) error {
	// Generate authenticated compute client for Openstack
	gopherProvider, err := provider.newAuthProvider()
	if err != nil {
		return fmt.Errorf("failed to authenticate with Openstack: %v", err)
	}
	computeClient, err := openstack.NewComputeV2(gopherProvider, gophercloud.EndpointOpts{
		Region: provider.Config.RegionName,
	})
	if err != nil {
		return fmt.Errorf("failed to make Openstack compute client: %v", err)
	}
	// Determine which type of reboot to requests
	var rebootMethod servers.RebootMethod
	switch rebootType {
	case utils.SoftReboot:
		rebootMethod = servers.SoftReboot
	case utils.HardReboot:
		rebootMethod = servers.HardReboot
	default:
		rebootMethod = servers.SoftReboot
	}
	// Reboot the server
	err = servers.Reboot(computeClient, vmObject.Identifier, servers.RebootOpts{
		Type: rebootMethod,
	}).ExtractErr()
	if err != nil {
		return fmt.Errorf("failed to reboot server: %v", err)
	}
	return nil
}

func (provider CompsoleProviderOpenstack) PowerOnVM(vmObject *ent.VmObject) error {
	// Generate authenticated compute client for Openstack
	gopherProvider, err := provider.newAuthProvider()
	if err != nil {
		return fmt.Errorf("failed to authenticate with Openstack: %v", err)
	}
	computeClient, err := openstack.NewComputeV2(gopherProvider, gophercloud.EndpointOpts{
		Region: provider.Config.RegionName,
	})
	if err != nil {
		return fmt.Errorf("failed to make Openstack compute client: %v", err)
	}
	// Start the vm
	err = startstop.Start(computeClient, vmObject.Identifier).ExtractErr()
	if err != nil {
		return fmt.Errorf("failed to start server: %v", err)
	}
	return nil
}

func (provider CompsoleProviderOpenstack) PowerOffVM(vmObject *ent.VmObject) error {

	// Generate authenticated compute client for Openstack
	gopherProvider, err := provider.newAuthProvider()
	if err != nil {
		return fmt.Errorf("failed to authenticate with Openstack: %v", err)
	}
	computeClient, err := openstack.NewComputeV2(gopherProvider, gophercloud.EndpointOpts{
		Region: provider.Config.RegionName,
	})
	if err != nil {
		return fmt.Errorf("failed to make Openstack compute client: %v", err)
	}
	// Stop the vm
	err = startstop.Stop(computeClient, vmObject.Identifier).ExtractErr()
	if err != nil {
		return fmt.Errorf("failed to stop server: %v", err)
	}
	return nil
}
