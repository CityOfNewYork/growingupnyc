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
        filters: window.location.search,
        programs: null,
        programTypes: null,
        ageGroups: null,
        checkedProgramType: [],
        checkedAgeGroup: [],
        programPage: 1,
        programsCounter: 0,
      },
       watch: {
        checkedProgramType: 'getPrograms',
        checkedAgeGroup: 'getPrograms',
        programPage: 'getPrograms'
      },
      mounted: function() {
        this.getProgramTypes(),
        this.getAgeGroups(),
        this.parseQuery(),
        this.getPrograms()
      },
      methods: {
        getPrograms: ProgramsList.getPrograms,
        getProgramTypes: ProgramsList.getProgramTypes,
        getAgeGroups: ProgramsList.getAgeGroups,
        generateFilterURL: ProgramsList.generateFilterURL,
        parseQuery: ProgramsList.parseQuery,
      }
    }
  }

  /**
   * Initialize
   */
  init() {
    this._programs = new Vue(this._programs);
  }
}

/**
 * Request to get the programs and update router
 */
ProgramsList.getPrograms = function() {
  let url = this.programsURL;
  
  let filters = ProgramsList.generateFilterURL(this.checkedProgramType, this.checkedAgeGroup, this.programPage);
  url = url + '?' + filters;

  // update the query
  this.$router.push({query: {programs_cat: this.checkedProgramType, age_group: this.checkedAgeGroup }});

  axios
    .get(url)
    .then(response => (this.programs = response.data))
    .catch(error => console.log(error))
}

/**
 * Request to get the program types to populate filter
 */
ProgramsList.getProgramTypes = function() {
  axios
    .get(this.programTypeURL)
    .then(response => (this.programTypes = response.data))
    .catch(error => console.log(error))
}

/**
 * Request to get the age groups to populate filter
 */
ProgramsList.getAgeGroups = function() {
  axios
    .get(this.ageGroupURL)
    .then(response => (this.ageGroups = response.data))
    .catch(error => console.log(error))
}

/**
 * Generate the string filter for all user chosen taxonomies
 * @param {array} - array with the ids of program types
 * @param {array} - array with the ids of age groups
 * @param {integer} - page number
 * @return {string} - string of all filters
 */
ProgramsList.generateFilterURL = function(types, ages, page) {
  let filters = [];

  // console.log(types);
  if ( types.length > 0 ){
    filters.push('programs_cat[]=' + types.join('&programs_cat[]='));
  }

  if ( ages.length > 0  ) {
    filters.push('age_group[]=' + ages.join('&age_group[]='));
  }

  if (page > 1) {
    filters.push('page=' + page);
  }

  filters = filters.join('&');
  
  return filters;
}
/**
 * Updates the program type and age group array in the 
 * query parameters
 */
ProgramsList.parseQuery = function() {
  let query =this.$route.query;

  if (_.isArray(query.programs_cat)){
    this.checkedProgramType=query.programs_cat.map(Number);
  }else {
    if(query.programs_cat){
      this.checkedProgramType.push(parseInt(query.programs_cat, 10));
    }
  }

  if (_.isArray(query.age_group)){
    this.checkedAgeGroup=query.age_group.map(Number);
  }else {
    if(query.age_group){
      this.checkedAgeGroup.push(parseInt(query.age_group,10));
    }
  }
}


export default ProgramsList;
