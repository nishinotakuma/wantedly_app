import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';

class SkillBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      skills: [],
      addSelectedSkills:[],
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
    const {skills} = this.state;
    this.setState({
      addSelectedSkills: skills,
      hiddenSkillMode: false,
      addSkillMode: false
    });
  }

  setNewSkills(skills){
    this.setState({
      skills: skills,
      addSelectedSkills: skills,
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
          skills: skills,
          addSelectedSkills: skills
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
              addSelectedSkills={this.state.addSelectedSkills}
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
          <button onClick={this.changeToAddMode}>スキル編集</button>
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
    const skillNodes = this.props.skills.sort(function(a,b){
        if(a.count<b.count) return 1;
        if(a.count > b.count) return -1;
        return 0;
    }).map((skill)=>{
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
      addSelectedSkills: this.props.addSelectedSkills,
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
    }) && value){
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
      return (<SelectedSkill skill={skill} deleteSelectedSkill={this.deleteSelectedSkill} key={"add_selected_" + skill.name} />)
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
      <li onClick={this.props.changeToAddMode} >
        <span>
          {"(" + this.props.skill.count + ")"}
        </span>
        <span>
          {this.props.skill.name}
        </span>
        <a href={'/skills/' + this.props.skill.id}>
          このスキルを持つユーザ一覧へ
        </a>
      </li>
    );
  }
}

class SelectedSkill extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <li>
        <button onClick={this.props.deleteSelectedSkill} value={this.props.skill.name} >削除</button>
        <span>
          {"(" + this.props.skill.count + ")"}
        </span>
        <span>
          {this.props.skill.name}
        </span>
      </li>
    );
  }
}

ReactDOM.render(
  <SkillBox user_id={user_id} />,
  document.getElementById('skill_box')
);
