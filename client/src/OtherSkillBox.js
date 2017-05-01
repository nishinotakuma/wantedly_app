import React from 'react';
import ReactDOM from 'react-dom';


class OtherSkillBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      skills: [],
      recommendMode: false,
    }
    this.changeToRecommendMode = this.changeToRecommendMode.bind(this);
    this.updateCountToSkill = this.updateCountToSkill.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: "/users/" + user_id + "/get_other_skills",
      type: 'GET',
      dataType: 'json',
      cache: false,
      success: (skills) => {
        console.log(skills);
        this.setState({
          skills: skills
        }); },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  updateCountToSkill(skill){
    console.log(skill)
    $.ajax({
      url: "/users/" + user_id + "/update_count_skills",
      type: 'POST',
      dataType: 'json',
      cache: false,
      data: ({skill: skill}),
      success: (skill) => {
        const {skills} = this.state;
        skills.some(function(v, i){
            if (v.id == skill.id) skills.splice(i,1);
        });
        skills.push(skill);
        this.setState({
          skills: skills
        }); },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  changeToRecommendMode(){
    this.setState({recommendMode: true});
  }

  render (){
    return (
      <div>
        <button onClick={this.changeToRecommendMode}>スキルを推薦する</button>
        <SkillList skills={this.state.skills} updateCountToSkill={this.updateCountToSkill}/>
      </div>
    )
  }
}

class SkillList extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    const skillNodes = this.props.skills.sort(function(a,b){
        if(a.count<b.count) return 1;
        if(a.count > b.count) return -1;
        return 0;
    }).map((skill)=>{
      return (<Skill skill={skill} key={skill.name} updateCountToSkill={this.props.updateCountToSkill}/>)
    });
    return (
      <div>
        {skillNodes}
      </div>
    );
  }
}

class Skill extends React.Component {

  constructor(props) {
    super(props);
    this._updateCountToSkill = this._updateCountToSkill.bind(this);
  }

  _updateCountToSkill(){
    this.props.updateCountToSkill(this.props.skill);
  }

  render () {
    const class_name = this.props.skill.current_user_add ? "added" : "not_added";
    return (
      <li>
        <span onClick={this._updateCountToSkill} className={class_name}>
          {"(" + this.props.skill.count + ")"}
        </span>
        <a href={'/skills/' + this.props.skill.id} >
          <span>
            {this.props.skill.name}
          </span>
        </a>
      </li>
    );
  }
}

ReactDOM.render(
  <OtherSkillBox user_id={user_id} />,
  document.getElementById('other_skill_box')
);
