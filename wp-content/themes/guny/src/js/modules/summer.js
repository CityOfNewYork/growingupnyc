'use strict';

import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';
import router from './router'

class Summer {

  constructor() {
    this._baseURL = window.location.origin + '/wp-json/wp/v2/';
    this._lang = '?lang=' + document.documentElement.lang;
    this._el = '#' + $('div').find('[id^=vue]').attr('id');
    this._posttype = this._el.replace(new RegExp("^" + '#vue-'), '')

    this._programs = {
      delimiters: ['v{', '}'],
      el: this._el,
      router,
      data: {
        posttype: this._posttype,
        programsURL: this._baseURL + this._posttype + this._lang,
        programs: null,
        ageGroupURL: this._baseURL + this._posttype + '_age_group' + this._lang,
        ageGroups: null,
        checkedAgeGroup: [],
        checkedAllAges: false,
        boroughURL: this._baseURL + 'borough' + this._lang,
        boroughNames: null,
        checkedBorough: [],
        checkedAllBoroughs: false,
        summerTypeURL: this._baseURL + 'summer_programs_cat' + this._lang,
        summerTypes: null,
        checkedSummerType: [],
        checkedAllSummerTypes: false,
        activityTypeURL: this._baseURL + 'activity_type' + this._lang,
        activityTypes: null,
        checkedActivityType: [],
        checkedAllActivityTypes: false,
        checkedActivityType: [],
        checkedAllActivityTypes: false,
        programPage: 1,
        currentPage: 1,
        maxPages: 1,
        errorMsg: false,
        isLoading: true,
        totalResults: '',
      },
      watch: {
        checkedAgeGroup: 'getPrograms',
        checkedBorough: 'getPrograms',
        programPage: 'getPrograms',
        checkedSummerType: 'getPrograms',
        checkedActivityType: 'getPrograms',
      },
      mounted: function () {
        axios.all([
          axios.get(this.ageGroupURL),
          axios.get(this.boroughURL),
          axios.get(this.summerTypeURL),
          axios.get(this.activityTypeURL),
        ])
          .then(axios.spread((ageResponse, boroughResponse, summerResponse, activityResponse) => {
            this.ageGroups = ageResponse.data;
            this.boroughNames = boroughResponse.data;
            this.summerTypes = summerResponse.data;
            this.activityTypes = activityResponse.data;
            this.parseQuery();
            this.getPrograms();
          }));
      },
      methods: {
        getPrograms: Summer.getPrograms,
        generateFilterURL: Summer.generateFilterURL,
        parseQuery: Summer.parseQuery,
        getIds: Summer.getIds,
        showLoader: Summer.showLoader,
        hideLoader: Summer.hideLoader,
        scrollToTop() {
          window.scrollTo(0, 0);
        },
        selectAllAges: Summer.selectAllAges,
        selectAllActivityTypes: Summer.selectAllActivityTypes,
        selectAllSummerTypes: Summer.selectAllSummerTypes,
        selectAllBoroughs: Summer.selectAllBoroughs,
        mobileScroll: Summer.mobileScroll,
        loadMore: Summer.loadMore
      },
      created() {
        window.addEventListener('scroll', this.mobileScroll);
      }
    }
  }

  /**
   * Initialize
   **/
  init() {
    this._programs = new Vue(this._programs);


    $(window).on('resize', function () {
      if ($(window).width() >= 1024) {
        $('.loader-mobile').hide();
      }
    });
  }
}

/**
 * Request to get the programs and update router
 **/
Summer.getPrograms = function () {
  let url = this.programsURL;
  Summer.showLoader(this, this.programs)

  let filters = Summer.generateFilterURL(this);
  url = url + '&orderby=menu_order&order=asc' + '&' + filters;

  // update the query
  if (this.programPage == 1) {
    this.$router.push({
      query:
      {
        ages: this.checkedAgeGroup.length < this.ageGroups.length ? this.checkedAgeGroup : 'all',
        interests: this.checkedSummerType.length < this.summerTypes.length ? this.checkedSummerType : 'all',
        activity_types: this.checkedActivityType.length < this.activityTypes.length ? this.checkedActivityType : 'all',
        boroughs: this.checkedBorough.length < this.boroughNames.length ? this.checkedBorough : 'all'
      }
    });
  } else {
    this.$router.push({ query: { ages: this.checkedAgeGroup, activity_types: this.checkedActivityType, interests: this.checkedSummerType, boroughs: this.checkedBorough, page: this.programPage } });
  }

  this.currentPage = 1;

  axios
    .get(url)
    .then(response => {
      this.programs = response.data
      if (this.programs.length == 0) {
        this.errorMsg = true;
        this.isLoading = false;
        this.maxPages = 1;
        Summer.hideLoader(this.$el, this.programs);
      } else {
        this.maxPages = response.headers['x-wp-totalpages'];
        this.totalResults = response.headers['x-wp-total'];
        this.errorMsg = false;
        this.isLoading = false;
        Summer.hideLoader(this.$el, this.programs);
      }
    })
    .catch(error => {
      this.programPage = 1;
    });
}

