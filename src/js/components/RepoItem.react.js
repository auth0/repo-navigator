
var React = require('react');

var RepoItem = React.createClass({
  render: function() {
    return (
      <div class="repoitem">
        <a href={this.props.repo.url}>{this.props.repo.name}</a>
        <p>{this.props.repo.description}</p>
      </div>
      );
  },
});

module.exports = RepoItem;
