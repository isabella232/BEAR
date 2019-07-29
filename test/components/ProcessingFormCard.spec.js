import fs from 'fs';
import sinon from 'sinon';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProcessingFormCard from '../../app/components/ProcessingFormCard';

Enzyme.configure({ adapter: new Adapter() });
const sandbox = sinon.createSandbox();

function setup() {
  const runScriptSpy = sandbox.spy();
  const startOverSpy = sandbox.spy();
  const resetOutputPathSpy = sandbox.spy();
  const getFileSizeSpy = sandbox.spy();

  const component = mount(
    <ProcessingFormCard
      dojFilePath="/tmp/path"
      outputFilePath="./test"
      getFileSize={getFileSizeSpy}
      runScriptInOptions={runScriptSpy}
      onStartOver={startOverSpy}
      resetOutputPath={resetOutputPathSpy}
    />
  );

  return {
    component,
    startOverSpy,
    resetOutputPathSpy
  };
}

afterEach(() => {
  sandbox.restore();
});

describe('ProcessingFormCard component', () => {
  describe('onGogenComplete', () => {
    it('should set state when Gogen was successful', () => {
      const { component } = setup();
      expect(component.state().gogenComplete).toEqual(false);
      component.instance().onGogenComplete(0, 'OK');
      expect(component.state().gogenComplete).toEqual(true);
      fs.unlinkSync('./test/summaryOutput.txt');
    });
  });
  describe('clicking the Start Over button', () => {
    it('should call resetOutputPath', () => {
      const { component, resetOutputPathSpy } = setup();
      const startOverButton = component.find('#start_over').at(0);
      startOverButton.simulate('click');
      expect(resetOutputPathSpy.called).toBe(true);
      expect(resetOutputPathSpy.callCount).toEqual(1);
    });
    it('should call onStartOver and return the user to the home page', () => {
      const { component, startOverSpy } = setup();
      const startOverButton = component.find('#start_over').at(0);
      startOverButton.simulate('click');
      expect(startOverSpy.called).toBe(true);
      expect(startOverSpy.callCount).toEqual(1);
    });
  });
});