/**
 * Generate the string filter for all user chosen taxonomies
 * @param {obj} - data object
 * @return {string} - string of all filters
 **/
Summer.generateFilterURL = function (data) {
  let filters = [];
  let arrIds = [];

  if (data.checkedAgeGroup.length > 0) {
    data.checkedAgeGroup.length != data.ageGroups.length ? data.checkedAllAges = false : data.checkedAllAges = true;
    arrIds = Summer.getIds(data.ageGroups, data.checkedAgeGroup, data.posttype).map(value => value.term_id)
    filters.push('age_group[]=' + arrIds.join('&age_group[]='));
  }

  if (data.checkedSummerType.length > 0) {
    data.checkedSummerType.length != data.summerTypes.length ? data.checkedAllSummerTypes = false : data.checkedAllSummerTypes = true;
    arrIds = Summer.getIds(data.summerTypes, data.checkedSummerType).map(value => value.term_id)
    filters.push('summer_programs_cat[]=' + arrIds.join('&summer_programs_cat[]='));
  }

  if (data.checkedActivityType.length > 0) {
    data.checkedActivityType.length != data.activityTypes.length ? data.checkedAllActivityTypes = false : data.checkedAllActivityTypes = true;
    arrIds = Summer.getIds(data.activityTypes, data.checkedActivityType).map(value => value.term_id)
    filters.push('activity_type[]=' + arrIds.join('&activity_type[]='));
  }

  if (data.checkedBorough.length > 0) {
    data.checkedBorough.length != data.boroughNames.length ? data.checkedAllBoroughs = false : data.checkedAllBoroughs = true;
    arrIds = Summer.getIds(data.boroughNames, data.checkedBorough).map(value => value.id)
    filters.push('borough[]=' + arrIds.join('&borough[]='));
  }

  if (data.programPage > 1) {
    filters.push('page=' + data.programPage);
  }

  filters = filters.join('&');

  return filters;
}
/**
 * Extracts the taxonomies from the url query
 * and updates the program type and age group arrays 
 **/
Summer.parseQuery = function () {
  let query = this.$route.query;
  let queryArr = [];

  if (query.ages == 'all') {
    this.checkedAllAges = true;
    this.checkedAgeGroup = this.ageGroups.map(a => a.slug);
  }
  if (!_.isEmpty(query.ages) && query.ages != 'all') {
    this.checkedAllAges = false;
    if (_.isArray(query.ages)) {
      if (query.ages.every((val, i, arr) => val === arr[0])) {
        query.ages = query.ages[0];
      } else {
        queryArr = Summer.getIds(this.ageGroups, query.ages.map(String));
        this.checkedAgeGroup = queryArr.map(value => value.slug)
      }
    } else {
      let index = this.ageGroups.map(function (e) { return e.slug; }).indexOf(query.ages);
      this.checkedAgeGroup.push(this.ageGroups[index].slug);
    }
  }

  if (query.interests == 'all') {
    this.checkedAllSummerTypes = true;
    this.checkedSummerType = this.summerTypes.map(a => a.slug);
  }
  if (!_.isEmpty(query.interests) && query.interests != 'all') {
    this.checkedAllSummerTypes = false;
    if (_.isArray(query.interests)) {
      if (query.interests.every((val, i, arr) => val === arr[0])) {
        query.interests = query.interests[0];
      } else {
        queryArr = Summer.getIds(this.summerTypes, query.interests.map(String));
        this.checkedSummerType = queryArr.map(value => value.slug)
      }
    } else {
      let index = this.summerTypes.map(function (e) { return e.slug; }).indexOf(query.interests);
      this.checkedSummerType.push(this.summerTypes[index].slug);
    }
  }

  if (query.activity_types == 'all') {
    this.checkedAllActivityTypes = true;
    this.checkedActivityType = this.activityTypes.map(a => a.slug);
  }
  if (!_.isEmpty(query.activity_types) && query.activity_types != 'all') {
    this.checkedAllActivityTypes = false;
    if (_.isArray(query.activity_types)) {
      if (query.activity_types.every((val, i, arr) => val === arr[0])) {
        query.activity_types = query.activity_types[0];
      } else {
        queryArr = Summer.getIds(this.activityTypes, query.activity_types.map(String));
        this.checkedActivityType = queryArr.map(value => value.slug)
      }
    } else {
      let index = this.activityTypes.map(function (e) { return e.slug; }).indexOf(query.activity_types);
      this.checkedActivityType.push(this.activityTypes[index].slug);
    }
  }

  if (query.boroughs == 'all') {
    this.checkedAllBoroughs = true;
    this.checkedBorough = this.boroughNames.map(a => a.slug);
  }
  if (!_.isEmpty(query.boroughs)) {
    if (_.isArray(query.boroughs)) {
      if (query.boroughs.every((val, i, arr) => val === arr[0])) {
        query.boroughs = query.boroughs[0];
      } else {
        queryArr = Summer.getIds(this.boroughNames, query.boroughs.map(String));
        this.checkedBorough = queryArr.map(value => value.slug)
      }
    } else {
      let index = this.boroughNames.map(function (e) { return e.slug; }).indexOf(query.boroughs);
      this.checkedBorough.push(this.boroughNames[index].slug);
    }
  }

  if (query.page) {
    this.programPage = query.page;
  }

}

