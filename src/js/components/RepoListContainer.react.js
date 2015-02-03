
var RepoItem = require('./RepoItem.react');
var RepoStore = require('../stores/RepoStore');
var React = require('react');

function getStateFromStores(tags) {
  return {
    repos: RepoStore.getByTags(tags)
  };
}

var SectionListContainer = React.createClass({
  
  getInitialState: function() {
    return getStateFromStores(this.props.tags);
  },

  // componentDidMount: function() {
  //   SectionStore.addChangeListener(this._onChange);
  // },

  // componentWillUnmount: function() {
  //   SectionStore.removeChangeListener(this._onChange);
  // },

  render: function() {
    var items = [];
    this.state.repos.forEach(function(repo) {
      items.push(<RepoItem repo={repo} key={repo.id} />);
    });
    if (items.length === 0) {
      items = <p>No repositories found.</p>;
    }
    return (
        <div>
          {items}
        </div>
      );
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  // _onChange: function() {
  //   this.setState(getStateFromStores(this.props.tags));
  // }
});

module.exports = SectionListContainer;