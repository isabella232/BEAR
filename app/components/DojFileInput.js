// @flow
import React, { Component } from 'react';
import styles from './DOJFileInput.css';

type Props = {
  onFileSelect: string => void,
  isFilepathEmpty: boolean
};

export default class DojFileInput extends Component<Props> {
  handleFileSelection = (event: SyntheticEvent<HTMLInputElement>) => {
    const { onFileSelect } = this.props;
    const filePath = event.currentTarget.files[0].path;
    onFileSelect(filePath);
  };

  renderNoFileMessage = () => {
    const { isFilepathEmpty } = this.props;

    if (isFilepathEmpty) {
      return <p className={styles.emptyMessage}>No file selected</p>;
    }
  };

  render() {
    return (
      <div>
        <label
          className={`${styles.noBottomMargin} button file-upload__label`}
          htmlFor="doj-file-input"
        >
          <input
            onChange={this.handleFileSelection}
            type="file"
            accept=".dat, .csv"
            id="doj-file-input"
            name="doj-file-input"
            className="file-upload__input"
          />
          Select file
        </label>
        {this.renderNoFileMessage()}
      </div>
    );
  }
}
