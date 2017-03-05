<template lang="slm">
.tags
  .page-title
    .pt-icon
      .pt-icon-img.tgs-icon
    h1.pt-text
      | 標籤
  .tgs-tag-list
    .tag-list
      .tl-entry v-for="tag in paginatedTags" v-bind:style="{ background: tag.color }"
        .tl-name
          a.tl-link v-bind:href="'/tag?t=' + tag.tag"
            | {{ tag.name }}
        .tl-bar v-bind:style="{ flex: barRatio((0.4 + tag.count / tagMaxCount)*5 - 1) + ' 0 auto' }"
        .tl-bar-left v-bind:style="{ color: tag.color, flex:  barRatio((1.6 - tag.count / tagMaxCount)*5 + 1) + ' 0 auto' }"
          | {{ tag.count }}
  .tgs-ctrl-panel
    .ctrl-panel
      .cp-pagination
        .cp-pg-col.cp-first
        .cp-pg-col.cp-middle.cp-active.cp-number.cp-sort-switch-btn v-on:click="sortTb.switch('count')" v-bind:class="{'cp-count-selected': sortTb.isTab('count')}"
          span.cp-ssb-alphabet
            | A
          |  /
          span.cp-ssb-count
            | 1
        .cp-pg-col.cp-middle.cp-sep
        .cp-pg-col.cp-middle.cp-active.cp-number v-show="paginator.hasPrev()" v-on:click="switchPage(1)"
          | 1
        .cp-pg-col.cp-middle.cp-disabled v-show="!paginator.isFirst2()"
          |  &lt;
        .cp-pg-col.cp-middle.cp-active.cp-number v-show="!paginator.isFirst2()" v-on:click="switchPage(paginator.prevPage)"
          | {{ paginator.prevPage }}
        .cp-pg-col.cp-middle.cp-current.cp-number
          | {{ paginator.currentPage }}
        .cp-pg-col.cp-middle.cp-active.cp-number v-show="!paginator.isLast2()" v-on:click="switchPage(paginator.nextPage)"
          | {{ paginator.nextPage }}
        .cp-pg-col.cp-middle.cp-disabled v-show="!paginator.isLast2()"
          |  &lt;
        .cp-pg-col.cp-middle.cp-active.cp-number v-show="paginator.hasNext()" v-on:click="switchPage(paginator.lastPage)"
          | {{ paginator.lastPage }}
        .cp-pg-col.cp-middle.cp-sep
        .cp-pg-col.cp-middle.cp-number.cp-counter
          | {{ filteredTags.length }}
        .cp-pg-col.cp-last
      .cp-menu
        .cp-first
        .cp-middle.cp-mu-btn
          a href="/"
            img src="/images/header/trademark_50x.svg"
        .cp-middle.cp-mu-btn
          a href="/posts"
            img src="/images/menu/paper_48x.svg"
        .cp-middle.cp-mu-btn
          a href="/categories"
            img src="/images/menu/category_48x.svg"
        .cp-middle.cp-mu-search-bar
          img src="/images/menu/search_48x.svg"
          input (type="search" v-model="queryKeyword" autofocus)
        .cp-last
</template>

<script>
import { Paginator } from 'modules/paginator.js'
import { TabSwitcher } from 'modules/tab_switcher.js'
import { UrlParamParser } from 'modules/url_param_parser.js'
const _ = require('lodash')

export default {
  name: 'index',
  data() {
    return {
      tagMap: TAGS,
      tagMaxCount: _.maxBy(_.values(TAGS), 'count').count,
      paginator: new Paginator(_.keys(TAGS).length),
      urlParams: new UrlParamParser(),
      queryKeyword: "",
      sortTb: new TabSwitcher('alphabet')
    }
  },
  created: function() {
    var urlQuery = this.urlParams.value('q')
    if (urlQuery != undefined) {
      this.queryKeyword = urlQuery
    }
  },
  computed: {
    sortedTags: function() {
      var tags = _.values(_.mapValues(this.tagMap, function(value, key){
        value['tag'] = key
        return value
      }))
      if (this.sortTb.isTab('alphabet')) {
        return _.sortBy(_.values(tags), ['name'])
      } else {
        return _.sortBy(_.values(tags), ['count']).reverse()
      }
    },
    filteredTags: function() {
      var keyword = this.queryKeyword.toLowerCase()
      var tagMap = this.tagMap
      var tags = []
      if (keyword === "") {
        tags = this.sortedTags
      } else {
        tags = this.sortedTags.filter(function(tag){
          var searchTarget = []
          searchTarget.push(tag.tag)
          searchTarget.push(tag.name)
          return (searchTarget.join(' ').toLowerCase().indexOf(keyword) > -1)
        })
      }
      return tags
    },
    paginatedTags: function() {
      return this.paginator.fetch(this.filteredTags)
    }
  },
  methods: {
    switchPage: function(targetPage) {
      this.paginator.gotoPage(targetPage)
    },
    barRatio: function(value){
      return _.round(value, 2)
    }
  },
  watch: {
    filteredTags: function() {
      this.paginator.reset(this.filteredTags.length)
    }
  }
}
</script>

<style>

</style>
