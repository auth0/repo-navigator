
var React = require('react');

var RepoItem = React.createClass({
  render: function() {
    return (
      <div>
        <a href={this.props.repo.url}>{this.props.repo.name}</a>
      </div>
      );
  },
});

module.exports = RepoItem;