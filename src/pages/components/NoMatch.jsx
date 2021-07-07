import React from 'react';
import { Typography } from '@material-ui/core';

const NoMatch = () => (
  <>
    <Typography variant="h1" align="center">
      Not Found
    </Typography>
    <Typography variant="display1" align="center">
      <h6>Seems like the page you are looking after does not exist</h6>
    </Typography>
  </>
);
export default NoMatch;