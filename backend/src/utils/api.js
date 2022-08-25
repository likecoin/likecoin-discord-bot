import axios from 'axios';
import qs from 'qs';

import { ENDPOINT } from '../config.js';

export default axios.create({
  baseURL: ENDPOINT,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});
