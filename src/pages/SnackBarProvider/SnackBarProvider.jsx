import React, { Component } from 'react';
import { Snackbar, IconButton, SnackbarContent } from '@material-ui/core/';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import green from '@material-ui/core/colors/green';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';

const SnackBarContext = React.createContext('Hello');

const variantIcon = {
  success: CheckCircleIcon,
  error: ErrorIcon,
};

const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
    fontSize: 20,
  },
  message: {
    display: 'flex',
    alignItems: 'left',
  },
});

class SnackBarProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      message: '',
      status: '',
    };
  }

  openSnackBar = (message, status) => {
    this.setState({
      message,
      status,
      isOpen: true,
    });
  };

  closeSnackBar = () => {
    this.setState({
      message: '',
      status: '',
      isOpen: false,
    });
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };


  snackBarContent = (onClose, message, status) => {
    const { classes } = this.props;
    const Icon = variantIcon[status];
    return (
      <SnackbarContent
        className={classes[status]}
        message={
          (
            <span className={classes.message}>
              <Icon className={classes.iconVariant} />
              {message}
            </span>
          )
        }
        action={[
          <IconButton
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
      />
    );
  }

  render() {
    const { children, classes } = this.props;
    const { message, isOpen, status } = this.state;

    return (
      <>
        <SnackBarContext.Provider
          value={{
            openSnackBar: this.openSnackBar,
            closeSnackBar: this.closeSnackBar,
          }}
        >
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={isOpen}
            autoHideDuration={6000}
            onClose={this.handleClose}
            message={message}
            action={[
              <IconButton key="close" color="inherit" className={classes.iconVariant} onClick={this.closeSnackBar}>
                <Close className={classes.icon} />
              </IconButton>,
            ]}
          >
            {this.snackBarContent(this.handleClose, message, status)}
          </Snackbar>
          {children}
        </SnackBarContext.Provider>
      </>
    );
  }
}
SnackBarProvider.propTypes = {
  children: PropTypes.objectOf,
  classes: PropTypes.objectOf.isRequired,
};
SnackBarProvider.defaultProps = {
  children: {},
};
export default withStyles(styles)(SnackBarProvider);
export const SnackBarContextConsumer = SnackBarContext.Consumer;