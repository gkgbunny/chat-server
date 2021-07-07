import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';

const styles = theme => ({
  root: {
    // width: "100%"
  },
  content: {
    position: 'sticky',
    marginBottom: theme.spacing.unit,
  },
  footer: {
    display: "flex",
    position: 'sticky',
    marginBottom: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  textField: {
    marginRight: theme.spacing.unit,
    position: 'relative',
  },
  flex: {
    flex: 1,
    marginLeft: theme.spacing.unit,
  },
  // dialogPaper: {
    //   // minHeight: '55vh',
    //   // maxHeight: '55vh',
    //   // minWidth: '40.3vh',
    //   // maxWidth: '40.3vh',
    // },
  chip: {
    // width: "50%",
    // flexShrink: 1,
    // wordWrap: "break-word",
  },
  chipLabel: {
    width: "100%",
    wordWrap: "break-word",
  },
  chipLeft: {
    // flexShrink: 1,
    // width: "50%",
    textAlign: "left",
    margin: theme.spacing.unit,
  },
  chipRight: {
    // flexShrink: 1,
    // width: "100%",
    textAlign: "right",
    margin: theme.spacing.unit,
  }
});

const GET_USERS = gql`
  {
    getAllUser {
      id
      name
      email
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($text: String!, $sender: ID!, $receiver: ID!) {
    sendMessage(text: $text, sender: $sender, receiver: $receiver) {
      id
      text
      sender
      receiver
    }
  }
`;

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ChatDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
    };
  }

  componentDidMount() {
    this.props.subscribeToMore();
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const node = ReactDOM.findDOMNode(this.messagesEnd);
    // const node = document.getElementById("alert-dialog-description");
    if (node) {
      node.scrollIntoView({ behavior: "smooth" });
    }
  }

  handleChange = field => event => {
    this.setState({
      [field]: event.target.value,
    });
  };

  onPressKey = (e, sendMessage) => {
    const x = e.key;
    if (x === "Enter") {
      this.handleSend(sendMessage);
    }
  }

  handleSend = (sendMessage) => {
    const { selectData } = this.props;
    const { message } = this.state;
    const senderID = JSON.parse(localStorage.getItem("loginUser"))[0];
    sendMessage({ variables: { text: message, sender: senderID, receiver: selectData.id }})
    this.setState({
      message: ''
    });
  };

  render() {
    const {
      open,
      onClose,
      selectData,
      classes,
      messageData,
    } = this.props;
    const senderName = JSON.parse(localStorage.getItem("loginUser"))[1];
    const senderId = JSON.parse(localStorage.getItem("loginUser"))[0];
    return (
      <Query
        query={GET_USERS}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>{error.message}</p>;
          return (
            <>
              <Dialog
                id="lastMessage"
                fullScreen
                open={open}
                onClose={onClose}
                TransitionComponent={Transition}
                className={classes.root}
              >
                <AppBar className={classes.content}>
                  <Toolbar>
                    <IconButton color="inherit" onClick={onClose} aria-label="Close">
                      <ArrowBackIcon />
                    </IconButton>
                    <Typography align="center" variant="h6" color="inherit" className={classes.flex}>
                      {selectData.name}
                    </Typography>
                  </Toolbar>
                </AppBar>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {
                      messageData.getMessage.map(message => {
                        let receiverData;
                        if (message.sender === senderId) {
                          return (
                            <div className={classes.chipRight} ref={(div) => this.messagesEnd = div}>
                              <Chip
                                avatar={<Avatar>{senderName.toUpperCase()[0]+senderName.toUpperCase()[senderName.length-1]}</Avatar>}
                                label={<div className={classes.chipLabel}>{message.text}</div>}
                                color="primary"
                                variant="outlined"
                                className={classes.chip}
                              />
                            </div>
                          )
                        } else {
                          receiverData = data.getAllUser.filter(data => data.id === message.sender);
                        }
                        return (
                          <div className={classes.chipLeft} ref={(div) => this.messagesEnd = div}>
                            <Chip
                              avatar={<Avatar>{receiverData[0].name.toUpperCase()[0]+receiverData[0].name.toUpperCase()[receiverData[0].name.length-1]}</Avatar>}
                              label={<div className={classes.chipLabel}>{message.text}</div>}
                              color="primary"
                              variant="outlined"
                              className={classes.chip}
                            />
                          </div>
                        )
                      })
                    }
                    {this.scrollToBottom()}
                  </DialogContentText>
                </DialogContent>
                <Typography className={classes.footer}>
                  <Mutation mutation={SEND_MESSAGE}>
                    {(sendMessage, { data }) => (
                      <>
                        <TextField
                          fullWidth
                          id="filled-full-width"
                          placeholder="Type Message"
                          value={this.state.message}
                          name="message"
                          className={classes.textField}
                          variant="filled"
                          onChange={this.handleChange('message')}
                          onKeyPress={(e) => this.onPressKey(e, sendMessage)}
                        />
                        <Fab
                          onClick={() => this.handleSend(sendMessage)}
                        >
                          <SendIcon />
                        </Fab>
                      </>
                    )}
                  </Mutation> 
                </Typography>
              </Dialog>
            </>
          )
        }}
      </Query>
    );
  }
}
ChatDialog.propTypes = {
  classes: PropTypes.objectOf.isRequired,
  onClose: PropTypes.func,
  messageData: PropTypes.objectOf.isRequired,
  open: PropTypes.bool,
  subscribeToMore: PropTypes.func.isRequired,
  selectData: PropTypes.objectOf.isRequired,
};
ChatDialog.defaultProps = {
  onClose: () => {},
  open: 'false',
};
export default withStyles(styles)(ChatDialog);