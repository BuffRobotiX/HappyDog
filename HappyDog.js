parseBullshit = function (time, date) {
  var stuff = {hour: 0, minute: 0, day: 0, month: 0, year: 0}
  if (time.substring(5, 7) == "AM")
    stuff.hour = parseInt(time.substring(0, 2))
  else
    stuff.hour = parseInt(time.substring(0, 2)) + 12

  stuff.minute = parseInt(time.substring(3, 5))
  var dateArray = date.split(" ")
  stuff.day = parseInt(dateArray[0])
  var month = dateArray[1].substring(0, dateArray[1].length - 1)
  if (month == "January")
    stuff.month = 1
  else if (month == "February")
    stuff.month = 2
  else if (month == "March")
    stuff.month = 3
  else if (month == "April")
    stuff.month = 4
  else if (month == "May")
    stuff.month = 5
  else if (month == "June")
    stuff.month = 6
  else if (month == "July")
    stuff.month = 7
  else if (month == "August")
    stuff.month = 8
  else if (month == "September")
    stuff.month = 9
  else if (month == "October")
    stuff.month = 10
  else if (month == "November")
    stuff.month = 11
  else if (month == "December")
    stuff.month = 12

  stuff.year = parseInt(dateArray[2])

  return stuff
}

count = 0
SUPER_SECRET_ACCESS_TOKEN = "Get your own!"
SUPER_SECRET_DEVICE_ID = "AHHHHHHHHH!"

if (Meteor.isClient) {

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.onRendered( function () {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    })
    $('.timepicker').clockpicker({
      twelvehour: true
    });
  })

  Template.hello.events({
    'click .feed': function () {
      var url = 'https://api.spark.io/v1/devices/' + SUPER_SECRET_DEVICE_ID + '/servo?access_token=' + SUPER_SECRET_ACCESS_TOKEN
      var method = "POST";
      HTTP.call(method, url, function (error, result) {
      })
    },
    'click .schedule': function () {
      var date = document.getElementById("date").value;
      var time = document.getElementById("time").value;
      console.log(date)
      console.log(time)
      Meteor.call('scheduleFeeding', date, time, function (error, result) {
      });
    }
  });
}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    SyncedCron.start();
    SyncedCron.add({
        name: 'Place holder',
        schedule: function(parse) {
          return parse.recur().on(1).dayOfMonth().on(1).month().on(2017).year()
        },
        job: function() {
        }
      });
  });

  Meteor.methods({
    scheduleFeeding: function (date, time) {
      SyncedCron.add({
        name: 'Feed the dog! ' + count,
        schedule: function(parse) {
          // parser is a later.parse object
          var stuff = parseBullshit(time, date)
          return parse.recur().on(stuff.minute).minute().on(stuff.hour).hour().on(stuff.day).dayOfMonth().on(stuff.month).month().on(stuff.year).year()
        },
        job: function() {
          var url = 'https://api.spark.io/v1/devices/' + SUPER_SECRET_DEVICE_ID + '/servo?access_token=' + SUPER_SECRET_ACCESS_TOKEN
          var method = "POST";
          HTTP.call(method, url, function (error, result) {
          })
        }
      });
      count++
    }
  })
}