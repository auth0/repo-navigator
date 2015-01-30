
var SampleBox = React.createClass({
  render: function() {
    return (
      <div>
        <p>{this.props.repo.name}</p>
      </div>
      );
  }
})

var SampleSectionRow = React.createClass({
  render: function() {
    var samples = [];
    this.props.section.repos.forEach(function(repo) {
      if (repo.type === 'sample') {
        samples.push(<SampleBox repo={repo} />);
      }
    });
    return (
      <div>
        <h3>{this.props.section.title}</h3>
        {samples}
      </div>
      );
  }
});

var SampleSectionsContainer = React.createClass({
  render: function() {
    var rows = [];
    this.props.sections.forEach(function(section) {
      rows.push(<SampleSectionRow section={section} />);
    });
    return (
        <div>{rows}</div>
      );
  }
});

var SampleNavigator = React.createClass({
    render: function() {
        return (
            <div>
                <SampleSectionsContainer sections={this.props.sections} />
            </div>
        );
    }
});

$.getJSON('settings.json', function(data) {
  data.sections.forEach(function(section) {
    section.repos = data.repos;
  });
  var SampleNavigatorFactory = React.createFactory(SampleNavigator);
  var sampleNavigator = SampleNavigatorFactory({ sections: data.sections });
  React.render(sampleNavigator, document.getElementById('sample-navigator'));
});