/**
 * Gets the id of the slug
 * @param {array} - array of objects containing the category keys
 * @param {array} - array of slugs
 **/
Summer.getIds = function (filter, slugs) {
  let arrIds = [];

  slugs.forEach(function (slug) {
    let index = filter.map(function (e) { return e.slug; }).indexOf(slug);
    if (filter[index].id) {
      arrIds.push(filter[index])
    } else {
      arrIds.push(filter[index])
    }
  });

  return arrIds;
}

/**
 * Shows the loader
 * @param {HTMLElement} - vue element
 * @param {array} - array of programs
 **/
Summer.showLoader = function (obj, programs) {
  let el = obj.$el;
  let sh = $(el).find('.o-article-sidebar').height();

  if ($(window).width() >= 1024) {
    if (programs == null) {
      $(el).find('.loader').css({ 'height': sh }).addClass('animated pulse');
    } else {
      $(el).find('.loader').css({ 'height': '100%' }).removeClass('animated pulse');
    }
    $(el).find('.pagination').hide();
    $(el).find('.loader').show();
  } else {
    $(el).find('.loader').hide();
    if (obj.checkedAgeGroup.length > 0) {
      $('.c-alert__banner').hide();
      $(el).find('.loader-mobile').fadeIn();
    }
  }
}

/**
 * Hides the loader
 * @param {HTMLElement} - vue element
 **/
Summer.hideLoader = function (el, status) {
  $(el).find('.loader').hide();
  $(el).find('.pagination').show();
}

/**
 * Toggle the select all for filters
 **/
Summer.selectAllAges = function () {
  if (this.checkedAllAges) {
    this.checkedAgeGroup = this.ageGroups.map(a => a.slug);
  } else {
    this.checkedAgeGroup = [];
  }
}

Summer.selectAllActivityTypes = function () {
  if (this.checkedAllActivityTypes) {
    this.checkedActivityType = this.activityTypes.map(a => a.slug);
  } else {
    this.checkedActivityType = [];
  }
}

Summer.selectAllSummerTypes = function () {
  if (this.checkedAllSummerTypes) {
    this.checkedSummerType = this.summerTypes.map(a => a.slug);
  } else {
    this.checkedSummerType = [];
  }
}

Summer.selectAllBoroughs = function () {
  if (this.checkedAllBoroughs) {
    this.checkedBorough = this.boroughNames.map(a => a.slug);
  } else {
    this.checkedBorough = [];
  }
}

/**
 * Toogles filter jump button on mobile
 **/
Summer.mobileScroll = function () {
  if (
    this.checkedAgeGroup.length > 0 ||
    this.checkedSummerType.length > 0 ||
    this.checkedActivityType.length > 0 ||
    this.checkedBorough.length > 0
  ) {
    let ww = $(window).scrollTop()
    if ($('#programs-loaded').length) {
      let cw = $('#programs-loaded').offset().top;
      if ($(window).width() < 1024) {
        if (ww >= cw - 50) {
          $('.loader-mobile').fadeOut();
        } else {
          $('.loader-mobile').fadeIn();
        }
      } else {
        $('.loader-mobile').fadeOut();
      }
    }
  } else {
    $('.loader-mobile').fadeOut();
  }
}


export default Summer;


