package openstack

import (
	"fmt"
	"net/url"
	"path"

	"github.com/BradHacker/compsole/compsole/utils"
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/remoteconsoles"
)

// #########
// # TYPES #
// #########
type CompsoleProviderOpenstack struct {
	Config OpenstackConfig
}

type OpenstackConfig struct {
	FilePath         string `json:"-"`
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
func NewOpenstackProvider(configFilePath string) (provider CompsoleProviderOpenstack, err error) {
	provider = CompsoleProviderOpenstack{
		Config: OpenstackConfig{
			FilePath: configFilePath,
		},
	}
	err = utils.LoadProviderConfig(configFilePath, &provider.Config)
	if err != nil {
		err = fmt.Errorf("failed to load Openstack provider config: %v", err)
		return
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

func (provider CompsoleProviderOpenstack) GetConsoleUrl(serverId string, consoleType utils.ConsoleType) (string, error) {
	// Generate authenticated compute client for Openstack
	gopherProvider, err := provider.newAuthProvider()
	if err != nil {
		return "", fmt.Errorf("failed to authenticate with Openstack: %v", err)
	}
	computeClient, err := openstack.NewComputeV2(gopherProvider, gophercloud.EndpointOpts{
		Region: provider.Config.RegionName,
	})
	if provider.Config.NovaMicroversion != "" {
		computeClient.Microversion = provider.Config.NovaMicroversion
	} else {
		computeClient.Microversion = "2.8"
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
	remoteConsole, err := remoteconsoles.Create(computeClient, serverId, remoteconsoles.CreateOpts{
		Protocol: remoteConsoleProtocol,
		Type:     remoteConsoleType,
	}).Extract()
	if err != nil {
		return "", fmt.Errorf("failed to create Openstack remote console: %v", err)
	}
	return remoteConsole.URL, nil
}
