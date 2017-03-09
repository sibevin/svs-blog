<template lang="slm">
.categories.layout
  .lo-page
    .page-title
      a href="/tags"
        .pt-icon
          .pt-icon-img.cgs-icon
      h1.pt-text
        | 分類
    .cgs-category-list
      .cgs-ca-icon v-for="ca in categories" v-bind:class="{ selected: caCbs.isTab(ca) }"
        a v-on:click="caCbs.switch(ca)"
          img v-bind:src="'/images/category/' + ca + '_50x.svg'"
        .cgs-ca-text
          | {{ caMap[ca].name }}
    .cgs-post-list
      .post-list
        .pl-entry v-for="post in paginatedPosts"
          .pl-ca
            .category-icon
              a v-bind:href="'/category/' + post.category"
                div v-bind:class="'ca-icon-' + post.category"
          .pl-content
            .pl-name
              a.pl-website v-bind:href="post.website" v-show="post.website" target="_blank"
                img src="/images/list/weblink_25x.svg"
              a v-bind:href="'/post/' + post.file"
                | {{ post.title }}
            .pl-time
              | {{ post.datetime }}
            .pl-tags
              .tag-area
                .tag v-for="tag in post.tags" v-bind:style="{ background: tagMap[tag].color }"
                  a.tag-link v-bind:href="'/tag?t=' + tag"
                    | {{ tagMap[tag].name }}
  .lo-ctrl-panel
    .ctrl-panel
      .cp-pagination
        .cp-pg-col.cp-first
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
          | {{ filteredPosts.length }}
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
          a href="/tags"
            img src="/images/menu/tags_48x.svg"
        .cp-middle.cp-mu-search-bar
          img src="/images/menu/search_48x.svg" v-on:click="$refs['searchInput'].focus()"
          input (type="search" ref="searchInput" v-model="queryKeyword" autofocus)
        .cp-last
</template>

<script>
import { Paginator } from 'modules/paginator.js'
import { CheckboxSwitcher } from 'modules/checkbox_switcher.js'
import { UrlParamParser } from 'modules/url_param_parser.js'
const _ = require('lodash')

export default {
  name: 'index',
  data() {
    return {
      categories: _.keys(CATEGORIES),
      caCbs: new CheckboxSwitcher(),
      posts: POSTS,
      tagMap: TAGS,
      caMap: CATEGORIES,
      paginator: new Paginator(0),
      urlParams: new UrlParamParser(),
      queryKeyword: "",
    }
  },
  created: function() {
    var urlQuery = this.urlParams.value('q')
    if (urlQuery != undefined) {
      this.queryKeyword = urlQuery
    }
  },
  computed: {
    sortedPosts: function() {
      var caCbs = this.caCbs
      var posts = _.values(this.posts).filter(function(post){
        return (post['draft'] != true && caCbs.isTab(post.category))
      })
      return _.sortBy(posts, ['datetime']).reverse()
    },
    filteredPosts: function() {
      var keyword = this.queryKeyword.toLowerCase()
      var tagMap = this.tagMap
      var posts = []
      if (keyword === "") {
        posts = this.sortedPosts
      } else {
        posts = this.sortedPosts.filter(function(post){
          var searchTarget = []
          searchTarget.push(post.title)
          searchTarget.push(post.datetime)
          searchTarget.push(post.category)
          searchTarget = searchTarget.concat(post.tags)
          searchTarget = searchTarget.concat(_.map(post.tags, function(tag){
            return tagMap[tag].name
          }))
          return (searchTarget.join(' ').toLowerCase().indexOf(keyword) > -1)
        })
      }
      return posts
    },
    paginatedPosts: function() {
      return this.paginator.fetch(this.filteredPosts)
    }
  },
  methods: {
    switchPage: function(targetPage) {
      this.paginator.gotoPage(targetPage)
    }
  },
  watch: {
    filteredPosts: function() {
      this.paginator.reset(this.filteredPosts.length)
    }
  }
}
</script>

<style>

</style>
