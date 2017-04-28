import React from 'react';
import ReactDOM from 'react-dom';

class Greet extends React.Component {
  propTypes () {
    return {
      name: React.PropTypes.string.isRequired,
    };
  }

  render () {
    return (
      <div>
        Hello, {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <Greet name={name} />,
  document.getElementById('react_test')
);
