import { User, Messages } from './constants';
import { pubsub, USER_ADDED, MESSAGE_SEND } from '../../subscription';

const Mutation = {
  addUser: (parent, { name, email }) => {
    let temp;
    const oldData = User.filter(user => user.email === email);
    if (oldData.length === 0) {
      temp = {
        id: User.length,
        name,
        email,
      };
      User.push(temp);
      pubsub.publish(USER_ADDED, { userAdded: temp });
    } else {
      temp = {
        id: oldData[0].id,
        name: oldData[0].name,
        email: oldData[0].email,
      };
      // pubsub.publish(USER_ADDED, { userAdded: temp });
    }
    return temp;
  },

  sendMessage: (parent, { text, sender, receiver }) => {
    const temp = {
      id: Messages.length,
      text,
      sender,
      receiver,
    };
    Messages.push(temp)
    pubsub.publish(MESSAGE_SEND, { messageSend: temp });
    return temp
  },
}

export default Mutation;
