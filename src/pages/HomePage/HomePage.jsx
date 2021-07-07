import React from 'react'
import { CreateUser } from '../components';

class HomePage extends React.Component {
  constructor (props) {
    super(props);
    this.state=({});
  }

  render() {
    return (
      <div style={ { display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ color: 'black', fontSize: '25px', marginBottom: '50px' }}>
          <h1>Welcome to Chat App</h1>
          <hr/>
        </span>
        <CreateUser />
      </div>
    )
  }
}
export default HomePage;