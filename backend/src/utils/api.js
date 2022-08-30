import axios from 'axios';
import qs from 'qs';

import { LIKECOIN_CHAIN_ENDPOINT } from '../config.js';

export default axios.create({
  baseURL: LIKECOIN_CHAIN_ENDPOINT,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});
