
var SectionItem = require('./SectionItem.react');
var SectionStore = require('../stores/SectionStore');
var React = require('react');

function getStateFromStores() {
  return {
    sections: SectionStore.getAll()
  };
}

var SectionListContainer = React.createClass({
  
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    SectionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SectionStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var items = [];
    this.state.sections.forEach(function(section) {
      items.push(<SectionItem section={section} key={section.id} />);
    });
    return (
        <div>{items}</div>
      );
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }
});

module.exports = SectionListContainer;