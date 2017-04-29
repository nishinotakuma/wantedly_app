import React from 'react';
import ReactDOM from 'react-dom';

class SkillBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      skills: [],
      addSelectedSkills: [],
      hiddenSelectedSkills: [],
      addSkillMode: false,
      hiddenSkillMode: false
    }
    this.changeToAddMode = this.changeToAddMode.bind(this)
    this.changeToHiddenMode = this.changeToHiddenMode.bind(this)
    this.changeToListMode = this.changeToListMode.bind(this)
    this.submitAddSkills = this.submitAddSkills.bind(this)
  }

  changeToAddMode(){
    this.setState({addSkillMode: true});
  }

  changeToHiddenMode(){
    this.setState({hiddenSkillMode: true});
  }

  changeToListMode(){
    this.setState({
      hiddenSkillMode: false,
      addSkillMode: false
    });
  }

  submitAddSkills(){
    console.log("yes");
  }

  componentDidMount() {
    $.ajax({
      url: this.props.url,
      type: 'GET',
      dataType: 'json',
      cache: false,
      success: (skills) => {
        console.log(skills);
        this.setState({
          skills: skills,
          addSelectedSkills:skills
        }); },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  render () {
    if (this.state.addSkillMode){
      return (
        <div>
          <SkillAddForm addSelectedSkills={this.state.addSelectedSkills} changeToListMode={this.changeToListMode} submitAddSkills={this.submitAddSkills}/>
        </div>
      );
    } else if (this.state.addSkillMode){
      return (
        <div>
          <SkillHiddenForm hiddenSelectedSkills={this.sate.hiddenSelectedSkills} changeToListMode={this.changeToListMode}/>
        </div>
      );
    }
    else{
      return (
        <div>
          <SkillList skills={this.state.skills} changeToAddMode={this.changeToAddMode}/>
        </div>
      );
    }
  }
}

class SkillList extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    const skillNodes = this.props.skills.map((skill)=>{
      return (<Skill skill={skill} changeToAddMode={this.props.changeToAddMode}/>)
    });
    return (
      <div>
        {skillNodes}
      </div>
    );
  }
}

class SkillAddForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      typeWord: ""
    }
  }

  render () {
    return (
      <div>
        <button onClick={this.props.submitAddSkills}>更新</button>
        <button onClick={this.props.changeToListMode}>キャンセル</button>
      </div>
    );
  }
}

class SkillHiddenForm extends React.Component {

  render () {
    return (
      <div>
        hiddenフォーム
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
      <span onClick={this.props.changeToAddMode}>
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
