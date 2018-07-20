'use strict';
import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';

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
      data: {
        programsURL: this._baseURL + '/wp-json/wp/v2/program',
        programs: null,
        programTypeURL: this._baseURL + '/wp-json/wp/v2/programs_cat',
        programTypes: null,
        programTypesFilter: null,
        ageGroupURL: this._baseURL + '/wp-json/wp/v2/age_group',
        ageGroups: null,
        ageGroupFilter: null,
        checkedProgramType: [],
        checkedAgeGroup: []
      },
       watch: {
        programTypesFilter: 'getPrograms',
        ageGroupFilter: 'getPrograms',
        checkedProgramType: 'getCheckedProgramType',
        checkedAgeGroup: 'getCheckedAgeGroup',
      },
      mounted: function() {
        this.getPrograms(),
        this.getProgramTypes(),
        this.getAgeGroups()
      },
      methods: {
        getPrograms: ProgramsList.getPrograms,
        getCheckedProgramType: ProgramsList.getCheckedProgramType,
        getCheckedAgeGroup: ProgramsList.getCheckedAgeGroup,
        getProgramTypes: ProgramsList.getProgramTypes,
        getAgeGroups: ProgramsList.getAgeGroups,
        generateFilterURL: ProgramsList.generateFilterURL
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

// get the programs
ProgramsList.getPrograms = function() {
  let url = this.programsURL;
  let filters ='';
  // add the query
  if (this.programTypesFilter || this.ageGroupFilter){
    filters = ProgramsList.generateFilterURL(this.programTypesFilter, this.ageGroupFilter);
    url = url + '?' + filters;
  }
  axios
    .get(url)
    .then(response => (this.programs = response.data))
    .catch(error => console.log(error))
}

// get the post programTypesFilter based on user selection
ProgramsList.getCheckedProgramType = function(event) {
  let prog_types= this.checkedProgramType.join("&programs_cat[]=");
  this.programTypesFilter = prog_types;
}

// get the age group based on the user selection
ProgramsList.getCheckedAgeGroup = function(event) {
  let ageGroups= this.checkedAgeGroup.join("&age_group[]=");
  this.ageGroupFilter = ageGroups;
}

// get the categories for the filter
ProgramsList.getProgramTypes = function() {
  axios
    .get(this.programTypeURL)
    .then(response => (this.programTypes = response.data))
    .catch(error => console.log(error))
}

// get the categories for the filter
ProgramsList.getAgeGroups = function() {
  axios
    .get(this.ageGroupURL)
    .then(response => (this.ageGroups = response.data))
    .catch(error => console.log(error))
}

// generate the filter for types and age groups
ProgramsList.generateFilterURL = function(types, ages) {
  let filters = '';
  if( types && !ages){
    filters = 'programs_cat[]=' + types;
  }else if ( ages && !types){
    filters = 'age_group[]=' + ages;
  }else if( ages && types){
    filters = 'programs_cat[]=' + types + '&' + 'age_group[]=' + ages;
  }
  return filters;
}


export default ProgramsList;
