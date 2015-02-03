
var React = require('react');
var TopicActionCreators = require('../actions/TopicActionCreators');
var SectionStore = require('../stores/SectionStore');
var RepoListContainer = require('./RepoListContainer.react');

function getStateFromStores() {
  return {
    selectedSection: SectionStore.getSelectedSection(),
    selectedTopic: SectionStore.getSelectedTopic()
  };
}


var TopicItem = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    SectionStore.addTopicSelectionChangeListener(this._onSelectionChange);
  },

  componentWillUnmount: function() {
    SectionStore.removeTopicSelectionChangeListener(this._onSelectionChange);
  },

  render: function() {
    var sampleContent = '';
    if (this.state.selectedSection.id === this.props.section.id &&
        this.state.selectedTopic.id === this.props.topic.id) {
      sampleContent =  <RepoListContainer tags={this.props.topic.tags} />;
    }
    return (
      <div onClick={this._onClick}>
        <h4>{this.props.topic.title}</h4>
        {sampleContent}
      </div>
      );
  },

  _onClick: function() {
    TopicActionCreators.clickTopic(this.props.section.id, this.props.topic.id);
  },

  _onSelectionChange: function() {
    this.setState(getStateFromStores());
  }
});

module.exports = TopicItem;