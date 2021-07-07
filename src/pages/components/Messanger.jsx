import React, { Component } from 'react';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import PropTypes from 'prop-types';
import ChatDialog from './ChatDialog';

const GET_MESSAGE = gql`
  query GetMessage($sender: ID!, $receiver: ID!) {
    getMessage(sender: $sender, receiver: $receiver) {
      id
      text
      sender
      receiver
    }
  } 
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageSend($sender: ID!, $receiver: ID!) {
    messageSend(sender: $sender, receiver: $receiver) {
      id
      text
      sender
      receiver
    }
  }
`;

class Messanger extends Component {
  state = {
    message: '',
  };

  suscribeMessage = (subscribeToMore) => {
    const { selectData } = this.props;
    const senderID = JSON.parse(localStorage.getItem("loginUser"))[0];
    subscribeToMore ({
      document: MESSAGE_SUBSCRIPTION,
      variables: { sender: senderID, receiver: selectData.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newData = subscriptionData.data;
        return {
          ...prev,
          getMessage: [...prev.getMessage, newData.messageSend]
        };
      }
    });
  }

  render() {
    const { selectData, open, onClose } = this.props;
    const senderID = JSON.parse(localStorage.getItem("loginUser"))[0];
    return (
      <Query
        query={GET_MESSAGE}
        variables={{sender: senderID, receiver: selectData.id}}
      >
        {({ subscribeToMore, loading, error, data }) => {
          if (loading) return <p>Loading...Message</p>;
          if (error) return <p>{error.message}</p>;
          return (
            <ChatDialog
              subscribeToMore={() => this.suscribeMessage(subscribeToMore)}
              messageData={data}
              open={open}
              onClose={onClose}
              selectData={selectData}
            />
          )
        }}
      </Query>
    )  
  }
}
Messanger.propTypes = {
  selectData: PropTypes.objectOf.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default Messanger;