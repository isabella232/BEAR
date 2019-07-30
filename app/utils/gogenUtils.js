/* eslint-disable no-unused-expressions */
import fs from 'fs';
import path from 'path';
import { createJsonFile } from './fileUtils';
import { writeSummaryOutput } from './writeSummaryOutputUtils';

function transformBaselineEligibilityOptions(eligibilityOptions) {
  const jsonObject = { baselineEligibility: { dismiss: [], reduce: [] } };
  Object.keys(eligibilityOptions)
    .sort()
    .forEach(codeSection => {
      eligibilityOptions[codeSection] === 'dismiss'
        ? jsonObject.baselineEligibility.dismiss.push(codeSection)
        : jsonObject.baselineEligibility.reduce.push(codeSection);
    });
  return jsonObject;
}

function transformOptionalReliefValues(additionalReliefOptions) {
  const transformedOptions = {
    subjectAgeThreshold: 0,
    yearsSinceConvictionThreshold: 0,
    yearsCrimeFreeThreshold: 0
  };

  if (additionalReliefOptions.dismissOlderThanAgeThreshold) {
    transformedOptions.subjectAgeThreshold =
      additionalReliefOptions.subjectAgeThreshold;
  }

  if (additionalReliefOptions.dismissYearsSinceConvictionThreshold) {
    transformedOptions.yearsSinceConvictionThreshold =
      additionalReliefOptions.yearsSinceConvictionThreshold;
  }

  if (additionalReliefOptions.dismissYearsCrimeFreeThreshold) {
    transformedOptions.yearsCrimeFreeThreshold =
      additionalReliefOptions.yearsCrimeFreeThreshold;
  }

  return transformedOptions;
}

// eslint-disable-next-line import/prefer-default-export
export function runScript(
  state,
  spawnChildProcess,
  childFinishedCallback: function
) {
  const {
    gogenPath,
    dateTime,
    county,
    dojFilePaths,
    baselineEligibilityOptions,
    additionalReliefOptions,
    outputFilePath
  } = state;
  makeDirectory(outputFilePath);
  const JsonFileName = `eligibilityConfig_${dateTime}.json`;
  const pathToEligibilityOptions = path.join(outputFilePath, JsonFileName);
  const formattedEligibilityOptions = transformBaselineEligibilityOptions(
    baselineEligibilityOptions
  );

  const formattedAdditionalReliefOptions = {
    ...additionalReliefOptions,
    ...transformOptionalReliefValues(additionalReliefOptions)
  };

  const eligibilityLogicConfig = {
    ...formattedEligibilityOptions,
    additionalRelief: formattedAdditionalReliefOptions
  };

  createJsonFile(eligibilityLogicConfig, pathToEligibilityOptions);
  const countyCode = county.code;

  let filePathNum = 0;
  dojFilePaths.forEach(filePath => {
    filePathNum += 1;
    let updatedFilePath = '';
    let fileNameSuffix = '';
    if (dojFilePaths.length > 1) {
      updatedFilePath = `${outputFilePath}/#${filePathNum}`;
      fileNameSuffix = `#${filePathNum}_${dateTime}`;
      makeDirectory(updatedFilePath);
    } else {
      updatedFilePath = outputFilePath;
      fileNameSuffix = dateTime;
    }
    const goProcess = spawnChildProcess(gogenPath, [
      `run`,
      `--file-name-suffix=${fileNameSuffix}`,
      `--input-doj=${filePath}`,
      `--outputs=${updatedFilePath}`,
      `--county=${countyCode}`,
      `--eligibility-options=${pathToEligibilityOptions}`,
      `--compute-at=2020-07-01`
    ]);
    goProcess.stdout.on('data', data => {
      const dataString = data.toString();
      console.log(`stdout for ${filePathNum}: `, dataString);
    });

    goProcess.on('close', () => {
      writeSummaryOutput(outputFilePath, updatedFilePath, fileNameSuffix);
      childFinishedCallback();
    });
    goProcess.on('error', error => {
      console.error(error);
      childFinishedCallback();
    });

    goProcess.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
    });
  });
}

function makeDirectory(pathToDirectory) {
  if (!fs.existsSync(pathToDirectory)) {
    fs.mkdirSync(pathToDirectory, { recursive: true }, err => {
      if (err) throw err;
      console.log('error making path:', path);
    });
  }
}
