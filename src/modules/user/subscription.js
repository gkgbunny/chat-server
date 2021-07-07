import { withFilter } from 'apollo-server';
import { pubsub, USER_ADDED, MESSAGE_SEND } from '../../subscription';

const Subscription = {
  userAdded: {
    subscribe: () => pubsub.asyncIterator(USER_ADDED),
  },

  messageSend: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(MESSAGE_SEND),
      (payload, variables) => {
          return (
            ((payload.messageSend.sender === variables.sender) && (payload.messageSend.receiver === variables.receiver))
            || ((payload.messageSend.sender === variables.receiver) && (payload.messageSend.receiver === variables.sender))
          )
        }
    ),
  },
};

export default Subscription;
