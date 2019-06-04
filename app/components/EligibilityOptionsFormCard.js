// @flow
import React, { Component } from 'react';

import FormCard, {
  FormCardContent,
  FormCardFooter,
  FormCardHeader
} from './FormCard';
import BaselineEligibilityOption from './BaselineEligibilityOption';
import RadioButton from './RadioButton';
import ContinueButton from './ContinueButton';

type Props = {
  currentScreen: number,
  eligibilityOptions: BaselineEligibilityOptions,
  onEligibilityOptionSelect: (string, string) => void,
  onOptionsConfirm: number => void
};

const screenNumber = 3;

export default class EligibilityOptionsFormCard extends Component<Props> {
  onContinue = () => {
    const { onOptionsConfirm } = this.props;
    onOptionsConfirm(screenNumber + 1);
  };

  render() {
    const {
      currentScreen,
      eligibilityOptions,
      onEligibilityOptionSelect
    } = this.props;
    return (
      <FormCard currentScreen={currentScreen} screenNumber={screenNumber}>
        <FormCardHeader>Analysis for Implementation</FormCardHeader>
        <FormCardContent>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Dismiss</th>
                <th>Reduce</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>All misdemeanors and infractions</p>
                </td>
                <td>
                  <RadioButton
                    selected={true}
                    value="misdemeanor_infraction"
                    group="no_reduce_option"
                  />
                </td>
                <td />
              </tr>
              {Object.entries(eligibilityOptions).map(
                ([codeSection, selectedOption]) => {
                  return (
                    <BaselineEligibilityOption
                      key={codeSection}
                      codeSection={codeSection}
                      selectedOption={selectedOption}
                      onEligibilityOptionSelect={onEligibilityOptionSelect}
                    />
                  );
                }
              )}
            </tbody>
          </table>
        </FormCardContent>
        <FormCardFooter>
          <ContinueButton onContinue={this.onContinue} />
        </FormCardFooter>
      </FormCard>
    );
  }
}
