import { User, Messages } from "./constants";

const Query = {
  getAllUser: () => User,

  getUser: (parent, { id }) => User.filter(data => data.id === id)[0],

  getMessage:
    (parent, { sender, receiver }) => Messages.filter(
      data => (
        ((data.sender === sender) && (data.receiver === receiver)) || ((data.sender === receiver) && (data.receiver === sender))
      ),
    ),
};

export default Query;
