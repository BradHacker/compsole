package openstack

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"path"
	"strings"

	"github.com/BradHacker/compsole/compsole/utils"
	"github.com/BradHacker/compsole/ent"
	"github.com/gophercloud/gophercloud/v2"
	"github.com/gophercloud/gophercloud/v2/openstack"
	"github.com/gophercloud/gophercloud/v2/openstack/compute/v2/remoteconsoles"
	"github.com/gophercloud/gophercloud/v2/openstack/compute/v2/servers"
	"github.com/gophercloud/gophercloud/v2/pagination"
)

// #########
// # TYPES #
// #########
type CompsoleProviderOpenstack struct {
	config         OpenstackConfig
	providerClient *gophercloud.ProviderClient
	computeClient  *gophercloud.ServiceClient
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
	Version string = "v0.2"
)

func (provider CompsoleProviderOpenstack) ID() string      { return ID }
func (provider CompsoleProviderOpenstack) Name() string    { return Name }
func (provider CompsoleProviderOpenstack) Author() string  { return Author }
func (provider CompsoleProviderOpenstack) Version() string { return Version }

// #############
// # FUNCTIONS #
// #############
// NewOpenstackProvider creates a provider for the Openstack cloud provider
func NewOpenstackProvider(ctx context.Context, config string) (provider CompsoleProviderOpenstack, err error) {
	// Parse the configs
	var providerConfig OpenstackConfig
	err = json.Unmarshal([]byte(config), &providerConfig)
	if err != nil {
		err = fmt.Errorf("failed to unmarshal Openstack config: %v", err)
		return
	}

	// Generate an auth client
	u, err := url.Parse(providerConfig.AuthUrl)
	if err != nil {
		return CompsoleProviderOpenstack{}, fmt.Errorf("unable to parse auth_url \"%s\" from Openstack provider config", providerConfig.AuthUrl)
	}
	u.Path = path.Join(u.Path, providerConfig.IdentityVersion)
	authOpts := gophercloud.AuthOptions{
		IdentityEndpoint: u.String(),
		Username:         providerConfig.Username,
		Password:         providerConfig.Password,
		TenantID:         providerConfig.ProjectID,
		TenantName:       providerConfig.ProjectName,
	}
	if providerConfig.DomainName != "" {
		authOpts.DomainName = providerConfig.DomainName
	} else {
		authOpts.DomainID = providerConfig.DomainId
	}
	authClient, err := openstack.AuthenticatedClient(ctx, authOpts)
	if err != nil {
		return CompsoleProviderOpenstack{}, fmt.Errorf("failed to create auth client: %v", err)
	}

	// Generate a compute client
	computeClient, err := openstack.NewComputeV2(authClient, gophercloud.EndpointOpts{
		Region: providerConfig.RegionName,
	})
	if err != nil {
		return CompsoleProviderOpenstack{}, fmt.Errorf("failed to make Openstack compute client: %v", err)
	}
	if providerConfig.NovaMicroversion != "" {
		computeClient.Microversion = providerConfig.NovaMicroversion
	} else {
		computeClient.Microversion = "2.8"
	}

	return CompsoleProviderOpenstack{
		config:         providerConfig,
		providerClient: authClient,
		computeClient:  computeClient,
	}, nil
}

func (provider CompsoleProviderOpenstack) GetConsoleUrl(ctx context.Context, vmObject *ent.VmObject, consoleType utils.ConsoleType) (string, error) {
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
	remoteConsole, err := remoteconsoles.Create(ctx, provider.computeClient, vmObject.Identifier, remoteconsoles.CreateOpts{
		Protocol: remoteConsoleProtocol,
		Type:     remoteConsoleType,
	}).Extract()
	if err != nil {
		return "", fmt.Errorf("failed to create Openstack remote console: %v", err)
	}
	finalURL := remoteConsole.URL
	// Add auto-scaling to NoVNC urls
	if consoleType == NOVNC && !strings.Contains(finalURL, "scale=true") {
		finalURL = finalURL + "&scale=true"
	}
	return finalURL, nil
}

func (provider CompsoleProviderOpenstack) GetPowerState(ctx context.Context, vmObject *ent.VmObject) (utils.PowerState, error) {
	var serverResult servers.Server
	err := servers.Get(ctx, provider.computeClient, vmObject.Identifier).ExtractInto(&serverResult)
	if err != nil {
		return "", fmt.Errorf("failed to get Openstack server details: %v", err)
	}

	var powerState utils.PowerState
	switch serverResult.PowerState {
	// No State
	case servers.NOSTATE:
		powerState = utils.Unknown
	// Running
	case servers.RUNNING:
		powerState = utils.PoweredOn
	// Paused
	case servers.PAUSED:
		powerState = utils.Suspended
	// Shutdown
	case servers.SHUTDOWN:
		powerState = utils.PoweredOff
	// Crashed
	case servers.CRASHED:
		powerState = utils.Unknown
	// Suspended
	case servers.SUSPENDED:
		powerState = utils.Suspended
	default:
		powerState = utils.Unknown
	}
	return powerState, nil
}

func (provider CompsoleProviderOpenstack) ListVMs(ctx context.Context) ([]*ent.VmObject, error) {
	serverPager := servers.List(provider.computeClient, servers.ListOpts{})
	serverList := make([]*ent.VmObject, 0)
	err := serverPager.EachPage(ctx, func(ctx context.Context, page pagination.Page) (bool, error) {
		list, err := servers.ExtractServers(page)
		if err != nil {
			return false, fmt.Errorf("failed to extract servers from page: %v", err)
		}

		for _, s := range list {
			addressPager := servers.ListAddresses(provider.computeClient, s.ID)

			ipAddresses := make([]string, 0)
			err = addressPager.EachPage(ctx, func(ctx context.Context, p pagination.Page) (bool, error) {
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

func (provider CompsoleProviderOpenstack) RestartVM(ctx context.Context, vmObject *ent.VmObject, rebootType utils.RebootType) error {
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
	err := servers.Reboot(ctx, provider.computeClient, vmObject.Identifier, servers.RebootOpts{
		Type: rebootMethod,
	}).ExtractErr()
	if err != nil {
		return fmt.Errorf("failed to reboot server: %v", err)
	}
	return nil
}

func (provider CompsoleProviderOpenstack) PowerOnVM(ctx context.Context, vmObject *ent.VmObject) error {
	// Start the vm
	err := servers.Start(ctx, provider.computeClient, vmObject.Identifier).ExtractErr()
	if err != nil {
		return fmt.Errorf("failed to start server: %v", err)
	}
	return nil
}

func (provider CompsoleProviderOpenstack) PowerOffVM(ctx context.Context, vmObject *ent.VmObject) error {
	// Stop the vm
	err := servers.Stop(ctx, provider.computeClient, vmObject.Identifier).ExtractErr()
	if err != nil {
		return fmt.Errorf("failed to stop server: %v", err)
	}
	return nil
}
