'use strict';

import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';
import router from './router'

class Afterschool {

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
        checkedAllTypes: false,
        ageGroupURL: this._baseURL + this._posttype + '_age_group' + this._lang,
        ageGroups: null,
        checkedAgeGroup: [],
        checkedAllAges: false,
        boroughURL: this._baseURL + 'borough' + this._lang,
        boroughNames: null,
        checkedBorough: [],
        checkedAllBoroughs: false,
        afterschoolTypeURL: this._baseURL + 'afterschool_programs_cat' + this._lang,
        afterschoolTypes: null,
        checkedAfterschoolType: [],
        checkedAllAfterschoolTypes: false,
        programPage: 1,
        currentPage: 1,
        maxPages: 1,
        errorMsg: false,
        isLoading: true,
        totalResults: '',
      },
      watch: {
        checkedProgramType: 'getPrograms',
        checkedAgeGroup: 'getPrograms',
        checkedBorough: 'getPrograms',
        programPage: 'getPrograms',
        checkedAfterschoolType: 'getPrograms',
      },
      mounted: function () {
        axios.all([
          axios.get(this.ageGroupURL),
          axios.get(this.boroughURL),
          axios.get(this.afterschoolTypeURL),
        ])
          .then(axios.spread((ageResponse, boroughResponse, afterschoolResponse) => {
            this.ageGroups = ageResponse.data;
            this.boroughNames = boroughResponse.data;
            this.afterschoolTypes = afterschoolResponse.data;
            this.parseQuery();
            this.getPrograms();
          }));
      },
      methods: {
        getPrograms: Afterschool.getPrograms,
        generateFilterURL: Afterschool.generateFilterURL,
        parseQuery: Afterschool.parseQuery,
        getIds: Afterschool.getIds,
        showLoader: Afterschool.showLoader,
        hideLoader: Afterschool.hideLoader,
        scrollToTop() {
          window.scrollTo(0, 0);
        },
        selectAllAges: Afterschool.selectAllAges,
        selectAllAfterschoolTypes: Afterschool.selectAllAfterschoolTypes,
        selectAllBoroughs: Afterschool.selectAllBoroughs,
        mobileScroll: Afterschool.mobileScroll,
        loadMore: Afterschool.loadMore
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
Afterschool.getPrograms = function () {
  let url = this.programsURL;
  Afterschool.showLoader(this, this.programs)

  let filters = Afterschool.generateFilterURL(this);
  url = url + '&orderby=menu_order&order=asc' + '&' + filters;

  // update the query
  if (this.programPage == 1) {
    this.$router.push({
      query:
      {
        afterschool_category: this.checkedAfterschoolType.length < this.afterschoolTypes.length ? this.checkedAfterschoolType : 'all',
        ages: this.checkedAgeGroup.length < this.ageGroups.length ? this.checkedAgeGroup : 'all',
        boroughs: this.checkedBorough.length < this.boroughNames.length ? this.checkedBorough : 'all'
      }
    });
  } else {
    this.$router.push({ query: { afterschool_category: this.checkedAfterschoolType, ages: this.checkedAgeGroup, boroughs: this.checkedBorough, page: this.programPage } });
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
        Afterschool.hideLoader(this.$el, this.programs);
      } else {
        this.maxPages = response.headers['x-wp-totalpages'];
        this.totalResults = response.headers['x-wp-total'];
        this.errorMsg = false;
        this.isLoading = false;
        Afterschool.hideLoader(this.$el, this.programs);
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
Afterschool.generateFilterURL = function (data) {
  let filters = [];
  let arrIds = [];

  if (data.checkedAgeGroup.length > 0) {
    data.checkedAgeGroup.length != data.ageGroups.length ? data.checkedAllAges = false : data.checkedAllAges = true;
    arrIds = Afterschool.getIds(data.ageGroups, data.checkedAgeGroup, data.posttype).map(value => value.term_id)
    filters.push('age_group[]=' + arrIds.join('&age_group[]='));
  }

  if (data.checkedAfterschoolType.length > 0) {
    data.checkedAfterschoolType.length != data.afterschoolTypes.length ? data.checkedAllAfterschoolTypes = false : data.checkedAllAfterschoolTypes = true;
    arrIds = Afterschool.getIds(data.afterschoolTypes, data.checkedAfterschoolType).map(value => value.term_id)
    filters.push('afterschool_programs_cat[]=' + arrIds.join('&afterschool_programs_cat[]='));
  }

  if (data.checkedBorough.length > 0) {
    data.checkedBorough.length != data.boroughNames.length ? data.checkedAllBoroughs = false : data.checkedAllBoroughs = true;
    arrIds = Afterschool.getIds(data.boroughNames, data.checkedBorough).map(value => value.id)
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
Afterschool.parseQuery = function () {
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
        queryArr = Afterschool.getIds(this.ageGroups, query.ages.map(String));
        this.checkedAgeGroup = queryArr.map(value => value.slug)
      }
    } else {
      let index = this.ageGroups.map(function (e) { return e.slug; }).indexOf(query.ages);
      this.checkedAgeGroup.push(this.ageGroups[index].slug);
    }
  }

  if (query.afterschool_category == 'all') {
    this.checkedAllAfterschoolTypes = true;
    this.checkedAfterschoolType = this.afterschoolTypes.map(a => a.slug);
  }
  if (!_.isEmpty(query.afterschool_category) && query.afterschool_category != 'all') {
    this.checkedAllAfterschoolTypes = false;
    if (_.isArray(query.afterschool_category)) {
      if (query.afterschool_category.every((val, i, arr) => val === arr[0])) {
        query.afterschool_category = query.afterschool_category[0];
      } else {
        queryArr = Afterschool.getIds(this.afterschoolTypes, query.afterschool_category.map(String));
        this.checkedAfterschoolType = queryArr.map(value => value.slug)
      }
    } else {
      let index = this.afterschoolTypes.map(function (e) { return e.slug; }).indexOf(query.afterschool_category);
      this.checkedAfterschoolType.push(this.afterschoolTypes[index].slug);
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
        queryArr = Afterschool.getIds(this.boroughNames, query.boroughs.map(String));
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
Afterschool.getIds = function (filter, slugs, posttype) {
  let arrIds = [];

  slugs.forEach(function (slug) {
    let index = filter.map(function (e) { return e.slug; }).indexOf(slug);
    if (filter[index].id) {
      arrIds.push(filter[index])
    } else {
      arrIds.push(filter[index])
    }
  });

  let everyoneIndex = filter.map(function (e) { return e.slug; }).indexOf('everyone');
  if ((everyoneIndex > 0 && posttype == 'afterschool-guide')) {
    arrIds.push(filter[everyoneIndex])
  }

  return arrIds;
}

/**
 * Shows the loader
 * @param {HTMLElement} - vue element
 * @param {array} - array of programs
 **/
Afterschool.showLoader = function (obj, programs) {
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
Afterschool.hideLoader = function (el, status) {
  $(el).find('.loader').hide();
  $(el).find('.pagination').show();
}

/**
 * Toggle the select all for filters
 **/
Afterschool.selectAllAges = function () {
  if (this.checkedAllAges) {
    this.checkedAgeGroup = this.ageGroups.map(a => a.slug);
  } else {
    this.checkedAgeGroup = [];
  }
}

Afterschool.selectAllAfterschoolTypes = function () {
  if (this.checkedAllAfterschoolTypes) {
    this.checkedAfterschoolType = this.afterschoolTypes.map(a => a.slug);
  } else {
    this.checkedAfterschoolType = [];
  }
}

Afterschool.selectAllBoroughs = function () {
  if (this.checkedAllBoroughs) {
    this.checkedBorough = this.boroughNames.map(a => a.slug);
  } else {
    this.checkedBorough = [];
  }
}

/**
 * Toogles filter jump button on mobile
 **/
Afterschool.mobileScroll = function () {
  if (
    this.checkedAgeGroup.length > 0 ||
    this.checkedAfterschoolType.length > 0 ||
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


export default Afterschool;