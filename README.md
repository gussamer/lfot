[![NPM](https://img.shields.io/npm/v/lfot.svg)](https://www.npmjs.com/package/lfot)
[![Downloads/week](https://img.shields.io/npm/dw/lfot.svg)](https://npmjs.org/package/lfot)
[![lfot](https://snyk.io/advisor/npm-package/lfot/badge.svg)](https://snyk.io/advisor/npm-package/lfot)
[![License](https://img.shields.io/badge/ISC-blue.svg)](https://raw.githubusercontent.com/gussamer/lfot/master/LICENSE)
# LFOT

## Light Force Operator Tools

### It's like wrapping a big fuzzy blanket around sfdx!

___


## Description

The goal of this is project is to aid in a command line based salesforce development workflow by automating processes that span multiple existing [sfdx](https://www.npmjs.com/package/sfdx-cli) commands. i.e. automating describe and list commands to build a package.xml file


## Updates

- updated tool/flist to honor maxBufferMBs for looooong field lists

- fixed meta/fest filtering namespeced being stuck always on

___


## Install

1. Open Git Bash on Windows (WSL and Linux support experimental)
1. Run

    ```bash
    npm i -g lfot
    ```

### Optional Configuration

#### While amusing the telekinetic spinner may be annoying in practical use. So this can be turned off via creating a settings file.

1. Open Git Bash on Windows
1. Run to create the lfot settings folder

    ```bash
    mkdir ~/.lfot
    ```

1. Run to write the lfot settings file

    ```bash
    echo "{\"showSpinnerDuration\":0,\"showSpinner\":false}" > ~/.lfot/settings.json
    ```

#### Disable command line feedback aside from command out put, useful for piping commands

1. Add the following to the settings file mentioned above

    ```bash
    "logThings":false
    ```

#### Increase the default list command buffer size to prevent max buffer errors when an org has too many members in one type

1. Add the following to the settings file mentioned above

    ```bash
    "maxBufferMBs":10
    ```

#### Use command line help, will pipe text help to stdout rather than open html version in browser

1. Add the following to the settings file mentioned above

    ```bash
    "browserHelp":false
    ```
#### Turn off auto help entirely

1. Add the following to the settings file mentioned above

    ```bash
    "alwaysHelp":false
    ```

___


## Use

### Help

#### Check the help by running

  - Default

      ```bash
      lfot help
      ```

### Tool

#### Generate a bashrc alias list of sfdx commands (Only works for Git Bash on Windows)

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

#### Generate comma separated list of fields

  - Default

      ```bash
      lfot tool flist -s Account
      ```

  - Include fields matching all(AND) provided key value pairs in object 

      ```bash
      lfot tool flist -s Account -i {\"custom\":true}
      ```

  - Exclude fields matching any(OR) provided key value pairs in object

      ```bash
      lfot tool flist -s Account -e {\"custom\":true}
      ```

  - String values passed in either include or exclude objects are matched as regular expressions

      ```bash
      lfot tool flist -s Account -i {\"name\":\"[Ii][Dd]\"} -e {\"name\":\".*__.*\|.*__.*__c\"}
      ```

  - Will pass further args to sfdx force:schema:sobject:describe such as specifying username

      ```bash
      lfot tool flist -s Account -u user@name.alias
      ```

### Meta

#### Build package.xml files for default user name

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

  - Include all types except the types in folders

      ```bash
      lfot meta fest -n
      ```

  - Include only members from the org filtering out all namespaced members

      ```bash
      lfot meta fest -s
      ```

  - Specifiy the location and name of package.xml

      ```bash
      lfot meta fest -f ./manifest/package.xml
      ```

  - Write package.xml content to stdout (overrides -f argument)

      ```bash
      lfot meta fest -c
      ```

  - Increase buffer size for listing processes if you get exceed max buffer errors if you have too many members in a metadata type, specify in Mbs, default is 10Mb (overrides settings value)

      ```bash
      lfot meta fest -m 10
      ```

### Open

#### Alias for sfdx force:org:open

  - Default, open your defined defualt page in your default org

      ```bash
      lfot open
      ```

  - Open your defualt page in specified org

      ```bash
      lfot open -u user@name.alias
      ```

  - Open record page by Id
  
      ```bash
      lfot open -p 001XXXXXXXXXXXXAAA
      ```

#### Open setup pages

  - Default, open setup home page

      ```bash
      lfot open setp
      ```

  - Open setup deploy status

      ```bash
      lfot open setp -d
      ```

  - Open setup object manager

      ```bash
      lfot open setp -o
      ```

  - Open setup debug logs

      ```bash
      lfot open setp -l
      ```

  - Open setup apex jobs

      ```bash
      lfot open setp -j
      ```

  - Will pass further args to sfdx force:org:open such as specifying username

      ```bash
      lfot open setp -j -u user@name.alias
      ```

#### Open record pages

  - Open record page by Id

      ```bash
      lfot open recd -i 001XXXXXXXXXXXXAAA
      ```

  - Will pass further args to sfdx force:org:open such as specifying username

      ```bash
      lfot open recd -i 001XXXXXXXXXXXXAAA -u user@name.alias
      ```
