// @flow
import React, { Component } from 'react';
import { Document, Text, Page, View, Image } from '@react-pdf/renderer';
import path from 'path';
import styles from './SummaryReportPdfStyles';

// type Props = {
//   county: string,
//   dateTime: string
// };

const imageDirectory = path.join(__dirname, '/assets/images/');

export default class SummaryReportPdf extends Component<Props> {
  render() {
    // const { county, dateTime } = this.props;
    return (
      <Document>
        <Page>
          <View style={styles.header}>
            <Image
              src={path.join(imageDirectory, 'cmr_logo_black_cropped.png')}
              style={styles.logoImage}
              safePath={imageDirectory}
            />
            <View style={styles.headerText}>
              <Text style={styles.tinyText}>
                Clear My Record is a service delivered by Code for America.
              </Text>
              <Text style={styles.tinyText}>
                For more information contact clearmyrecord@codeforamerica.org
              </Text>
            </View>
          </View>
          <View style={styles.body}>
            <Text style={styles.h1}>Summary Report: Los Angeles County</Text>
            <Text style={styles.text}>
              This report was generated by Clear My Record on{' '}
              <Text style={styles.boldText}>August 8, 2019 at 5pm</Text>{' '}
              <Text style={styles.text}>for</Text>{' '}
              <Text style={styles.boldText}>Los Angeles County</Text>.
            </Text>
            <View>
              <Text style={styles.h2}>
                Background on the file that California DOJ provided to Los
                Angeles County:
              </Text>
              <Text style={styles.text}>
                DOJ provided a spreadsheet with the entire CA criminal record
                history for every individual convicted of H&S §11357, H&S
                §11358, H&S §11359, and/or H&S §11360 in Los Angeles County
                since December 1973.
              </Text>
              <View style={styles.pageBreak} />
            </View>
            <View>
              <Text style={styles.h2}>
                What Clear My Record’s technology was able to do:
              </Text>
              <Text style={styles.text}>
                Based on your office’s eligibility choices, this application
                processed x lines of data in x.x seconds and produced three
                spreadsheets to assist with your office’s review.
              </Text>
            </View>
            <View>
              <Text style={styles.h3}>Based on your eligibility choices:</Text>
              <Text style={styles.listItem}>
                x people will no longer have a felony on their CA record
              </Text>
              <Text style={styles.listItem}>
                x people will no longer have a felony on their CA record
              </Text>
              <Text style={styles.listItem}>
                x people will no longer have a felony on their CA record
              </Text>
            </View>
            <View>
              <Text style={styles.h3}> Additional summary data:</Text>
              <Text style={styles.listItem}>
                x people will no longer have a felony on their CA record
              </Text>
              <Text style={styles.listItem}>
                x people will no longer have a felony on their CA record
              </Text>
              <Text style={styles.listItem}>
                x people will no longer have a felony on their CA record
              </Text>
            </View>
            <View>
              <Text style={styles.h3}>
                Los Angeles County DAs eligibility determinations for felonies
                under Prop 64:
              </Text>
              <Text style={styles.listItem}>
                - x people will no longer have a felony on their CA record
              </Text>
              <Text style={styles.listItem}>
                - x people will no longer have a felony on their CA record
              </Text>
              <Text style={styles.listItem}>
                - x people will no longer have a felony on their CA record
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  }
}
