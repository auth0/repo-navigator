
var RepoNavigatorApp = require('./components/RepoNavigatorApp.react');
var SectionStore = require('./stores/SectionStore');
var RepoStore = require('./stores/RepoStore');
var React = require('react');
window.React = React;


var RepoNavigator = function(element) {
  React.render(
    <RepoNavigatorApp />,
    element
  );
}

RepoNavigator.prototype.init = function(data) {
  SectionStore.init(data.sections);
  RepoStore.init(data.repos);
};


module.export = window.RepoNavigator = RepoNavigator;

