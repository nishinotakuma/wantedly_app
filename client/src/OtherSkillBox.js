import React from 'react';
import ReactDOM from 'react-dom';


class OtherSkillBox extends React.Component {
  render (){
    return (<div>hello</div>)
  }
}
ReactDOM.render(
  <OtherSkillBox user_id={user_id} />,
  document.getElementById('other_skill_box')
);
