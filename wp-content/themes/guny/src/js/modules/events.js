'use strict';
import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';

class EventsList {

  constructor() {
    if(document.documentElement.lang != 'en'){
      this._baseURL = window.location.origin + '/' + document.documentElement.lang;
    }else{
      this._baseURL = window.location.origin;
    }

    this._events = {
      delimiters: ['v{', '}'],
      el: '#vue-events',
      data: {
        eventsURL: this._baseURL + '/wp-json/wp/v2/tribe_events',
        eventTypeURL: this._baseURL + '/wp-json/wp/v2/tribe_events_cat',
        ageGroupURL: this._baseURL + '/wp-json/wp/v2/age_group',
        boroughURL: this._baseURL + '/wp-json/wp/v2/borough',
        eventTypes: null,
        events: null,
        ageGroups: null,
        postType: 'tribe_events',
        categories: null,
        category: null
      },
      watch: {
        // category: 'updateEvents'
        category: 'getEvents'
      },
      mounted: function() {
        this.getEventTypes(),
        this.getAgeGroups(),
        this.getEvents()
      },
      methods: {
        getEvents: EventsList.getEvents,
        getSelected: EventsList.getSelected,
        getEventTypes: EventsList.getEventTypes,
        getAgeGroups: EventsList.getAgeGroups,
      }
    }
  }

  /**
   * Initialize
   */
  init() {
    this._events = new Vue(this._events);
  }
}

// get the events
EventsList.getEvents = function() {
  let url = this.eventsURL;
  console.log('url ' + url);
  // if (this.category) {
  //   url = this.eventsURL + this.catsQuery + this.category;
  // }
  axios
  .get(url)
  .then(response => (this.events = response.data))
  .catch(error => console.log(error))
}

// get the post category based on user selection
EventsList.getSelected = function(event) {
  let cat_id = event.target.getAttribute('href');
  this.category = cat_id;
}

// get the categories for the filter
EventsList.getEventTypes = function() {
  axios
  .get(this.eventTypeURL)
  .then(response => (this.eventTypes = response.data))
  .catch(error => console.log(error))
}

EventsList.getAgeGroups = function() {
  axios
  .get(this.ageGroupURL)
  .then(response => (this.ageGroups = response.data))
  .catch(error => console.log(error))
}



export default EventsList;
