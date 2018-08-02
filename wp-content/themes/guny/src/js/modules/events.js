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
        boroughs: null,
        checkedEventType: [],
        checkedAgeGroup: [],
        checkedBorough: [],
        postType: 'tribe_events',
        categories: null,
        category: null,
        eventPage: 0
      },
      watch: {
        // category: 'updateEvents'
        category: 'getEvents',
        checkedEventType: 'getEvents',
        checkedAgeGroup: 'getEvents',
        checkedBorough: 'getEvents'
      },
      mounted: function() {
        this.getEventTypes(),
        this.getAgeGroups(),
        this.getBoroughs(),
        this.getEvents()
      },
      methods: {
        getEvents: EventsList.getEvents,
        // getSelected: EventsList.getSelected,
        getEventTypes: EventsList.getEventTypes,
        getAgeGroups: EventsList.getAgeGroups,
        getBoroughs: EventsList.getBoroughs,
        generateFilterURL: EventsList.generateFilterURL,
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
  console.log(this.checkedEventType);

  let filters = EventsList.generateFilterURL(this.checkedEventType, this.checkedAgeGroup, this.checkedBorough, this.eventPage);
  url = url + '?' + filters;
  console.log('new url ' + url)
  // if (this.category) {
  //   url = this.eventsURL + this.catsQuery + this.category;
  // }
  axios
  .get(url)
  .then(response => (this.events = response.data))
  .catch(error => console.log(error))
}

// get the post category based on user selection
// EventsList.getSelected = function(event) {
//   let cat_id = event.target.getAttribute('href');
//   this.category = cat_id;
// }


EventsList.generateFilterURL = function(types, ages, borough, page) {
  let filters = [];

  if ( types.length > 0 ){
    filters.push('tribe_events_cat=' + types.join('&tribe_events_cat='));
  }

  return filters;
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

EventsList.getBoroughs = function() {
  console.log('getBoroughs')
  axios
  .get(this.boroughURL)
  .then(response => (this.boroughs = response.data))
  .catch(error => console.log(error))
}


export default EventsList;
