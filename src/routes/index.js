import React, { Component } from 'react';
import { connect } from 'dva';
import CalenderComponent from './components/CalenderComponent'

class Index extends Component {
  
  render() {
    return (
      <div>
        <CalenderComponent />
      </div>
    )
  }
}

export default connect()(Index);
