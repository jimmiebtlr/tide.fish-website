Template.notifyIcon.count = function(){
  return Notifications.find({'to': Meteor.userId()}).count();
}

Template.notifications.notificationsCount = function(){
  return Notifications.find({'to': Meteor.userId()}).count();
}
