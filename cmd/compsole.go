package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"

	"github.com/BradHacker/compsole/compsole/providers"
	"github.com/BradHacker/compsole/compsole/providers/openstack"
	"github.com/BradHacker/compsole/compsole/utils"
	"github.com/BradHacker/compsole/ent"
)

func main() {
	printMainMenu()
}

func printMainMenu() {
	for {
		// Print banner and menu
		utils.PrintBanner()
		fmt.Print("\033[0;1m", `
1) Ingest VMs
2) Get VM Console
3) Dump all consoles
Q/q) Quit compsole

compsole:~$ `)
		// Get selection
		var selection string
		fmt.Scanln(&selection)
		if strings.ToLower(selection) == "q" {
			fmt.Println("\033[1;32mGoodbye!\033[0m")
			return
		}
		choice, err := strconv.Atoi(selection)
		if err != nil {
			fmt.Println("\033[1;31mError: That was not a number\nPress [ENTER] to continue...\033[0m")
			fmt.Scanln()
			continue
		}
		switch choice {
		case 1:
			ingestVms()
			break
		case 2:
			// TODO: get a vm console
			break
		case 3:
			// TODO: dump all vm consoles
			break
		default:
			fmt.Println("\033[1;31mError: That was not a valid choice\nPress [ENTER] to continue...\033[0m")
			fmt.Scanln()
			continue
		}
	}
}

func ingestVms() {
	for {
		// Print banner and menu
		utils.PrintBanner()
		fmt.Print("Select your \033[36;1mprovider\033[0;1m:\n",
			`
1) Openstack
Q/q) Exit to main menu

compsole:~$ `)
		// Get selection
		var selection string
		fmt.Scanln(&selection)
		if strings.ToLower(selection) == "q" {
			return
		}
		choice, err := strconv.Atoi(selection)
		if err != nil {
			fmt.Println("\033[1;31mError: That was not a number\nPress [ENTER] to continue...\033[0m")
			fmt.Scanln()
			continue
		}
		// Set the provider type based on selection
		var providerId string
		switch choice {
		case 1:
			providerId = openstack.ID
			break
		default:
			fmt.Println("\033[1;31mError: That was not a valid choice\nPress [ENTER] to continue...\033[0m")
			fmt.Scanln()
			continue
		}
		// Get the config file path
		var configPath string
		for {
			utils.PrintBanner()
			fmt.Printf("\033[0;1mEnter path for %s config file: \033[0m", providerId)
			fmt.Scanln(&configPath)
			configAbsPath, err := filepath.Abs(configPath)
			if _, noExistErr := os.Stat(configAbsPath); err != nil || noExistErr != nil {
				fmt.Println("\033[1;31mError: File does not exist\nPress [ENTER] to continue...\033[0m")
				fmt.Scanln()
				continue
			}
			configPath = configAbsPath
			break
		}
		// Create the provider
		provider, err := providers.NewProvider(providerId, configPath)
		if err != nil {
			fmt.Printf("\033[1;31mError: failed to create provider: %v\nPress [ENTER] to continue...\033[0m\n", err)
			fmt.Scanln()
			continue
		}
		// Get a list of the VMs
		vmObjects, err := provider.ListVMs()
		if err != nil {
			fmt.Printf("\033[1;31mError: failed to create provider: %v\nPress [ENTER] to continue...\033[0m\n", err)
			fmt.Scanln()
			continue
		}
		fmt.Print("\033[0;1mWhat is the name of the competition (will be created if does not exist) [default]: \033[0m")
		competitionName := "default"
		fmt.Scanln(&competitionName)
		fmt.Print("\033[0;1mHow many teams are required for the ingest (will be created if does not exist) [0]: \033[0m")
		teamCountInput := "0"
		fmt.Scanln(&teamCountInput)
		teamCount, err := strconv.Atoi(teamCountInput)
		if err != nil {
			teamCount = 0
		}
		vmDump := make(map[string][]*ent.VmObject)
		for i := 1; i <= teamCount; i++ {
			vmDump["team"+strconv.Itoa(i)] = make([]*ent.VmObject, 0)
		}
		vmDump["unsorted"] = vmObjects
		// Dump the VMs to a dump file
		vmDumpBytes, err := json.Marshal(vmDump)
		if err != nil {
			fmt.Printf("\033[1;31mError: failed to marshal vmObjects array: %v\nPress [ENTER] to continue...\033[0m\n", err)
			fmt.Scanln()
			continue
		}
		filename, _ := filepath.Abs(competitionName + "_dump.json")
		err = os.WriteFile(filename, vmDumpBytes, 0660)
		if err != nil {
			fmt.Printf("\033[1;31mError: failed to write dump to file: %v\nPress [ENTER] to continue...\033[0m\n", err)
			fmt.Scanln()
			continue
		}
		// Wait for modification so we can ingest the dump
		fmt.Printf("\n\033[0;1mWrote dump to \033[31m%s\033[0;1m. Please modify this file to reflect the proper ingest format and then press [ENTER]...", filename)
		fmt.Scanln()
	}
}

