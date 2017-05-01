import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

class OtherSkillBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      skills: [],
      recommendMode: false,
      value:"",
      suggestions:[]
    }
    this.changeToRecommendMode = this.changeToRecommendMode.bind(this);
    this.updateCountToSkill = this.updateCountToSkill.bind(this);
    this.onChange=this.onChange.bind(this);
    this.onSuggestionsFetchRequested=this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested=this.onSuggestionsClearRequested.bind(this);
    this.submitAddSkills=this.submitAddSkills.bind(this)
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
    const {recommendMode} = this.state;
    this.setState({recommendMode: !recommendMode});
  }

  onChange(event, { newValue, method }){
    this.setState({
      value: newValue
    });
  };

  submitAddSkills(){
    const url = "/users/" + user_id + "/update_other_skill";
    const {value,skills} = this.state;
    if (skills.some(function(skill){
      return (skill.name == value)
    })){
      this.setState({value: ""})
      return true
    }
    $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({value: value}),
            success: function (skill) {
              const {skills} = this.state;
              skills.push(skill);
              this.setState({
                skills: skills,
                value:""
              });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
  }

  onSuggestionsFetchRequested({ value }){
    const url = "/users/" + user_id + "/get_skills_suggestion";
    const {addSelectedSkills} = this.state;
    $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            data: {value: value},
            success: function (data) {
              const {skills} = this.state;
              const filteredSuggestion = data.filter(function(skill){
                return !(skills.some(function(existSkill){
                  return (existSkill.name === skill.name)
                }))
              });
              this.setState({suggestions: filteredSuggestion});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
  };

  onSuggestionsClearRequested(){
    this.setState({
      suggestions: []
    });
  };

  render (){
    if (this.state.recommendMode){
      const getSuggestionValue = suggestion => suggestion.name;
      const {value, suggestions} = this.state;
      const inputProps = {
              placeholder: 'スキルを入力',
              value,
              onChange: this.onChange
      };
      return (
        <div>
          <button onClick={this.changeToRecommendMode}>キャンセル</button>
          <form onSubmit={this.onFormSubmit}>
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
          </form>
          <button onClick={this.submitAddSkills}>作成</button>
          <SkillList skills={this.state.skills} updateCountToSkill={this.updateCountToSkill}/>
        </div>
      )
    } else{
      return (
        <div>
          <button onClick={this.changeToRecommendMode}>スキルを作成する</button>
          <SkillList skills={this.state.skills} updateCountToSkill={this.updateCountToSkill}/>
        </div>
      )

    }
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
