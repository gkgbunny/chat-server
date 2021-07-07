import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as yup from 'yup';
import { SnackBarContextConsumer } from '../SnackBarProvider/SnackBarProvider';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

class CreateUser extends React.Component {
  schema = yup.object().shape({
    name: yup.string().required('Name is a required field'),
    email: yup.string().required('Email Address is a required field').email('Email Address must be a valid email'),
  });

  state = {
    open: false,
    showData: false,
    name: '',
    email: '',
    showError: {
      name: false,
      email: false,
    },
    error: {
      name: '',
      email: '',
    },
    touched: {
      name: false,
      email: false,
    },
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ 
      open: false,
      name: '',
      email: '',
      touched: {
        name: false,
        email: false,
      },
      showError: {
        name: false,
        email: false,
      }
    });
  }  

  handleSubmit = (e, addUser, openSnackBar) => {
    localStorage.removeItem("loginUser");
    e.preventDefault();
    const { name, email } = this.state;
    addUser({ variables: { name, email }}).then((data) => {
      const { id, name, email } = data.data.addUser
      const value = [id, name, email]
      localStorage.setItem("loginUser", JSON.stringify(value));
    })
    .catch(err => {
      console.log("err", err)
    });
    openSnackBar('Data created successfully!', 'success');
    this.handleClose();
    this.setState({
      showData: true,
    });

  }  

  handleChange = field => (event) => {
    this.setState({
      [field]: event.target.value,
    }, this.validateForm);
  }

  validateForm = () => {
    const {
      name,
      email,
    } = this.state;
    this.schema
      .validate({
        name, email,
      }, { abortEarly: false })
      .then(() => {
        this.handleError(null);
      })
      .catch((err) => {
        this.handleError(err);
      });
  }

  handleError = (err) => {
    const focussederror = {};
    const boolError = {};
    if (err) {
      err.inner.forEach((element) => {
        focussederror[element.path] = element.message;
        boolError[element.path] = true;
      });
    }
    this.setState({
      error: focussederror,
      showError: boolError,
    });
  }

  isTouched = field => () => {
    const {
      touched,
    } = this.state;
    this.setState({
      touched: { ...touched, [field]: true },
    }, this.validateForm);
  }

  hasError = () => {
    const {
      error,
      touched,
    } = this.state;
    if (!Object.values(error).some(item => item)
    && Object.values(touched).some(item => item)
    ) {
      return false;
    }
    return true;
  }

  getError = (field) => {
    const {
      touched, error,
    } = this.state;
    if (!touched[field]) {
      return '';
    }
    return error[field];
  }

  render() {
    const { open, name, email, showData, showError } = this.state;
    return (
      <div>
        <Button align="center" onClick={this.handleClickOpen} variant="contained" color="primary">
          Start
        </Button>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title"> Enter your details:</DialogTitle>
          <DialogContent>
            <TextField
              required
              fullWidth
              id="outlined-name"
              label="Name"
              name="name"
              value={name}
              margin="normal"
              variant="outlined"
              error={showError.name}
              helperText={this.getError('name')}
              onChange={this.handleChange('name')}
              onBlur={this.isTouched('name')}
            />
            <TextField
              required
              fullWidth
              id="outlined-email"
              label="Email"
              name="email"
              value={email}
              margin="normal"
              variant="outlined"
              error={showError.email}
              helperText={this.getError('email')}
              onChange={this.handleChange('email')}
              onBlur={this.isTouched('email')}
            />
          </DialogContent>
          <DialogActions>
            <Button variant='contained' onClick={this.handleClose} color="primary">
              Cancel
            </Button>
              <Mutation mutation={ADD_USER}>
                {(addUser, {data}) => (
                  <SnackBarContextConsumer>
                    {({ openSnackBar }) => (
                      <Button variant='contained' 
                        onClick={(e) => {this.handleSubmit(e, addUser, openSnackBar)}}
                        color="primary"
                        disabled={this.hasError()}
                      >
                        Create
                      </Button>
                    )}
                  </SnackBarContextConsumer>
                )}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
              </Mutation>
          </DialogActions>
        </Dialog>
        {showData ?  <Route><Redirect to="/users" /></Route> : ''}
      </div>
    );
  }
}

export default CreateUser;