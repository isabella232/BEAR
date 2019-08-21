# README

This app provides a desktop GUI for a Golang script that takes in CA Department of Justice .dat files containing criminal histories and identifies convictions that are eligible for relief under CA Prop 64.
The app can be packaged for installation on Windows, Mac, or Linux.

We call it B.E.A.R. (Bulk Expungement Analysis of Records).

The Golang project can be found [here](https://github.com/codeforamerica/gogen).

This application was developed by Code for America's [Clear My Record team](https://www.codeforamerica.org/programs/clear-my-record). Read more about this project [here](https://info.codeforamerica.org/clear-my-record-toolkit).

## Install

First, clone the repo via git:

```bash
$ git clone git@github.com:codeforamerica/bear.git
```

And then install the dependencies with yarn.

```bash
$ cd BEAR
$ yarn
```

## Acquiring and Updating your Gogen Binary

In order to work in development mode, this application expects an executable binary at `~/go/bin/gogen`. This binary IS NOT INCLUDED IN THE COMMITTED FILES.
The binary is generated by a separate repo that can be found [here](https://github.com/codeforamerica/gogen).
To build the binary and place a copy where the development mode of BEAR expects it, follow the instructions for cloning and installing in the gogen README, then:

```
$ cd ~/go/src/gogen
$ go build
$ cp gogen ~/go/bin/gogen
```

You must repeat this process any time you make changes to the gogen code, if you want to see those changes reflected when running BEAR in development mode.
For information about how to include the gogen binary when packaging BEAR for production, see the section on releasing.

## Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
$ yarn dev
```

## Testing

To run the unit tests:

```bash
$ yarn test
```

To run the main end-to-end tests:

```bash
$ yarn build-e2e
$ yarn test-e2e
```

There are a few end-to-end tests that fail on some development machines for mysterious reasons. To run the CI-only end-to-end tests:

```bash
$ yarn build-e2e
$ yarn test-ci-e2e
```

To run all tests (except CI-only) including the linter and the Flow type-checker:

```bash
$ yarn test-all
```

To update the test snapshots when you have made intentional changes to the UI:

```bash
$ yarn test-update-snapshots
```

## Releasing a New Version of BEAR

We create and publish built executables using [electron-builder](https://github.com/electron-userland/electron-builder).

BEAR is automatically packaged and released in draft to Github as part of our CircleCI workflow. Publishing the draft release on Github, and signing a release and making it available for public download, are manual steps.

### Development Workflow

1. On finishing a feature in [gogen](https://github.com/codeforamerica/gogen):
   1. Increase the version number in `gogen.go`
   1. Commit, push Gogen to master (will trigger a Github release)
1. On finishing a feature in BEAR:
   1. Increase the version number in `package.json`
   1. If new version of Gogen is needed, update Gogen version in `.gogen-version`
   1. Commit, push BEAR to master. This will trigger the following CI flow:
      1. Run tests
      1. Create a versioned draft release on Github of BEAR with Windows binary
1. When approved by Product, publish the draft release:
   1. Publish the draft release on Github:
      1. Log into Github and visit the [releases page](https://github.com/codeforamerica/BEAR/releases)
      1. Find the draft release corresponding to the story that was accepted
      1. Click “edit” and then “publish release”. If we're pre-1.0.0, also check the "Pre-release" box.
   1. Sign the approved binary and make publicly available on S3. On Windows laptop:
      1. Sign the binary:
         1. Download the Windows artifact from the published Github release above
         1. Rename the signed binary to `clearmyrecord-HS_11361-setup.exe`.
         1. Plug in DigiCert USB token
         1. Open Command Prompt
         1. Run the following commend: `signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a "c:\path\to\Downloads\clearmyrecord-HS_11361-setup.exe"`. **Note**: This command is also available in `commands to sign.txt` on the Desktop.
         1. When prompted, enter the password in the "DigiCert EV Certificate" shared note in LastPass
      1. Add the signed binary to the Github release:
         1. Log into Github and visit the [releases page](https://github.com/codeforamerica/BEAR/releases)
         1. Attach the signed binary and save the release
      1. Upload the signed binary to S3:
         1. Sign in to `cfa` AWS account (requires Christa since we have limited access)
         1. In S3, navigate to the `cmr-bear-releases` S3 bucket
         1. Upload the renamed file to the bucket. This should create a new version of the existing resource, so people receive the latest file when they visit the URL from the marketing page. You can check by hitting the 'Versions' toggle button, after which you should see a version with a recent 'Last modified' date.
         1. Make the file public. Click on the file you just uploaded and hit the 'Make public' button.

### Packaging and Publishing from a Local Machine

We recommend using the CI release process when possible, but if you need to package the app on your local machine, instructions can be found below.

To package the app for Mac:

```bash
$ yarn package-mac
```

To package the app for Windows:

```bash
$ yarn package-win
```

To package the app for Windows and create a draft release on Github (this should only be done as part of a successful CI build):

```bash
$ export GH_TOKEN={your-github-token}
$ yarn package-publish-win
```

To package the app for Mac and create a draft release on Github (this should only be done locally after a successful CI build, and will require you to manually download the correct version of gogen):

```bash
$ export GH_TOKEN={your-github-token}
$ yarn package-publish-mac
```

### Including the gogen binary in the packaged app

When packaging, BEAR expects a copy of the gogen binary to be present in the project root. Keep in mind that the binary must be of the correct type to match the platform you are packaging for.
For example, if you are packaging for Windows you need to make sure there is a gogen.exe binary in the BEAR project root.
It is fine if there are both Mac and Windows binaries in the project root at package time - the app will detect the platform and select the correct binary based on the file extension.
Remember that if your are packaging on your local machine, you need to update the binary manually if you want to capture changes made to gogen.

## Electron-React-Boilerplate

This project was built on top of [Electron React Boilerplate](https://github.com/electron-react-boilerplate)

See their [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)

## License

MIT. Please see LICENSE and NOTICES.md.
