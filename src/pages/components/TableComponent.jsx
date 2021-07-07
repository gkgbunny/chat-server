/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
    elevation: 5,
  },
  table: {
    minWidth: 600,
    fontFamily: theme.typography.fontFamily,
  },
  tableRow: {
    cursor: 'pointer',
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.grey[100],
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});

class TableComponent extends Component {

  componentDidMount() {
    this.props.subscribeToMore();
  }

  tableBody = (data) => {
    const { classes, onSelect } = this.props;
    let loginData = JSON.parse(localStorage.getItem("loginUser"));
    return data.getAllUser.map(dataItem => {
      if (dataItem.name !== loginData[1]) {
        return (
          <TableRow
            key={dataItem.id}
            className={classes.tableRow}
          >
            <TableCell align='center' onClick={() => onSelect(dataItem.id, dataItem.name)}>
              {dataItem.name}
            </TableCell>
          </TableRow>
        )
      }
      return '';
    });
  };

  render() {
    const {
      classes,
      data,
    } = this.props;
    const loginData = JSON.parse(localStorage.getItem("loginUser"));
    return (
      <>
        <div style={ { display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: 'black', fontSize: '25px', marginBottom: '50px' }}>
            <h2>Welcome {loginData[1]}</h2>
            <hr/>
          </span>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableBody>{this.tableBody(data)}</TableBody>
            </Table>
          </Paper>
      </div>
      </>
    );
  }
}
TableComponent.propTypes = {
  classes: PropTypes.objectOf.isRequired,
  data: PropTypes.arrayOf.isRequired,
  onSelect: PropTypes.func.isRequired,
  // onClick: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
};
export default withStyles(styles)(TableComponent);