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
        errorMsg: false,
        // currentMonth: this.currentDate.getMonth()
        // currentDate: new Date()
        currentDate: ''
      },
      watch: {
        category: 'getEvents',
        checkedEventType: 'getEvents',
        checkedAgeGroup: 'getEvents',
        checkedBorough: 'getEvents',
        eventPage: 'getEvents'
      },
      mounted: function() {
        this.getCurrentMonth(),
        this.getCategories(),
        this.parseQuery(),
        this.getEvents()
      },
      methods: {
        getEvents: EventsList.getEvents,
        generateFilterURL: EventsList.generateFilterURL,
        parseQuery: EventsList.parseQuery,
        getCurrentMonth: EventsList.getCurrentMonth,
        getCategories: EventsList.getCategories
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
    this.$router.push({name: 'events', query: {cat_id: this.checkedEventType, age_id: this.checkedAgeGroup, borough_id: this.checkedBorough }});
  }else {
    this.$router.push({query: {cat_id: this.checkedEventType, age_id: this.checkedAgeGroup, borough_id: this.checkedBorough, page: this.eventPage }});
  }

  axios
  .get(url)
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

// get the categories and their groups
EventsList.getCategories = function() {
  axios
  .get(this.eventTypeURL)
  .then(response => (this.eventTypes = response.data))
  .catch(error => console.log(error))

  axios
  .get(this.ageGroupURL)
  .then(response => (this.ageGroups = response.data))
  .catch(error => console.log(error))

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

  if (_.isArray(query.cat_id)){
    if (query.cat_id.every( (val, i, arr) => val === arr[0] )){
      query.cat_id = query.cat_id[0];
    }else{
      this.checkedEventType=query.cat_id.map(Number);
    }
  }

  if (!_.isArray(query.cat_id) && query.cat_id){
    this.checkedEventType.push(parseInt(query.cat_id, 10));
  }

  if (_.isArray(query.age_id)){
    if (query.age_id.every( (val, i, arr) => val === arr[0] )) {
      query.age_id = query.age_id[0];
    } else {
      this.checkedAgeGroup=query.age_id.map(Number);
    }
  }

  if (!_.isArray(query.age_id) && query.age_id) {
    this.checkedAgeGroup.push(parseInt(query.age_id,10));
  }

  if (_.isArray(query.borough_id)){
    if (query.borough_id.every( (val, i, arr) => val === arr[0] )) {
      query.borough_id = query.borough_id[0];
    } else {
      this.checkedBorough=query.borough_id.map(Number);
    }
  }

  if (!_.isArray(query.borough_id) && query.borough_id) {
    this.checkedBorough.push(parseInt(query.borough_id,10));
  }

  if(query.page) {
    this.eventPage=query.page;
  }
}

// for the monthly pagination
EventsList.getCurrentMonth = function() {
  let eventDate = new Date();
  this.currentDate = {
    'month': eventDate.toLocaleString("en-us", { month: "long" }),
    'year': eventDate.getFullYear()
  }
}


export default EventsList;
