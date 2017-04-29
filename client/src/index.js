import React from 'react';
import ReactDOM from 'react-dom';

class SkillBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      skills: [],
      addSkillMode: false,
      hiddenSkillMode: false
    }
  }

  changeMode(e){
    console.log("ok");
  }

  componentDidMount() {
    $.ajax({
      url: this.props.url,
      type: 'GET',
      dataType: 'json',
      cache: false,
      success: (skills) => {
        console.log(skills);
        this.setState({skills: skills}); },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  render () {
    return (
      <div>
        <SkillList skills={this.state.skills} changeMode={this.changeMode}/>
        <SkillForm/>
      </div>
    );
  }
}

class SkillList extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    const skillNodes = this.props.skills.map((skill)=>{
      return (<Skill skill={skill}/>)
    });
    return (
      <div>
        {skillNodes}
      </div>
    );
  }
}

class SkillForm extends React.Component {

  render () {
    return (
      <div>
        フォーム
      </div>
    );
  }
}

class Skill extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <span>
        <div>
          {this.props.skill.count}
        </div>
        <div>
          {this.props.skill.name}
        </div>
      </span>
    );
  }
}

ReactDOM.render(
  <SkillBox url={url} />,
  document.getElementById('skill_box')
);
