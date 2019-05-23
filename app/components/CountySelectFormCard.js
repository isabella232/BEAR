// @flow
import React, { Component } from 'react';

import FormCard, {
  FormCardContent,
  FormCardFooter,
  FormCardHeader
} from './FormCard';
import CountySelect from './CountySelect';

type Props = {
  currentScreen: number,
  onCountySelect: County => void,
  onCountyConfirm: number => void
};

const screenNumber = 1;

export default class CountySelectFormCard extends Component<Props> {
  onContinue = () => {
    const { onCountyConfirm } = this.props;
    onCountyConfirm(screenNumber + 1);
  };

  render() {
    const { currentScreen, onCountySelect } = this.props;
    return (
      <FormCard currentScreen={currentScreen} screenNumber={screenNumber}>
        <FormCardHeader>Proposition 64 CA DOJ data upload</FormCardHeader>
        <FormCardContent>
          <CountySelect onCountySelect={onCountySelect} />
        </FormCardContent>
        <FormCardFooter>
          <button
            className="button button--primary"
            onClick={this.onContinue}
            type="button"
          >
            Continue <i className="icon-arrow_forward" />
          </button>
        </FormCardFooter>
      </FormCard>
    );
  }
}
