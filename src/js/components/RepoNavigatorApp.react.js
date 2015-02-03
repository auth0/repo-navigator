
var SectionListContainer = require('./SectionListContainer.react');
var React = require('react');

var SampleNavigatorApp = React.createClass({
  render: function() {
    return (
      <div class="repo-navigator">
        <SectionListContainer />
      </div>
    );
  }
});

module.exports = SampleNavigatorApp;