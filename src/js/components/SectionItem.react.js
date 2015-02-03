
var TopicItem = require('./TopicItem.react');
var React = require('react');

var SectionItem = React.createClass({
  render: function() {
    var items = [];
    this.props.section.topics.forEach((function(topic) {
      items.push(<TopicItem section={this.props.section} topic={topic} key={topic.id} />);
    }).bind(this));
    return (
      <div class="section-item">
        <h3>{this.props.section.title}</h3>
        {items}
      </div>
      );
  },
});

module.exports = SectionItem;