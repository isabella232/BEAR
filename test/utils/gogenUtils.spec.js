import sinon from 'sinon';
import fs from 'fs';
import { runScript, writeSummaryOutput } from '../../app/utils/gogenUtils';
import defaultAnalysisOptions from '../../app/constants/defaultAnalysisOptions';

describe('runScript', () => {
  const sandbox = sinon.createSandbox();

  function createFakeSpawnChildProcess() {
    const fakeSpawnResponse = {
      stdout: {
        on: () => {}
      },
      stderr: {
        on: () => {}
      },
      on: () => {}
    };
    return sandbox.fake.returns(fakeSpawnResponse);
  }

  function setup() {
    const fakeSpawnChildProcess = createFakeSpawnChildProcess();
    const fakeCreateJsonFile = sandbox.spy();
    const fakeGogenCallbackFunction = sandbox.spy();

    return {
      fakeSpawnChildProcess,
      fakeCreateJsonFile,
      fakeGogenCallbackFunction
    };
  }

  function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function callback(file) {
        const curPath = `${path}/${file}`;
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }

  afterEach(() => {
    sandbox.restore();
    deleteFolderRecursive('outputPath/outputPath');
  });

  describe('running gogen on a single file', () => {
    it('sets outputPath equal to state', () => {
      const state = {
        ...defaultAnalysisOptions,
        gogenPath: 'gogenPath',
        dateTime: 'date',
        county: { name: 'Sacramento', code: 'SACRAMENTO' },
        dojFilePaths: ['/first/path'],
        outputFilePath: 'outputPath/outputPath'
      };

      const {
        fakeSpawnChildProcess,
        fakeCreateJsonFile,
        fakeGogenCallbackFunction
      } = setup();

      runScript(
        state,
        fakeSpawnChildProcess,
        fakeCreateJsonFile,
        fakeGogenCallbackFunction
      );

      const { args } = fakeSpawnChildProcess.getCall(0);
      expect(args[0]).toEqual('gogenPath');
      expect(args[1]).toEqual([
        `run`,
        `--date-for-file-name=date`,
        `--input-doj=/first/path`,
        `--outputs=outputPath/outputPath`,
        `--county=SACRAMENTO`,
        `--eligibility-options=outputPath/outputPath/eligibilityConfig_date.json`
      ]);
    });
  });
  describe('running gogen on multiple files', () => {
    it('calls child process with values from state on item 0 & makes numbered folders', () => {
      const state = {
        ...defaultAnalysisOptions,
        gogenPath: 'gogenPath',
        dateTime: 'date',
        county: { name: 'Sacramento', code: 'SACRAMENTO' },
        dojFilePaths: ['/first/path', '/last/path'],
        outputFilePath: 'outputPath/outputPath'
      };

      const {
        fakeSpawnChildProcess,
        fakeCreateJsonFile,
        fakeGogenCallbackFunction
      } = setup();

      runScript(
        state,
        fakeSpawnChildProcess,
        fakeCreateJsonFile,
        fakeGogenCallbackFunction
      );

      const { args } = fakeSpawnChildProcess.getCall(0);
      expect(args[0]).toEqual('gogenPath');
      expect(args[1]).toEqual([
        `run`,
        `--date-for-file-name=#1_date`,
        `--input-doj=/first/path`,
        `--outputs=outputPath/outputPath/#1`,
        `--county=SACRAMENTO`,
        `--eligibility-options=outputPath/outputPath/eligibilityConfig_date.json`
      ]);
    });

    it('calls child process with values from state on item 1', () => {
      const state = {
        ...defaultAnalysisOptions,
        gogenPath: 'gogenPath',
        dateTime: 'date',
        county: { name: 'Sacramento', code: 'SACRAMENTO' },
        dojFilePaths: ['/first/path', '/last/path'],
        outputFilePath: 'outputPath/outputPath'
      };

      const {
        fakeSpawnChildProcess,
        fakeCreateJsonFile,
        fakeGogenCallbackFunction
      } = setup();

      runScript(
        state,
        fakeSpawnChildProcess,
        fakeCreateJsonFile,
        fakeGogenCallbackFunction
      );
      const { args } = fakeSpawnChildProcess.getCall(1);
      expect(args[0]).toEqual('gogenPath');
      expect(args[1]).toEqual([
        `run`,
        `--date-for-file-name=#2_date`,
        `--input-doj=/last/path`,
        `--outputs=outputPath/outputPath/#2`,
        `--county=SACRAMENTO`,
        `--eligibility-options=outputPath/outputPath/eligibilityConfig_date.json`
      ]);
    });
  });

  it('calls child process n times, where n is the length of the dojFilePaths array', () => {
    const state = {
      ...defaultAnalysisOptions,
      gogenPath: 'gogenPath',
      dateTime: 'date',
      county: { name: 'Sacramento', code: 'SACRAMENTO' },
      dojFilePaths: ['zero/path', 'one/path', 'two/path'],
      outputFilePath: 'outputPath/outputPath'
    };

    const {
      fakeSpawnChildProcess,
      fakeCreateJsonFile,
      fakeGogenCallbackFunction
    } = setup();

    runScript(
      state,
      fakeSpawnChildProcess,
      fakeCreateJsonFile,
      fakeGogenCallbackFunction
    );

    expect(fakeSpawnChildProcess.called).toBe(true);
    expect(fakeSpawnChildProcess.callCount).toEqual(3);
  });

  describe('transforming eligibility options for consumption by gogen', () => {
    it('transforms the baseline eligibility options before creating the json file', () => {
      const stateWithReductions = {
        gogenPath: 'gogenPath',
        dateTime: 'date',
        county: { name: 'Sacramento', code: 'SACRAMENTO' },
        dojFilePaths: ['/path/to/doj/file', 'hello'],
        outputFilePath: 'outputPath/outputPath',
        baselineEligibilityOptions: {
          '11357(a)': 'reduce',
          '11357(b)': 'dismiss',
          '11357(c)': 'dismiss',
          '11357(d)': 'dismiss',
          '11358': 'reduce',
          '11359': 'dismiss',
          '11360': 'dismiss'
        },
        additionalReliefOptions: {
          subjectUnder21AtConviction: false,
          dismissOlderThanAgeThreshold: false,
          subjectAgeThreshold: 50,
          dismissYearsSinceConvictionThreshold: false,
          yearsSinceConvictionThreshold: 5,
          dismissYearsCrimeFreeThreshold: false,
          yearsCrimeFreeThreshold: 5,
          subjectHasOnlyProp64Charges: false
        }
      };

      const {
        fakeSpawnChildProcess,
        fakeCreateJsonFile,
        fakeGogenCallbackFunction
      } = setup();

      runScript(
        stateWithReductions,
        fakeSpawnChildProcess,
        fakeCreateJsonFile,
        fakeGogenCallbackFunction
      );

      const { args } = fakeCreateJsonFile.getCall(0);
      expect(args[0].baselineEligibility.dismiss).toEqual([
        '11357(b)',
        '11357(c)',
        '11357(d)',
        '11359',
        '11360'
      ]);
      expect(args[0].baselineEligibility.reduce).toEqual(['11357(a)', '11358']);
    });

    describe('when additional relief options are selected', () => {
      it('passes the selected value of each option to createJsonFile', () => {
        const stateWithRelief = {
          gogenPath: 'gogenPath',
          dateTime: 'date',
          county: { name: 'Sacramento', code: 'SACRAMENTO' },
          dojFilePaths: ['/path/to/doj/file'],
          outputFilePath: 'outputPath/outputPath',
          ...defaultAnalysisOptions
        };

        const {
          fakeSpawnChildProcess,
          fakeCreateJsonFile,
          fakeGogenCallbackFunction
        } = setup();

        runScript(
          stateWithRelief,
          fakeSpawnChildProcess,
          fakeCreateJsonFile,
          fakeGogenCallbackFunction
        );

        const { args } = fakeCreateJsonFile.getCall(0);

        expect(args[0].additionalRelief).toEqual({
          subjectUnder21AtConviction: true,
          dismissOlderThanAgeThreshold: true,
          subjectAgeThreshold: 40,
          dismissYearsSinceConvictionThreshold: true,
          yearsSinceConvictionThreshold: 5,
          dismissYearsCrimeFreeThreshold: true,
          yearsCrimeFreeThreshold: 5,
          subjectHasOnlyProp64Charges: true,
          subjectIsDeceased: true
        });
      });
    });

    describe('when additional relief options are NOT selected', () => {
      it('passes 0 for value of each option to createJsonFile', () => {
        const stateWithoutRelief = {
          gogenPath: 'gogenPath',
          dateTime: 'date',
          county: { name: 'Sacramento', code: 'SACRAMENTO' },
          dojFilePaths: ['/path/to/doj/file'],
          outputFilePath: 'outputPath/outputPath',
          baselineEligibilityOptions: {
            '11357(a)': 'dismiss',
            '11357(b)': 'dismiss',
            '11357(c)': 'dismiss',
            '11357(d)': 'dismiss',
            '11358': 'dismiss',
            '11359': 'dismiss',
            '11360': 'dismiss'
          },
          additionalReliefOptions: {
            subjectUnder21AtConviction: false,
            dismissOlderThanAgeThreshold: false,
            subjectAgeThreshold: 50,
            dismissYearsSinceConvictionThreshold: false,
            yearsSinceConvictionThreshold: 5,
            dismissYearsCrimeFreeThreshold: false,
            yearsCrimeFreeThreshold: 5,
            subjectHasOnlyProp64Charges: false,
            subjectIsDeceased: false
          }
        };

        const {
          fakeSpawnChildProcess,
          fakeCreateJsonFile,
          fakeGogenCallbackFunction
        } = setup();

        runScript(
          stateWithoutRelief,
          fakeSpawnChildProcess,
          fakeCreateJsonFile,
          fakeGogenCallbackFunction
        );

        const { args } = fakeCreateJsonFile.getCall(0);

        expect(args[0].additionalRelief.subjectAgeThreshold).toBe(0);
        expect(args[0].additionalRelief.yearsSinceConvictionThreshold).toBe(0);
        expect(args[0].additionalRelief.yearsCrimeFreeThreshold).toBe(0);
      });
    });
  });
});

describe('writeSummaryOutput', () => {
  beforeEach(() => {
    const outputPath = '/tmp/';
    writeSummaryOutput(outputPath);
  });
  afterEach(() => {
    fs.unlinkSync('/tmp/summaryOutput.txt');
  });

  it('creates summaryOutput.txt with summary data and without the console progress bar', () => {
    const outputFromTmpFile = fs.readFileSync('/tmp/summaryOutput.txt', 'utf8');
    expect(outputFromTmpFile).toEqual('this is summary text');
  });
});
