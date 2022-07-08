package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/BradHacker/compsole/compsole/providers"
	"github.com/BradHacker/compsole/compsole/providers/openstack"
	"github.com/BradHacker/compsole/compsole/utils"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/competition"
	"github.com/BradHacker/compsole/ent/team"
	"github.com/BradHacker/compsole/ent/vmobject"
	"github.com/sirupsen/logrus"
)

func main() {
	// Create the ent client
	pgHost, ok := os.LookupEnv("PG_URI")
	client := &ent.Client{}

	if !ok {
		logrus.Fatalf("no value set for PG_URI env variable. please set the postgres connection uri")
	} else {
		client = ent.PGOpen(pgHost)
	}

	ctx := context.Background()
	defer ctx.Done()
	defer client.Close()

	// Run the auto migration tool.
	if err := client.Schema.Create(ctx); err != nil {
		logrus.Fatalf("failed creating schema resources: %v", err)
	}

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
			ingestVms(ctx, client)
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

func ingestVms(ctx context.Context, client *ent.Client) {
	for {
		// Print banner and menu
		utils.PrintBanner()
		fmt.Print("Select your\033[36;1m provider\033[0;1m:\n",
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
		vmIngestBytes, err := os.ReadFile(filename)
		if err != nil {
			fmt.Printf("\033[1;31mError: failed to ingest dump file: %v\nPress [ENTER] to continue...\033[0m\n", err)
			fmt.Scanln()
			continue
		}
		var vmIngest map[string][]*ent.VmObject
		err = json.Unmarshal(vmIngestBytes, &vmIngest)
		if err != nil {
			fmt.Printf("\033[1;31mError: failed to unmarshal ingest: %v\nPress [ENTER] to continue...\033[0m\n", err)
			fmt.Scanln()
			continue
		}
		tx, err := client.Tx(ctx)
		if err != nil {
			fmt.Printf("\033[1;31mError: failed to create ent transaction client: %v\nPress [ENTER] to continue...\033[0m\n", err)
			fmt.Scanln()
			tx.Rollback()
			continue
		}
		// Find or create the competition
		entCompetition, err := tx.Competition.Query().Where(competition.NameEQ(competitionName)).Only(ctx)
		if err != nil && ent.IsNotFound(err) {
			logrus.Infof("Creating competition \"%s\"", competitionName)
			entCompetition, err = tx.Competition.Create().SetName(competitionName).SetProviderType(providerId).SetProviderConfigFile(configPath).Save(ctx)
			if err != nil {
				fmt.Printf("\033[1;31mError: failed to create competition \"%s\": %v\nRolling back db changes...\nPress [ENTER] to continue...\033[0m\n", competitionName, err)
				fmt.Scanln()
				tx.Rollback()
				continue
			}
		} else if err != nil {
			fmt.Printf("\033[1;31mError: failed to query competition: %v\nRolling back db changes...\nPress [ENTER] to continue...\033[0m\n", err)
			fmt.Scanln()
			tx.Rollback()
			continue
		} else {
			err = tx.Competition.Update().SetProviderType(providerId).SetProviderConfigFile(configPath).Exec(ctx)
			if err != nil {
				fmt.Printf("\033[1;31mError: failed to update competition \"%s\": %v\nRolling back db changes...\nPress [ENTER] to continue...\033[0m\n", competitionName, err)
				fmt.Scanln()
				tx.Rollback()
				continue
			}
			logrus.Infof("Found competition \"%s\"", competitionName)
		}
		for i := 0; i <= teamCount; i++ {
			// Find or create the teams
			entTeam, err := tx.Team.Query().Where(team.TeamNumberEQ(i)).Only(ctx)
			if err != nil && ent.IsNotFound(err) {
				logrus.Infof("Creating team %d", i)
				entTeam, err = tx.Team.Create().SetTeamNumber(i).SetTeamToCompetition(entCompetition).Save(ctx)
				if err != nil {
					fmt.Printf("\033[1;31mError: failed to create team %d: %v\nRolling back db changes...\nPress [ENTER] to continue...\033[0m\n", i, err)
					fmt.Scanln()
					tx.Rollback()
					continue
				}
			} else if err != nil {
				fmt.Printf("\033[1;31mError: failed to query team: %v\nRolling back db changes...\nPress [ENTER] to continue...\033[0m\n", err)
				fmt.Scanln()
				tx.Rollback()
				continue
			} else {
				logrus.Infof("Found team \"%s\"", competitionName)
			}
			key := "team" + strconv.Itoa(i)
			name := ""
			if i == 0 {
				// Place unsorted vms under team 0
				key = "unsorted"
				name = "unsorted"
				logrus.Info("Team is being labelled as \"unsorted\"")
			}
			for _, vm := range vmIngest[key] { // Find or create the teams
				entVmObject, err := tx.VmObject.Query().Where(vmobject.IdentifierEQ(vm.Identifier)).Only(ctx)
				if err != nil && ent.IsNotFound(err) {
					logrus.Infof("Creating vm %d", i)
					err = tx.VmObject.Create().
						SetName(vm.Name).
						SetIdentifier(vm.Identifier).
						SetIPAddresses(vm.IPAddresses).
						SetVmObjectToTeam(entTeam).
						SetName(name).
						Exec(ctx)
					if err != nil {
						fmt.Printf("\033[1;31mError: failed to create vm \"%s\": %v\nRolling back db changes...\nPress [ENTER] to continue...\033[0m\n", vm.Name, err)
						fmt.Scanln()
						tx.Rollback()
						continue
					}
				} else if err != nil {
					fmt.Printf("\033[1;31mError: failed to query team: %v\nRolling back db changes...\nPress [ENTER] to continue...\033[0m\n", err)
					fmt.Scanln()
					tx.Rollback()
					continue
				} else {
					logrus.Infof("found vm %d", i)
					err = entVmObject.Update().SetVmObjectToTeam(entTeam).Exec(ctx)
					if err != nil {
						fmt.Printf("\033[1;31mError: failed to update vm \"%s\": %v\nRolling back db changes...\nPress [ENTER] to continue...\033[0m\n", vm.Name, err)
						fmt.Scanln()
						tx.Rollback()
						continue
					}
				}
			}
		}
		logrus.Info("Deleteing dump file")
		err = os.Remove(filename)
		if err != nil {
			fmt.Printf("\033[1;31mError: failed to delete dump file: %v\nPress [ENTER] to continue...\033[0m\n", err)
			fmt.Scanln()
			tx.Rollback()
			continue
		}
		logrus.Info("Committing changes to database")
		// Try committing database changes
		err = tx.Commit()
		if err != nil {
			fmt.Printf("\033[1;31mError: failed to commit db changes: %v\nPress [ENTER] to continue...\033[0m\n", err)
			fmt.Scanln()
			tx.Rollback()
			continue
		}
		fmt.Printf("\033[1;32mSuccess: ingested all vms from dump\nPress [ENTER] to continue...\033[0m\n")
		fmt.Scanln()
		continue
	}
}