const (
	FieldNAME      int = 1
	FieldIPADDRESS int = 2
)

func filterVmList(vmObjects []*ent.VmObject) []*ent.VmObject {
	filteredVms := make([]*ent.VmObject, len(vmObjects))
	copy(filteredVms, vmObjects)
	for {
		fmt.Println("\033[0;1mVMs to Ingest:")
		for i, vmObject := range filteredVms {
			fmt.Printf("\033[0;1m%d) \033[33m%s \033[35m(%s) \033[34m%s\n", i, vmObject.Name, vmObject.Identifier, strings.Join(vmObject.IPAddresses, ","))
		}
		fmt.Print("\n\033[0;1mIs this list correct [Y/n/(r)eset]? ")
		var selection string
		fmt.Scanln(&selection)
		if strings.ToLower(selection) == "y" {
			break
		}
		if strings.ToLower(selection) == "r" {
			filteredVms = make([]*ent.VmObject, len(vmObjects))
			copy(filteredVms, vmObjects)
			continue
		}
		fmt.Print("\n\033[0;1mWhat would you like to filter on?\n", `
1) Name
2) IP Address
`)
		fmt.Scanln(&selection)
		fieldChoice, err := strconv.Atoi(selection)
		if err != nil {
			fmt.Println("\033[1;31mError: That was not a number\nPress [ENTER] to continue...\033[0m")
			fmt.Scanln()
			continue
		}
		fmt.Print("\n\033[0;1mEnter regex for filter: \033[0m")
		var filterRegex string
		fmt.Scanln(&filterRegex)
		// Filter the VMs
		filterVms := make([]*ent.VmObject, 0)
		for _, vm := range filteredVms {
			switch fieldChoice {
			case FieldNAME:
				if matched, _ := regexp.MatchString(filterRegex, vm.Name); matched {
					filterVms = append(filterVms, vm)
				}
				break
			case FieldIPADDRESS:
				for _, ip := range vm.IPAddresses {
					if matched, _ := regexp.MatchString(filterRegex, ip); matched {
						filterVms = append(filterVms, vm)
						break
					}
				}
				break
			}
		}
		fmt.Println("\n\033[0;1mVMs selected by filter: ")
		for i, vmObject := range filterVms {
			fmt.Printf("\033[0;1m%d) \033[33m%s \033[35m(%s) \033[34m%s\n", i, vmObject.Name, vmObject.Identifier, strings.Join(vmObject.IPAddresses, ","))
		}
		fmt.Print("\n\033[0;1mDo you want to \033[35mINCLUDE (I)\033[0;1m or \033[36mEXCLUDE (E)\033[0;1m these vms: \033[0m")
		var includeExcludeSelection string
		fmt.Scanln(&includeExcludeSelection)
		filterMap := make(map[string]*ent.VmObject, len(filterVms))
		for _, vmObject := range filterVms {
			filterMap[vmObject.Identifier] = vmObject
		}
		if strings.ToLower(includeExcludeSelection) == "e" {
			tempVms := make([]*ent.VmObject, 0)
			for _, vmObject := range filteredVms {
				if _, exists := filterMap[vmObject.Identifier]; !exists {
					tempVms = append(tempVms, vmObject)
				}
			}
			filteredVms = tempVms
			continue
		}
		if strings.ToLower(includeExcludeSelection) == "i" {
			filteredVms = filterVms
			continue
		}
	}

	return filteredVms
}
