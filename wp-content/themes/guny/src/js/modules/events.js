'use strict';

/**
 * Virtual Events for Generation Landing
 */

import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';
import router from './router'

class EventsList {
  
  constructor() {
    const baseURL = window.location.origin;
    const el = '#' + $('div').find('[id^=vue]').attr('id');
    const posttype = el.replace(new RegExp("^" + '#vue-'), '')
    const utc = new Date().toJSON().slice(0, 10);
    const ages = JSON.parse($('div').find('[id^=vue]').attr('data-age'));
    const cats = JSON.parse($('div').find('[id^=vue]').attr('data-events')).join('&categories[]=');

    this._events = {
      delimiters: ['v{', '}'],
      el: el,
      router,
      data: {
        posttype: posttype,
        postsURL: baseURL + '/wp-json/tribe/events/v1/' + posttype + '?per_page=250&page=1&start_date=' + utc,
        postsAll: null,
        posts: null,
        ageGroupURL: baseURL + '/wp-json/wp/v2/age_group',
        ageGroups: null,
        checkedAgeGroup: ages,
        checkedAllAges: false,
        eventTypesURL: baseURL + '/wp-json/tribe/events/v1/' + 'categories',
        eventTypes: null,
        checkedEventType: [],
        checkedAllEventTypes: false,
        boroughURL: baseURL + 'borough',
        boroughNames: null,
        checkedBorough: [],
        checkedAllBoroughs: false,
        programPage: 1,
        currentPage: 1,
        maxPages: 1,
        errorMsg: false,
        isLoading: true,
        totalResults: '',
        showButton: false
      },
      watch: {
        checkedEventType: 'getPrograms',
        checkedAgeGroup: 'getPrograms',
      },
      mounted: function () {
        axios.all([
          axios.get(this.postsURL + '&categories[]=' + cats),
        ])
          .then(axios.spread((events) => {
            this.filterPosts(events.data.events)
            this.getTaxonomies();
            this.parseQuery();
            this.getPrograms();
          }));
      },
      methods: {
        getPrograms: EventsList.getPrograms,
        getTaxonomies: EventsList.getTaxonomies,
        selectAllEventTypes: EventsList.selectAllEventTypes,
        parseQuery: EventsList.parseQuery,
        loadMore: EventsList.loadMore,
        filterPosts: EventsList.filterPosts,
      },

    }
  }

  /**
   * Initialize
   **/
  init() {
    this._events = new Vue(this._events);
  }
}

/**
 * Request to get the posts and update router
 **/
EventsList.getPrograms = function () {
  this.checkedEventType.length != this.eventTypes.length ? this.checkedAllEventTypes = false : this.checkedAllEventTypes = true;

  let types = this.checkedAllEventTypes ? this.eventTypes.map(a => a.slug) : this.checkedEventType;
  let result;

  // update router based on selection
  if (this.checkedEventType.length == 0) {
    this.$router.push({ query: {} }).catch(err => { });
  } else {
    this.$router.push({
      query:
      {
        event_category: this.checkedEventType.length < this.eventTypes.length ? this.checkedEventType : 'all',
      }
    }).catch(err => { });
  }

  // filter
  if (this.checkedEventType.length > 0) {
    result = this.postsAll.filter(function (e) {
      return e.categories.find(x => types.includes(x.slug));
    });
  } else {
    result = this.postsAll
  }
  this.posts = result.slice(0, 4);


  if (this.posts.length == 0) {
    this.errorMsg = true;
    this.isLoading = false;
    this.maxPages = 1;

  } else {
    this.errorMsg = false;
    this.isLoading = false;
    this.totalResults = this.posts.length;
    if ((this.posts.length < this.postsAll.length) && (result.length != this.posts.length)) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }
}

EventsList.generateFilterURL = function (data) {
  let filters = [];
  let arrIds = [];

  // event types
  if (data.checkedEventType.length > 0) {
    data.checkedEventType.length != data.eventTypes.length ? data.checkedAllEventTypes = false : data.checkedAllEventTypes = true;
    arrIds = EventsList.getIds(data.eventTypes, data.checkedEventType).map(value => value.id)
    filters.push('categories=' + arrIds.join('&categories='));
  }

  // age groups
  if (data.checkedAgeGroup.length > 0) {
    data.checkedAgeGroup.length != data.ageGroups.length ? data.checkedAllAges = false : data.checkedAllAges = true;
    arrIds = EventsList.getIds(data.ageGroups, data.checkedAgeGroup, data.posttype).map(value => value.id)
    filters.push('age_group[]=' + arrIds.join('&age_group[]='));
  }

  if (data.programPage > 1) {
    filters.push('page=' + data.programPage);
  }

  filters = filters.join('&');

  return filters;
}


EventsList.getTaxonomies = function () {

  // age groups
  let ageGroups = _.uniq([].concat.apply([], this.postsAll.map(a => a.age_group)), function (x) {
    return x.name;
  });

  this.ageGroups = ageGroups.sort((a, b) => a.description.localeCompare(b.description))

  // tip types
  let types = _.uniq([].concat.apply([], this.postsAll.map(a => a.categories)), function (x) {
    return x.name;
  });

  this.eventTypes = types.sort((a, b) => a.name.localeCompare(b.name))

}

EventsList.parseQuery = function () {
  let query = this.$route.query;

  if (query.event_category == 'all') {
    this.checkedAllEventTypes = true;
    this.checkedEventType = this.eventTypes.map(a => a.slug);
  }
  else if (!_.isEmpty(query.event_category) && query.event_category != 'all') {
    this.checkedAllEventTypes = false;
    if (_.isArray(query.event_category)) {
      if (query.event_category.every((val, i, arr) => val === arr[0])) {
        query.event_category = query.event_category[0];
      } else {
        this.checkedEventType = query.event_category
      }
    } else {
      let index = this.eventTypes.map(function (e) { return e.slug; }).indexOf(query.event_category);
      this.checkedEventType.push(this.eventTypes[index].slug);
    }
  }

}

EventsList.selectAllEventTypes = function () {
  if (this.checkedAllEventTypes) {
    this.checkedEventType = this.eventTypes.map(a => a.slug);
  } else {
    this.checkedEventType = [];
  }
}

EventsList.loadMore = function () {
  let types = this.checkedAllEventTypes ? this.eventTypes.map(a => a.slug) : this.checkedEventType;

  if (this.checkedEventType.length > 1) {
    let result = this.postsAll.filter(function (e) {
      return e.categories.find(x => types.includes(x.slug));
    });
    this.posts = this.posts.concat(result.slice(this.posts.length, 6 + this.posts.length));
    if (result.length == this.posts.length) {
      this.showButton = false;
    } else {
      this.showButton = true;
    }
  } else {
    this.posts = this.posts.concat(this.postsAll.slice(this.posts.length, 6 + this.posts.length))
    if (this.posts.length == this.postsAll.length) {
      this.showButton = false;
    } else {
      this.showButton = true;
    }
  }
}

/**
 * Filters events that are just teen and young adult
 */
EventsList.filterPosts = function (events) {
  let result;
  let ages = this.checkedAgeGroup

  if (document.documentElement.lang != 'en'){
    result = events;
  }else {
    result = events.filter(function (e) {
      return e.age_group.find(x => ages.includes(x.slug));
    });
  }
  // dedup events that are recurring
  let collapsedResults = result.filter((event, index, self) =>
    index === self.findIndex((t) => (
      t.title === event.title && t.date_formatted.time === event.date_formatted.time
    ))
  )
  this.postsAll = collapsedResults;
}

export default EventsList;