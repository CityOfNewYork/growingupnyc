'use strict';

import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';
import router from './router'

class ProgramsList {

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
        boroughURL: this._baseURL + 'borough' + this._lang,
        boroughNames: null,
        checkedBorough: [],
        checkedAllBoroughs: false,
        afterschoolTypeURL: this._baseURL + 'afterschool_programs_cat' + this._lang,
        afterschoolTypes: null,
        checkedAfterschoolType: [],
        checkedAllAfterschoolTypes: false,
        summerTypeURL: this._baseURL + 'summer_programs_cat' + this._lang,
        summerTypes: null,
        checkedSummerType: [],
        checkedAllSummerTypes: false,
        activityTypeURL: this._baseURL + 'activity_type' + this._lang,
        activityTypes: null,
        checkedActivityType: [],
        checkedAllActivityTypes: false,
        programPage: 1,
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
        checkedSummerType: 'getPrograms',
        checkedActivityType: 'getPrograms',
      },
      mounted: function() {
        axios.all([
          axios.get(this.programTypeURL),
          axios.get(this.ageGroupURL),
          axios.get(this.boroughURL),
          axios.get(this.afterschoolTypeURL),
          axios.get(this.summerTypeURL),
          axios.get(this.activityTypeURL)
          ])
          .then(axios.spread((catResponse, ageResponse, boroughResponse, afterschoolResponse, summerResponse, activityResponse) => {
            this.programTypes = catResponse.data;
            this.ageGroups = ageResponse.data;
            this.boroughNames = boroughResponse.data;
            this.afterschoolTypes = afterschoolResponse.data;
            this.summerTypes = summerResponse.data;
            this.activityTypes = activityResponse.data;
            this.parseQuery();
            this.getPrograms();
          }));
      },
      methods: {
        getPrograms: ProgramsList.getPrograms,
        generateFilterURL: ProgramsList.generateFilterURL,
        parseQuery: ProgramsList.parseQuery,
        getIds: ProgramsList.getIds,
        showLoader: ProgramsList.showLoader,
        hideLoader: ProgramsList.hideLoader,
        scrollToTop() {
          window.scrollTo(0,0);
        },
        selectAllTypes: ProgramsList.selectAllTypes,
        selectAllAges: ProgramsList.selectAllAges,
        selectAllAfterschoolTypes: ProgramsList.selectAllAfterschoolTypes,
        selectAllActivityTypes: ProgramsList.selectAllActivityTypes,
        selectAllSummerTypes: ProgramsList.selectAllSummerTypes,
        selectAllBoroughs: ProgramsList.selectAllBoroughs,
        mobileScroll: ProgramsList.mobileScroll
      },
      created () {
        window.addEventListener('scroll', this.mobileScroll);
      }
    }
  }

  /**
   * Initialize
   **/
  init() {
    this._programs = new Vue(this._programs);


    $(window).on('resize', function(){
      if($(window).width() >=1024){
        $('.loader-mobile').hide();
      }
    });
  }
}
/**
 * Request to get the programs and update router
 **/
