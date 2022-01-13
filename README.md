# LFOT

## Light Force Operator Tools

### It's like wrapping a big fuzzy blanket around sfdx!
======================================

## Install

1. Open Git Bash on Windows
1. Run

    ```bash
    npm i -g lfot
    ```

## Use

1. Check the help by running

    ```bash
    lfot help
    ```

1. Generate a bashrc alias list of sfdx commands

- Default

    ```bash
    lfot tool alias
    ```

- File output

    ```bash
    lfot tool alias -f ./path/filename.txt
    ```

1. Build package.xml files for default user name

- Default

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