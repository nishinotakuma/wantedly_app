import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';

class SkillBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      skills: [],
      hiddenSelectedSkills: [],
      addSkillMode: false,
      hiddenSkillMode: false
    }
    this.changeToAddMode = this.changeToAddMode.bind(this)
    this.changeToHiddenMode = this.changeToHiddenMode.bind(this)
    this.changeToListMode = this.changeToListMode.bind(this)
    this.setNewSkills = this.setNewSkills.bind(this)
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

  setNewSkills(skills){
    this.setState({
      skills: skills,
      addSkillMode: false,
      hiddenSkillMode: false
    })
  }

  componentDidMount() {
    $.ajax({
      url: "/users/" + user_id + "/get_skills",
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

  render () {
    if (this.state.addSkillMode){
      return (
        <div>
          <SkillAddForm
              changeToListMode={this.changeToListMode}
              submitAddSkills={this.submitAddSkills}
              skills={this.state.skills}
              setNewSkills={this.setNewSkills}
          />
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
      return (<Skill skill={skill} changeToAddMode={this.props.changeToAddMode} key={skill.name}/>)
    });
    return (
      <div>
        {skillNodes}
      </div>
    );
  }
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

class SkillAddForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addSelectedSkills: [],
      value: "",
      suggestions:[]
    };
    this.onChange=this.onChange.bind(this);
    this.onSuggestionsFetchRequested=this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested=this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected=this.onSuggestionSelected.bind(this)
    this.onFormSubmit=this.onFormSubmit.bind(this)
    this.deleteSelectedSkill=this.deleteSelectedSkill.bind(this)
    this.submitAddSkills=this.submitAddSkills.bind(this)
  }

  componentDidMount(){
    var skills = this.props.skills;
    this.setState({addSelectedSkills: skills })
  }

  onChange(event, { newValue, method }){
    this.setState({
      value: newValue
    });
  };

  submitAddSkills(){
    const url = "/users/" + user_id + "/update_skills";
    const {addSelectedSkills} = this.state;
    $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({skills: addSelectedSkills}),
            success: function (data) {
              this.props.setNewSkills(data);
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
              const {addSelectedSkills} = this.state;
              const filteredSuggestion = data.filter(function(skill){
                return !(addSelectedSkills.some(function(selectedSkill){
                  return (selectedSkill.name === skill.name)
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

  onSuggestionSelected(event, { suggestion, suggestionValue}){
    const {addSelectedSkills} = this.state;
    addSelectedSkills.push(suggestion);
    this.setState({
      addSelectedSkills: addSelectedSkills,
      value: ""
    })
  }

  deleteSelectedSkill(event){
    const skillName = event.target.value;
    const {addSelectedSkills} = this.state;
    const newSkills = addSelectedSkills.filter(function(skill){
      return (skill.name != skillName )
    });
    this.setState({addSelectedSkills: newSkills })
    console.log(event.target.value);
  }

  onFormSubmit(event){
    event.preventDefault();
    const addSelectedSkills = this.state.addSelectedSkills;
    const value = this.state.value;
    const skill = {name: value, id: null, status: "published", count: 0};
    if (!addSelectedSkills.some(function(skill){
      return (skill.name == value)
    })){
      addSelectedSkills.push(skill);
    };
    this.setState({
      addSelectedSkills: addSelectedSkills,
      value: ""
    })
  }

  render () {
    const getSuggestionValue = suggestion => suggestion.name;
    const {value, suggestions} = this.state;
    const inputProps = {
            placeholder: 'スキルを入力',
            value,
            onChange: this.onChange
    };
    const selectedSkillNodes = this.state.addSelectedSkills.map((skill)=>{
      return (<SelectedSkill skill={skill} deleteSelectedSkill={this.deleteSelectedSkill} key={skill.name} />)
    });
    return (
      <div>
        <div>{selectedSkillNodes}</div>
        <form onSubmit={this.onFormSubmit}>
          <Autosuggest
              suggestions={suggestions}
              onSuggestionSelected={this.onSuggestionSelected}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
          />
        </form>

        <button onClick={this.submitAddSkills}>更新</button>
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
      <span onClick={this.props.changeToAddMode} >
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

class SelectedSkill extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <button onClick={this.props.deleteSelectedSkill} value={this.props.skill.name} >削除</button>
        <div>
          {this.props.skill.count}
        </div>
        <div>
          {this.props.skill.name}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <SkillBox user_id={user_id} />,
  document.getElementById('skill_box')
);
