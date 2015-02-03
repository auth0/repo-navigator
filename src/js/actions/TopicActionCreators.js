var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var TopicActionCreators = {

  /**
   * @param  {string} id
   */
  clickTopic: function(sectionId, topicId) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SELECT_TOPIC,
      sectionId: sectionId,
      topicId: topicId
    });
  }

};

module.exports = TopicActionCreators;