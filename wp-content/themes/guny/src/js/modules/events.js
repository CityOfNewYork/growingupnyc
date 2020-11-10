'use strict';

/**
 * Virtual Events for Generation Landing
 */

import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';
import router from './router'
class Events {

  constructor() {
    const baseUrl = window.location.origin + '/wp-json/wp/v2/';
    const eventUrl = window.location.origin + '/wp-json/tribe/events/v1/';
    const element = document.querySelector('[id*="vue"]');
    const elementId = element.getAttribute('id');
    const postType = elementId.replace('vue-', '');
    const filters = element.getAttribute('data-filters');

    new Vue({
      delimiters: ['v{', '}'],
      el: `#${elementId}`,
      router,
      data: {
        baseUrl: baseUrl,
        postType: postType,
        postCatURL: `${eventUrl}categories`,
        postsURL: `${eventUrl}${postType}?`,
        posts: null,
        labels: Events.setTaxObj(filters, true),
        taxonomies: Events.setTaxObj(filters, false),
        filters: [],
        checkedFilters: [],
        totalFilters: 0,
        totalPosts: 0,
        totalVisible: 0,
        perPage: 6,
        page: 1
      },
      watch: {
        // checkedFilters: 'getEvents',
        checkedFilters: function () {
          this.page = 1
          this.getEvents()
        },
        page: 'getEvents'
      },
      methods: {
        getEvents: Events.getEvents,
        getTax: Events.getTax,
      },
      created: function () {

        /**
         * Get the taxonomies
         */
        let vals = this.getTax()
        axios.all(vals.map(l => axios.get(l)))
          .then(axios.spread((...res) => {
            this.filters = res.map(value => Array.isArray(value.data) ?
              value.data : value.data.categories)

            if (Object.keys(this.$route.query).length > 0) {
              Events.parseQuery(this)
            }
          }));
      },
      mounted: function () {
        if (Object.keys(this.$route.query).length == 0) {
          this.getEvents()
        }
      }
    })
  }
}

/**
 * Update the router based on the filters and returns the filters
 * @param {object} obj 
 */
Events.generateFilters = function (obj) {

  let checked = obj.checkedFilters

  obj.totalFilters = checked.length

  // generate the query params
  var params = {};
  var ids = {};
  checked.forEach(function (term) {
    var key = term.taxonomy;
    params[key] = params[key] || [];
    params[key] = params[key].concat(term.slug);
    ids[key] = ids[key] || [];
    ids[key] = ids[key].concat(term.id);
  });

  // update the router based on the filters
  if (JSON.stringify(obj.$route.query) != JSON.stringify(params)) {
    obj.$router.push({ query: params });
  }

  // generate the string for the api call
  let combinedFilter = []
  Object.keys(ids).forEach(function (key) {
    combinedFilter.push(`${key}[]=${ids[key].join(`&${key}[]=`)}`)
  })
  combinedFilter = combinedFilter.join('&')

  return combinedFilter;

}

/**
 * Extracts the filters in the URL and updates the checkedFilters
 * @param {object} obj 
 */
Events.parseQuery = function (obj) {
  let query = obj.$route.query;
  const filters = obj.filters

  // find the slugs in the taxonomies and add them to checkedFilters
  let checked = []
  let terms = [].concat.apply([], filters);
  Object.keys(query).forEach(function (key) {

    if (Array.isArray(query[key])) {
      query[key].forEach(function (term) {
        checked.push(terms.filter(x => x.slug === term)[0])
      })
    } else {
      checked.push(terms.find(item => item.slug === query[key]));
    }
  });

  // reassigns the checked filters
  obj.checkedFilters = checked;
}

/**
 * Request to get the programs and update router
 **/
Events.getEvents = function () {

  let filters = Events.generateFilters(this)

  let url = `${this.postsURL}&${filters}`;

  axios
    .get(url)
    .then(response => {
      this.totalPosts = response.data.events.total
      console.log(response.data.events)
      if (this.posts != null && this.page > 1) {
        this.posts = this.posts.concat(response.data.events);
      } else {
        this.posts = response.data.events
      }
      this.totalVisible = this.posts.length
    })
    .catch(error => {
      console.log('Error on request: ' + error)
    });
}

/**
 * Creates an object with keys that will be populated when the user filters
 * OR creates an array of labels
 * @param {string} str 
 * @param {boolean} labels 
 */
Events.setTaxObj = function (str, labels) {

  const arr = str.split(',')

  let taxonomies = []
  arr.map(function (i) {
    let arrStr = i.split(':')
    if (labels) {
      taxonomies.push(arrStr[1])
    } else {
      let obj = {};
      obj[arrStr[0]] = null;
      taxonomies.push(obj)
    }
  });

  return taxonomies;
}

/** 
 * Creates the array of URLS to get the taxonomies
 */
Events.getTax = function () {

  let promises = this.taxonomies.map(x => Object.keys(x)[0] != 'tribe_events_cat' ? 
    `${this.baseUrl}${Object.keys(x)[0]}?hide_empty=true` : 
    `${this.postCatURL}?hide_empty=true`);

  return promises
}

export default Events;