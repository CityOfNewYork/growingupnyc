'use strict';

import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';
import router from './router'

class ProgramsList {

  constructor() {
    if(document.documentElement.lang != 'en'){
      this._baseURL = window.location.origin + '/' + document.documentElement.lang;
    }else{
      this._baseURL = window.location.origin;
    }

    this._programs = {
      delimiters: ['v{', '}'],
      el: '#vue-programs',
      router,
      data: {
        programsURL: this._baseURL + '/wp-json/wp/v2/program',
        programTypeURL: this._baseURL + '/wp-json/wp/v2/programs_cat',
        ageGroupURL: this._baseURL + '/wp-json/wp/v2/age_group',
        programs: null,
        programTypes: null,
        checkedProgramType: [],
        checkedAgeGroup: [],
        ageGroups: null,
        programPage: 1,
        maxPages: 1,
        errorMsg: false,
        isLoading: true,
        checkedAllTypes: false,
        checkedAllAges: false,
        totalResults: ''
      },
       watch: {
        checkedProgramType: 'getPrograms',
        checkedAgeGroup: 'getPrograms',
        programPage: 'getPrograms',
        checkedAllTypes: 'selectAllTypes',
        checkedAllAges: 'selectAllAges'
      },
      mounted: function() {
        axios.all([
          axios.get(this.programTypeURL),
          axios.get(this.ageGroupURL)
          ])
          .then(axios.spread((catResponse, ageResponse) => {
            this.programTypes = catResponse.data;
            this.ageGroups = ageResponse.data;
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
        selectAllAges: ProgramsList.selectAllAges
      }
    }
  }

  /**
   * Initialize
   **/
  init() {
    this._programs = new Vue(this._programs);

    $(window).on('resize', function(){
      console.log('resize')
      console.log()
      if($(window).width() >=1024){
        $('.loader-mobile').hide();
      }
    })
  }
}
/**
 * Request to get the programs and update router
 **/
ProgramsList.getPrograms = function() {
  let url = this.programsURL;
  
  ProgramsList.showLoader(this.$el, this.programs)

  let filters = ProgramsList.generateFilterURL(this);
  url = url + '?' + filters;

  // update the query
  if ( this.programPage == 1){
    this.$router.push({query: {category: this.checkedProgramType, age_group: this.checkedAgeGroup}});
  }else {
    this.$router.push({query: {category: this.checkedProgramType, age_group: this.checkedAgeGroup, page: this.programPage }});
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
    arrIds = ProgramsList.getIds(data.programTypes, data.checkedProgramType).map(value => value.term_id)
    filters.push('programs_cat[]=' + arrIds.join('&programs_cat[]='));
  }

  if ( data.checkedAgeGroup.length > 0  ) {
    arrIds = ProgramsList.getIds(data.ageGroups, data.checkedAgeGroup).map(value => value.id)
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
ProgramsList.parseQuery = function() {
  let query =this.$route.query;
  let queryArr = [];

  if(!_.isEmpty(query.category)){
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

  if(!_.isEmpty(query.age_group)){
    if (_.isArray(query.age_group)){
      if (query.age_group.every( (val, i, arr) => val === arr[0] )) {
        query.age_group = query.age_group[0];
      } else {
        queryArr=ProgramsList.getIds(this.ageGroups, query.age_group.map(String));
        this.checkedAgeGroup = queryArr.map(value => value.slug)
      }
    }else{
      let index = this.ageGroups.map(function(e) { return e.slug; }).indexOf(query.age_group);
      this.checkedAgeGroup.push(this.ageGroups[index].slug);
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
ProgramsList.getIds = function(filter, slugs) {
  let arrIds = [];

  slugs.forEach(function(slug) {
    let index = filter.map(function(e) { return e.slug; }).indexOf(slug);
    if (filter[index].id) {
      arrIds.push(filter[index])
    }else {
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
ProgramsList.showLoader = function(el, programs){
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
    $(el).find('.loader-mobile').show();
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
    this.checkedAllTypes = false;
    this.checkedProgramType = [];
  }
}

ProgramsList.selectAllAges = function() {  
  if(this.checkedAllAges){
    this.checkedAgeGroup = this.ageGroups.map(a => a.slug);
  }else {
    this.checkedAllAges = false;
    this.checkedAgeGroup = [];
  }
}

export default ProgramsList;