ProgramsList.getPrograms = function() {
  let url = this.programsURL;
  ProgramsList.showLoader(this, this.programs)

  let filters = ProgramsList.generateFilterURL(this);
  url = url + '&' + filters;

  // update the query
  if ( this.programPage == 1){
    this.$router.push({query: 
      {
        category: this.checkedProgramType.length < this.programTypes.length ? this.checkedProgramType : 'all', 
        ages: this.checkedAgeGroup.length < this.ageGroups.length ? this.checkedAgeGroup : 'all', 
        afterschool_category: this.checkedAfterschoolType.length < this.afterschoolTypes.length ? this.checkedAfterschoolType : 'all', 
        interests: this.checkedSummerType.length < this.summerTypes.length ? this.checkedSummerType : 'all', 
        activity_types: this.checkedActivityType.length < this.activityTypes.length ? this.checkedActivityType : 'all', 
        boroughs: this.checkedBorough.length < this.boroughNames.length ? this.checkedBorough : 'all'
      }
    });
  }else {
    this.$router.push({query: {category: this.checkedProgramType, ages: this.checkedAgeGroup, afterschool_category: this.checkedAfterschoolType, interests: this.checkedSummerType, boroughs: this.checkedBorough, page: this.programPage }});
  }

  axios
    .get(url)
    .then(response => {
      this.programs = response.data
      if (this.programs.length == 0) {
        this.errorMsg = true;
        this.isLoading = false;
        this.maxPages = 1;
        ProgramsList.hideLoader(this.$el, this.programs);
      } else {
        this.maxPages = response.headers['x-wp-totalpages'];
        this.totalResults = response.headers['x-wp-total'];
        this.errorMsg = false;
        this.isLoading = false;
        ProgramsList.hideLoader(this.$el, this.programs);
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
ProgramsList.generateFilterURL = function(data) {
  let filters = [];
  let arrIds = [];

  if ( data.checkedProgramType.length > 0 ){
    data.checkedProgramType.length != data.programTypes.length ? data.checkedAllTypes = false : data.checkedAllTypes = true;
    arrIds = ProgramsList.getIds(data.programTypes, data.checkedProgramType).map(value => value.term_id)
    filters.push('programs_cat[]=' + arrIds.join('&programs_cat[]='));
  }

  if ( data.checkedAgeGroup.length > 0  ) {
    data.checkedAgeGroup.length != data.ageGroups.length ? data.checkedAllAges = false : data.checkedAllAges = true;
    arrIds = ProgramsList.getIds(data.ageGroups, data.checkedAgeGroup, data.posttype).map(value => value.term_id)
    filters.push('age_group[]=' + arrIds.join('&age_group[]='));
  }

  if ( data.checkedAfterschoolType.length > 0  ) {
    data.checkedAfterschoolType.length != data.afterschoolTypes.length ? data.checkedAllAfterschoolTypes = false : data.checkedAllAfterschoolTypes = true;
    arrIds = ProgramsList.getIds(data.afterschoolTypes, data.checkedAfterschoolType).map(value => value.term_id)
    filters.push('afterschool_programs_cat[]=' + arrIds.join('&afterschool_programs_cat[]='));
  }

  if ( data.checkedSummerType.length > 0  ) {
    data.checkedSummerType.length != data.summerTypes.length ? data.checkedAllSummerTypes = false : data.checkedAllSummerTypes = true;
    arrIds = ProgramsList.getIds(data.summerTypes, data.checkedSummerType).map(value => value.term_id)
    filters.push('summer_programs_cat[]=' + arrIds.join('&summer_programs_cat[]='));
  }

  if (data.checkedActivityType.length > 0) {
    data.checkedActivityType.length != data.activityTypes.length ? data.checkedAllActivityTypes = false : data.checkedAllActivityTypes = true;
    arrIds = ProgramsList.getIds(data.activityTypes, data.checkedActivityType).map(value => value.term_id)
    filters.push('activity_type[]=' + arrIds.join('&activity_type[]='));
  }

  if ( data.checkedBorough.length > 0  ) {
    data.checkedBorough.length != data.boroughNames.length ? data.checkedAllBoroughs = false : data.checkedAllBoroughs = true;
    arrIds = ProgramsList.getIds(data.boroughNames, data.checkedBorough).map(value => value.id)
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
ProgramsList.parseQuery = function() {
  let query =this.$route.query;
  let queryArr = [];

  if(query.category == 'all'){
    this.checkedAllTypes = true;
    this.checkedProgramType = this.programTypes.map(a => a.slug);
  }
  if(!_.isEmpty(query.category)  && query.category != 'all'){
    this.checkedAllTypes = false;
    if (_.isArray(query.category)){
      if (query.category.every( (val, i, arr) => val === arr[0] )){
        query.category = query.category[0];
      }else{
        queryArr=ProgramsList.getIds(this.programTypes, query.category.map(String));
        this.checkedProgramType = queryArr.map(value => value.slug)
      }
    }else{
      let index = this.programTypes.map(function(e) { return e.slug; }).indexOf(query.category);
      this.checkedProgramType.push(this.programTypes[index].slug);
    }
  }

  if(query.ages == 'all'){
    this.checkedAllAges = true;
    this.checkedAgeGroup = this.ageGroups.map(a => a.slug);
  }
  if(!_.isEmpty(query.ages) && query.ages != 'all'){
    this.checkedAllAges = false;
    if (_.isArray(query.ages)){
      if (query.ages.every( (val, i, arr) => val === arr[0] )) {
        query.ages = query.ages[0];
      } else {
        queryArr=ProgramsList.getIds(this.ageGroups, query.ages.map(String));
        this.checkedAgeGroup = queryArr.map(value => value.slug)
      }
    }else{
      let index = this.ageGroups.map(function(e) { return e.slug; }).indexOf(query.ages);
      this.checkedAgeGroup.push(this.ageGroups[index].slug);
    }
  }

  if(query.afterschool_category == 'all'){
    this.checkedAllAfterschoolTypes = true;
    this.checkedAfterschoolType = this.afterschoolTypes.map(a => a.slug);
  }
  if(!_.isEmpty(query.afterschool_category) && query.afterschool_category != 'all'){
    this.checkedAllAfterschoolTypes = false;
    if (_.isArray(query.afterschool_category)){
      if (query.afterschool_category.every( (val, i, arr) => val === arr[0] )) {
        query.afterschool_category = query.afterschool_category[0];
      } else {
        queryArr=ProgramsList.getIds(this.afterschoolTypes, query.afterschool_category.map(String));
        this.checkedAfterschoolType = queryArr.map(value => value.slug)
      }
    }else{
      let index = this.afterschoolTypes.map(function(e) { return e.slug; }).indexOf(query.afterschool_category);
      this.checkedAfterschoolType.push(this.afterschoolTypes[index].slug);
    }
  }

  if(query.interests == 'all'){
    this.checkedAllSummerTypes = true;
    this.checkedSummerType = this.summerTypes.map(a => a.slug);
  }
  if(!_.isEmpty(query.interests) && query.interests != 'all'){
    this.checkedAllSummerTypes = false;
    if (_.isArray(query.interests)){
      if (query.interests.every( (val, i, arr) => val === arr[0] )) {
        query.interests = query.interests[0];
      } else {
        queryArr=ProgramsList.getIds(this.summerTypes, query.interests.map(String));
        this.checkedSummerType = queryArr.map(value => value.slug)
      }
    }else{
      let index = this.summerTypes.map(function(e) { return e.slug; }).indexOf(query.interests);
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
        queryArr = ProgramsList.getIds(this.activityTypes, query.activity_types.map(String));
        this.checkedActivityType = queryArr.map(value => value.slug)
      }
    } else {
      let index = this.activityTypes.map(function (e) { return e.slug; }).indexOf(query.activity_types);
      this.checkedActivityType.push(this.activityTypes[index].slug);
    }
  }

  if(query.boroughs == 'all'){
    this.checkedAllBoroughs = true;
    this.checkedBorough = this.boroughNames.map(a => a.slug);
  }
  if(!_.isEmpty(query.boroughs)){
    if (_.isArray(query.boroughs)){
      if (query.boroughs.every( (val, i, arr) => val === arr[0] )) {
        query.boroughs = query.boroughs[0];
      } else {
        queryArr=ProgramsList.getIds(this.boroughNames, query.boroughs.map(String));
        this.checkedBorough = queryArr.map(value => value.slug)
      }
    }else{
      let index = this.boroughNames.map(function(e) { return e.slug; }).indexOf(query.boroughs);
      this.checkedBorough.push(this.boroughNames[index].slug);
    }
  }

  if(query.page) {
    this.programPage=query.page;
  }

}

/**
 * Gets the id of the slug
 * @param {array} - array of objects containing the category keys
 * @param {array} - array of slugs
 **/
ProgramsList.getIds = function(filter, slugs, posttype) {
  let arrIds = [];

  slugs.forEach(function(slug) {
    let index = filter.map(function(e) { return e.slug; }).indexOf(slug);
    if (filter[index].id) {
      arrIds.push(filter[index])
    }else {
      arrIds.push(filter[index])
    }
  });
  
  let everyone_index = filter.map(function (e) { return e.slug; }).indexOf('everyone');
  if (everyone_index > 0 && posttype =='afterschool-guide') {
    arrIds.push(filter[everyone_index])
  }
  
  return arrIds;
}

/**
 * Shows the loader
 * @param {HTMLElement} - vue element
 * @param {array} - array of programs
 **/
ProgramsList.showLoader = function(obj, programs){
  let el = obj.$el;
  let sh = $(el).find('.o-article-sidebar').height();

  if($(window).width() >= 1024){
    if (programs == null) {
      $(el).find('.loader').css({'height' : sh}).addClass('animated pulse');
    }else {
      $(el).find('.loader').css({'height' : '100%'}).removeClass('animated pulse');
    }
    $(el).find('.pagination').hide();
    $(el).find('.loader').show();
  }else{
    $(el).find('.loader').hide();
    if(obj.checkedProgramType.length > 0 || obj.checkedAgeGroup.length > 0){
      $('.c-alert__banner').hide();
      $(el).find('.loader-mobile').fadeIn();
    }
  }
}

/**
 * Hides the loader
 * @param {HTMLElement} - vue element
 **/
ProgramsList.hideLoader = function(el, status){
  $(el).find('.loader').hide();
  $(el).find('.pagination').show();
}

/**
 * Toggle the select all for filters
 **/
ProgramsList.selectAllTypes = function() {
  if(this.checkedAllTypes){
    this.checkedProgramType = this.programTypes.map(a => a.slug);
  }else {
    this.checkedProgramType = [];
  }
}

ProgramsList.selectAllAges = function() {
  if(this.checkedAllAges){
    this.checkedAgeGroup = this.ageGroups.map(a => a.slug);
  }else {
    this.checkedAgeGroup = [];
  }
}

ProgramsList.selectAllAfterschoolTypes = function() {
  if(this.checkedAllAfterschoolTypes){
    this.checkedAfterschoolType = this.afterschoolTypes.map(a => a.slug);
  }else {
    this.checkedAfterschoolType = [];
  }
}

ProgramsList.selectAllActivityTypes = function () {
  if (this.checkedAllActivityTypes) {
    this.checkedActivityType = this.activityTypes.map(a => a.slug);
  } else {
    this.checkedActivityType = [];
  }
}

ProgramsList.selectAllSummerTypes = function() {
  if(this.checkedAllSummerTypes){
    this.checkedSummerType = this.summerTypes.map(a => a.slug);
  }else {
    this.checkedSummerType = [];
  }
}

ProgramsList.selectAllBoroughs = function() {  
  if(this.checkedAllBoroughs){
    this.checkedBorough = this.boroughNames.map(a => a.slug);
  }else {
    this.checkedBorough = [];
  }
}

/**
 * Toogles filter jump button on mobile
 **/
ProgramsList.mobileScroll = function() {  
  if(this.checkedProgramType.length > 0 || 
     this.checkedAgeGroup.length > 0 ||
     this.checkedAfterschoolType.length > 0 ||
     this.checkedSummerType.length > 0 ||
     this.checkedActivityType.length > 0 ||
     this.checkedBorough.length > 0
  ){
    let ww = $(window).scrollTop()
    if($('#programs-loaded').length){
      let cw = $('#programs-loaded').offset().top;
      if( $(window).width() < 1024 ){
        if(ww >= cw-50){
          $('.loader-mobile').fadeOut();
        }else{
          $('.loader-mobile').fadeIn();
        }
      }else{
        $('.loader-mobile').fadeOut();
      }
    }
  }else{
    $('.loader-mobile').fadeOut();
  }
}

export default ProgramsList;


