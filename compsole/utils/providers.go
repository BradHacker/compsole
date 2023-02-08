package utils

import (
	"encoding/json"
	"fmt"
	"os"
)

type ConsoleType string

type RebootType string

type PowerState string

const (
	SoftReboot RebootType = "SOFT"
	HardReboot RebootType = "HARD"
)

const (
	PoweredOn    PowerState = "POWERED_ON"
	PoweredOff   PowerState = "POWERED_OFF"
	Rebooting    PowerState = "REBOOTING"
	ShuttingDown PowerState = "SHUTTING_DOWN"
	Suspended    PowerState = "SUSPENDED"
	Unknown      PowerState = "UNKNOWN"
)

// LoadProviderConfig is a helper function which loads the config file into a provider
func LoadProviderConfig(configFilePath string, config interface{}) error {
	// Read in the config file
	configBytes, err := os.ReadFile(configFilePath)
	if err != nil {
		return fmt.Errorf("failed to read config file \"%s\": %v", configFilePath, err)
	}
	// Marshal the config file into a ServerConfig object
	err = json.Unmarshal(configBytes, &config)
	if err != nil {
		return fmt.Errorf("failed to unmarshal server config (\"%s\"): %v", configFilePath, err)
	}
	return nil
}
