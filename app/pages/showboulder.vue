<template>    
  <f7-page>
    <f7-navbar :title="$root.config.title" back-link="Back">
    </f7-navbar>     	
    <div id="viewer">
      <img data-src="../images/wall45.jpg" class="lazy">
    </div>
  </f7-page>
</template>

<script>
/* eslint no-unused-vars: "off" */  

import Dom7 from 'dom7'
const $$ = Dom7
const Viewer = require('../Viewer.js')

//const v = new Viewer($$(document).getElementById('viewer'))
  // v.setSource('../images/wall45.jpg')
// $$(document).on('page:init', () => {
//    on: {
//      pageInit() {
//        const v = new Viewer(document.getElementById('viewer'))
//        v.setSource('../images/wall45.jpg')
//      },
//    },
</script>