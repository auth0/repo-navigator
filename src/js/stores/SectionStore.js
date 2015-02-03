
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var _ = require('lodash');


var CHANGE_EVENT = 'change';
var SELECTION_CHANGE_EVENT = 'selection_change';

var _sections = [];
var _selectedSection = {};
var _selectedTopic = {};

function setSelectedTopic(sectionId, topicId) {
  _selectedSection = _.find(_sections, { 'id': sectionId});
  if (_selectedSection) {
    _selectedTopic =  _.find(_selectedSection.topics, { 'id': topicId});
  }
};

var SectionStore = assign({}, EventEmitter.prototype, {

  init: function(repos) {
    _sections = repos;
    this.emitChange();
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _sections;
  },

  getSelectedTopic: function() {
    return _selectedTopic;
  },

  getSelectedSection: function() {
    return _selectedSection;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitSelectionChanged: function() {
    this.emit(SELECTION_CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },


  addTopicSelectionChangeListener: function(callback) {
    this.on(SELECTION_CHANGE_EVENT, callback);
  },

  removeTopicSelectionChangeListener: function(callback) {
    this.removeListener(SELECTION_CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.SELECT_TOPIC:
      setSelectedTopic(action.sectionId, action.topicId);
      SectionStore.emitSelectionChanged();
      break;

    default:
      // no op
  }
});

module.exports = SectionStore;


