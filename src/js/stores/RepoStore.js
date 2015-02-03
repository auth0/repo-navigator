
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var _repositories = [];

var RepoStore = assign({}, EventEmitter.prototype, {


  init: function(repositories) {
    _repositories = repositories;
    this.emitChange();
  },
  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _repositories;
  },

  getByTags: function(tags) {
    if (!tags) {
      return [];
    }
    var result = _.filter(_repositories, function(repo) {
      if (!repo.tags) {
        return false;
      }
      var union = _.union(repo.tags, tags);
      return repo.tags.length === union.length;
    });
    return result || [];
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
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
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.SELECT_REPO:
      setSelected(action.id);
      RepoStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = RepoStore;