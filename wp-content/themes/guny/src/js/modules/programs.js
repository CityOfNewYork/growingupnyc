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
        this.getPrograms()
      },
      methods: {
        getPrograms: ProgramsList.getPrograms,
        getProgramTypes: ProgramsList.getProgramTypes,
        getAgeGroups: ProgramsList.getAgeGroups,
        generateFilterURL: ProgramsList.generateFilterURL,
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
 * Request to get the programs.
 */
ProgramsList.getPrograms = function() {
  let url = this.programsURL;
  let filters =this.filters;

  if (this.filters.length > 1){
    // parse the filters
  }else {
    // listen and add the filters
    if (this.checkedProgramType.length > 0 || this.checkedAgeGroup.length > 0 || this.programPage > 1) {
      filters = ProgramsList.generateFilterURL(this.checkedProgramType, this.checkedAgeGroup, this.programPage);
      url = url + '?' + filters;

      // update the query param
      this.$router.push({query: {programs_cat: this.checkedProgramType, age_group: this.checkedAgeGroup }});
    }
  }

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
// generate the filter for types and age groups
ProgramsList.generateFilterURL = function(types, ages, page) {
  let filters = [];

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


export default ProgramsList;
