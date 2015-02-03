
var SampleNavigatorApp = require('./components/SampleNavigatorApp.react');
var SectionStore = require('./stores/SectionStore');
var SampleStore = require('./stores/SampleStore');
var React = require('react');
window.React = React;


var RepoNavigator = function(element) {
  React.render(
    <SampleNavigatorApp />,
    element
  );
}

RepoNavigator.prototype.init = function(data) {
  SectionStore.init(data.sections);
  SampleStore.init(data.repos);
};


module.export = window.RepoNavigator = RepoNavigator;

