# LFOT

## Light Force Operator Tools

### It's like wrapping a big fuzzy blanket around sfdx!
==========================================================================

## Description

The goal of this is project is to aid in a command line based salesforce development workflow by automating processes that span multiple existing sfdx commands. i.e. automating describe and list commands to build package.xml

## Install

1. Open Git Bash on Windows (WSL and Linux support experimental)
1. Run

    ```bash
    npm i -g lfot
    ```

### Optional Configuration

While amusing the telekinetic spinner may be annoying in practical use. So this can be turned off via creating a settings file.

1. Open Git Bash on Windows
1. Run to create the lfot settings folder

    ```bash
    mkdir ~/.lfot
    ```
1. Run to write the lfot settings file

    ```bash
    echo "{\"showSpinnerDuration\":0,\"showSpinner\":false}" > ~/.lfot/settings.json
    ```

## Use

1. Check the help by running

    ```bash
    lfot help
    ```

1. Generate a bashrc alias list of sfdx commands (Only works for Git Bash on Windows)

  - Default

      ```bash
      lfot tool alias
      ```

  - File output

      ```bash
      lfot tool alias -f ./path/filename.txt
      ```

  - Print human readable list instead of bash alias commands, overrides -f argument

      ```bash
      lfot tool alias -p
      ```

  - Suppress manually included overrides the developer prefers 

      ```bash
      lfot tool alias -n
      ```

1. Build package.xml files for default user name

  - Default, warning do not run while multi-tasking

      ```bash
      lfot meta fest
      ```

  - Include only types defined in comma separated list

      ```bash
      lfot meta fest -i ApexClass,ApexPage
      ```

  - Include all types except the types defined in comma separated list

      ```bash
      lfot meta fest -e Settings,Profile
      ```

  - Include all types except the types in folders, note this is redundent until types in folders are supported which they are not yet

      ```bash
      lfot meta fest -n
      ```

  - Specifiy the location and name of package.xml

      ```bash
      lfot meta fest -f ./manifest/package.xml
      ```

  - Write package.xml content to stdout (overrides -f argument)

      ```bash
      lfot meta fest -c
      ```

  - Increase buffer size for listing processes if you get exceed max buffer errors if you have too many members in a metadata type, specify in Mbs, default is 10Mb

      ```bash
      lfot meta fest -m 10
      ```



