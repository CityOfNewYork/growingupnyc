'use strict';
import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';
import router from './router'


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
      router,
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
        eventPage: 1,
        errorMsg: false
      },
      watch: {
        category: 'getEvents',
        checkedEventType: 'getEvents',
        checkedAgeGroup: 'getEvents',
        checkedBorough: 'getEvents'
      },
      mounted: function() {
        this.getEventTypes(),
        this.getAgeGroups(),
        this.getBoroughs(),
        this.parseQuery(),
        this.getEvents()
      },
      methods: {
        getEvents: EventsList.getEvents,
        getEventTypes: EventsList.getEventTypes,
        getAgeGroups: EventsList.getAgeGroups,
        getBoroughs: EventsList.getBoroughs,
        generateFilterURL: EventsList.generateFilterURL,
        parseQuery: EventsList.parseQuery,
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

  let filters = EventsList.generateFilterURL(this.checkedEventType, this.checkedAgeGroup, this.checkedBorough, this.eventPage);
  url = url + '?' + filters;

  // update the query
  if ( this.eventPage == 1){
    this.$router.push({name: 'events', query: {tribe_events_cat: this.checkedEventType, age_group: this.checkedAgeGroup, borough: this.checkedBorough }});
  }else {
    this.$router.push({query: {tribe_events_cat: this.checkedEventType, age_group: this.checkedAgeGroup, borough: this.checkedBorough, page: this.eventPage }});
  }

  axios
  .get(url)
  // .then(response => (this.events = response.data))
  .then(response => {
      this.events = response.data
      if (this.events.length == 0) {
        this.errorMsg = true;
      } else {
        this.errorMsg = false;
      }
    })
  .catch(error => console.log(error))
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
  axios
  .get(this.boroughURL)
  .then(response => (this.boroughs = response.data))
  .catch(error => console.log(error))
}

/**
 * Generate the string filter for all user chosen taxonomies
 * @param {array} - array with the ids of event types
 * @param {array} - array with the ids of age groups
 * @param {integer} - page number
 * @return {string} - string of all filters
 **/
EventsList.generateFilterURL = function(types, ages, boroughs, page) {
  let filters = [];

  if ( types.length > 0 ) {
    filters.push('tribe_events_cat[]=' + types.join('&tribe_events_cat[]='));
  }

  if ( ages.length > 0  ) {
    filters.push('age_group[]=' + ages.join('&age_group[]='));
  }

  if ( boroughs.length > 0  ) {
    filters.push('borough[]=' + boroughs.join('&borough[]='));
  }

  if (page > 1) {
    filters.push('page=' + page);
  }

  filters = filters.join('&');
  
  return filters;
}

/**
 * Extracts the taxonomies from the url query
 * and updates the program type and age group arrays 
 **/
EventsList.parseQuery = function() {
  let query =this.$route.query;

  if (_.isArray(query.tribe_events_cat)){
    if (query.tribe_events_cat.every( (val, i, arr) => val === arr[0] )){
      query.tribe_events_cat = query.tribe_events_cat[0];
    }else{
      this.checkedEventType=query.tribe_events_cat.map(Number);
    }
  }

  if (!_.isArray(query.tribe_events_cat) && query.tribe_events_cat){
    this.checkedEventType.push(parseInt(query.tribe_events_cat, 10));
  }

  if (_.isArray(query.age_group)){
    if (query.age_group.every( (val, i, arr) => val === arr[0] )) {
      query.age_group = query.age_group[0];
    } else {
      this.checkedAgeGroup=query.age_group.map(Number);
    }
  }

  if (!_.isArray(query.age_group) && query.age_group) {
    this.checkedAgeGroup.push(parseInt(query.age_group,10));
  }

  if (_.isArray(query.borough)){
    if (query.borough.every( (val, i, arr) => val === arr[0] )) {
      query.borough = query.borough[0];
    } else {
      this.checkedBorough=query.borough.map(Number);
    }
  }

  if (!_.isArray(query.borough) && query.borough) {
    this.checkedBorough.push(parseInt(query.borough,10));
  }

  if(query.page) {
    this.programPage=query.page;
  }

}


export default EventsList;
