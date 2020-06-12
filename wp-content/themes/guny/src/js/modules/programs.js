'use strict';

import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';
import router from './router'

class Programs {

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
        programTypeURL: this._baseURL + 'programs_cat' + this._lang,
        programTypes: null,
        checkedProgramType: [],
        checkedAllTypes: false,
        ageGroupURL: this._baseURL + this._posttype + '_age_group' + this._lang,
        ageGroups: null,
        checkedAgeGroup: [],
        checkedAllAges: false,
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
        programPage: 'getPrograms',
      },
      mounted: function () {
        axios.all([
          axios.get(this.programTypeURL),
          axios.get(this.ageGroupURL),
        ])
          .then(axios.spread((catResponse, ageResponse) => {
            this.programTypes = catResponse.data;
            this.ageGroups = ageResponse.data;
            this.parseQuery();
            this.getPrograms();
          }));
      },
      methods: {
        getPrograms: Programs.getPrograms,
        generateFilterURL: Programs.generateFilterURL,
        parseQuery: Programs.parseQuery,
        getIds: Programs.getIds,
        showLoader: Programs.showLoader,
        hideLoader: Programs.hideLoader,
        scrollToTop() {
          window.scrollTo(0, 0);
        },
        selectAllTypes: Programs.selectAllTypes,
        selectAllAges: Programs.selectAllAges,
        mobileScroll: Programs.mobileScroll,
        loadMore: Programs.loadMore
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
Programs.getPrograms = function () {
  let url = this.programsURL;
  Programs.showLoader(this, this.programs)

  let filters = Programs.generateFilterURL(this);
  url = url + '&orderby=menu_order&order=asc' + '&' + filters;

  // update the query
  if (this.programPage == 1) {
    this.$router.push({
      query:
      {
        category: this.checkedProgramType.length < this.programTypes.length ? this.checkedProgramType : 'all',
        ages: this.checkedAgeGroup.length < this.ageGroups.length ? this.checkedAgeGroup : 'all',
      }
    });
  } else {
    this.$router.push({ query: { category: this.checkedProgramType, ages: this.checkedAgeGroup, page: this.programPage } });
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
        Programs.hideLoader(this.$el, this.programs);
      } else {
        this.maxPages = response.headers['x-wp-totalpages'];
        this.totalResults = response.headers['x-wp-total'];
        this.errorMsg = false;
        this.isLoading = false;
        Programs.hideLoader(this.$el, this.programs);
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
Programs.generateFilterURL = function (data) {
  let filters = [];
  let arrIds = [];

  if (data.checkedProgramType.length > 0) {
    data.checkedProgramType.length != data.programTypes.length ? data.checkedAllTypes = false : data.checkedAllTypes = true;
    arrIds = Programs.getIds(data.programTypes, data.checkedProgramType).map(value => value.term_id)
    filters.push('programs_cat[]=' + arrIds.join('&programs_cat[]='));
  }

  if (data.checkedAgeGroup.length > 0) {
    data.checkedAgeGroup.length != data.ageGroups.length ? data.checkedAllAges = false : data.checkedAllAges = true;
    arrIds = Programs.getIds(data.ageGroups, data.checkedAgeGroup, data.posttype).map(value => value.term_id)
    filters.push('age_group[]=' + arrIds.join('&age_group[]='));
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
Programs.parseQuery = function () {
  let query = this.$route.query;
  let queryArr = [];

  if (query.category == 'all') {
    this.checkedAllTypes = true;
    this.checkedProgramType = this.programTypes.map(a => a.slug);
  }
  if (!_.isEmpty(query.category) && query.category != 'all') {
    this.checkedAllTypes = false;
    if (_.isArray(query.category)) {
      if (query.category.every((val, i, arr) => val === arr[0])) {
        query.category = query.category[0];
      } else {
        queryArr = Programs.getIds(this.programTypes, query.category.map(String));
        this.checkedProgramType = queryArr.map(value => value.slug)
      }
    } else {
      let index = this.programTypes.map(function (e) { return e.slug; }).indexOf(query.category);
      this.checkedProgramType.push(this.programTypes[index].slug);
    }
  }

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
        queryArr = Programs.getIds(this.ageGroups, query.ages.map(String));
        this.checkedAgeGroup = queryArr.map(value => value.slug)
      }
    } else {
      let index = this.ageGroups.map(function (e) { return e.slug; }).indexOf(query.ages);
      this.checkedAgeGroup.push(this.ageGroups[index].slug);
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
Programs.getIds = function (filter, slugs) {
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
Programs.showLoader = function (obj, programs) {
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
    if (obj.checkedProgramType.length > 0 || obj.checkedAgeGroup.length > 0) {
      $('.c-alert__banner').hide();
      $(el).find('.loader-mobile').fadeIn();
    }
  }
}

/**
 * Hides the loader
 * @param {HTMLElement} - vue element
 **/
Programs.hideLoader = function (el, status) {
  $(el).find('.loader').hide();
  $(el).find('.pagination').show();
}

/**
 * Toggle the select all for filters
 **/
Programs.selectAllTypes = function () {
  if (this.checkedAllTypes) {
    this.checkedProgramType = this.programTypes.map(a => a.slug);
  } else {
    this.checkedProgramType = [];
  }
}

Programs.selectAllAges = function () {
  if (this.checkedAllAges) {
    this.checkedAgeGroup = this.ageGroups.map(a => a.slug);
  } else {
    this.checkedAgeGroup = [];
  }
}

/**
 * Toogles filter jump button on mobile
 **/
Programs.mobileScroll = function () {
  if (this.checkedProgramType.length > 0 ||
    this.checkedAgeGroup.length > 0
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

export default Programs;


