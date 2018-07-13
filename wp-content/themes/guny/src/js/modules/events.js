'use strict';
import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';
// import EventsFilter from 'events';


class EventsList {

  constructor() {
    this._baseURL = window.location.origin;

    this._events = {
      delimiters: ['v{', '}'],
      el: '#vue-events',
      data: {
        // eventsURL: this._baseURL + '/wp-json/tribe/events/v1/events?start_date=today&after=today&order=asc',
        eventsURL: this._baseURL + '/wp-json/tribe/events/v1/events',
        eventsQuery: '?tribe_events_cat=',
        catsQuery: '?categories[]=',
        catsURL: this._baseURL + '/wp-json/tribe/events/v1/categories',
        events: null,
        postType: 'tribe_events',
        categories: null,
        category: null
      },
      watch: {
        // category: 'updateEvents'
        category: 'getEvents'
      },
      mounted: function() {
        this.getEvents()
      },
      methods: {
        getEvents: EventsList.getEvents,
        getSelected: EventsList.getSelected,
        getCategories: EventsList.getCategories,
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
  if (this.category) {
    url = this.eventsURL + this.catsQuery + this.category;
  }
  axios
  .get(url)
  .then(response => (this.events = response.data.events))
  .catch(error => console.log(error))
}

// get the post category based on user selection
EventsList.getSelected = function(event) {
  let cat_id = event.target.getAttribute('href');
  this.category = cat_id;
}

// get the categories for the filter
EventsList.getCategories = function() {
  axios
  .get(this.catsURL)
  .then(response => (this.events = response.data.events))
  .catch(error => console.log(error))
}



export default EventsList;
