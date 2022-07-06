package utils

import (
	"fmt"
	"strings"

	"github.com/fatih/color"
)

const (
	VERSION = "v0.1"
	AUTHOR  = "BradHacker"
)

var (
	boldw = color.New(color.FgHiWhite, color.Bold).SprintfFunc()
	boldr = color.New(color.FgHiRed, color.Bold).SprintfFunc()
	boldg = color.New(color.FgHiGreen, color.Bold).SprintfFunc()
	boldc = color.New(color.FgHiCyan, color.Bold).SprintfFunc()
	boldm = color.New(color.FgHiMagenta, color.Bold).SprintfFunc()
)

var BANNER = []string{
	"\033c",
	boldg(`      _    _______  _______  _______  _______       _     %s`, boldc(`  _______  _______  _        _______ `)),
	boldg(`     / )  (  ____ \(  ___  )(       )(  ____ )   /\( \    %s`, boldc(` (  ____ \(  ___  )( \      (  ____ \`)),
	boldg(`    / /   | (    \/| (   ) || () () || (    )|  / / \ \   %s`, boldc(` | (    \/| (   ) || (      | (    \/`)),
	boldg(`   / /    | |      | |   | || || || || (____)| / /   \ \  %s`, boldc(` | (_____ | |   | || |      | (__    `)),
	boldg(`  ( (     | |      | |   | || |(_)| ||  _____)/ /     ) ) %s`, boldc(` (_____  )| |   | || |      |  __)   `)),
	boldg(`   \ \    | |      | |   | || |   | || (     / /     / /  %s`, boldc(`       ) || |   | || |      | (      `)),
	boldg(`    \ \   | (____/\| (___) || )   ( || )    / /     / /   %s`, boldc(` /\____) || (___) || (____/\| (____/\`)),
	boldg(`     \_)  (_______/(_______)|/     \||/     \/     (_/    %s`, boldc(` \_______)(_______)(_______/(_______/`)),
	boldw("                                                                             AUTHOR: %s", boldr("%s", AUTHOR)),
	boldw("                                                                            VERSION: %s", boldm("%s", VERSION)),
}

func PrintBanner() {
	fmt.Fprint(color.Output, strings.Join(BANNER, "\n")+"\n")
	// fmt.Printf("\n\n\033[0;1m VERSION = \033[35m%s \033[0;1m AUTHOR = \033[31m%s\n", VERSION, AUTHOR)
}
