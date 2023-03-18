import { createGetInitialProps } from '@mantine/next';
import Document from 'next/document';

// https://mantine.dev/guides/next/#create-your-own-getinitialprops
const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;
}
