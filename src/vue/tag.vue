<template lang="slm">
.tag-page.layout
  .lo-page
    .page-title
      a href="/tags"
        .pt-icon
          .pt-icon-img.tgp-icon
      h1.pt-text v-bind:style="{ color: currentTagData.color }"
        | 標籤{{ currentTagName }}
    .tgp-error-msg v-show="errorMsg != ''"
      .error-msg
        .em-error-code
          | 404
        .em-text
          | {{ errorMsg }}
    .tgp-related-tags v-show="relatedTags.length > 1"
      .tag-area
        .tag v-for="tag in relatedTags" v-bind:style="{ background: tag.color }"
          a.tag-link v-bind:href="'/tag?t=' + tag.tag"
            | {{ tag.name }}
    .tgp-post-list
      .post-list
        .pl-entry v-for="post in paginatedPosts"
          .pl-ca
            .category-icon
              a v-bind:href="'/categories?c=' + post.category"
                div v-bind:class="'ca-icon-' + post.category"
          .pl-content
            .pl-name
              a.pl-website v-bind:href="post.website" v-show="post.website" target="_blank"
                img src="/images/list/weblink_25x.svg"
              a v-bind:href="post.category === 'bm' ? post.website : '/posts/' + post.file"
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
          a href="/tags"
            img src="/images/menu/tags_48x.svg"
        .cp-middle.cp-mu-search-bar
          img src="/images/menu/search_48x.svg" v-on:click="$refs['searchInput'].focus()"
          input (type="search" ref="searchInput" v-model="queryKeyword" autofocus)
        .cp-last
</template>

<script>
import { Paginator } from 'modules/paginator.js'
import { UrlParamParser } from 'modules/url_param_parser.js'
const _ = require('lodash')

export default {
  name: 'index',
  data() {
    return {
      posts: POSTS,
      tagMap: TAGS,
      tagMaxCount: _.maxBy(_.values(TAGS), 'count').count,
      tags: [],
      paginator: new Paginator(_.keys(POSTS).length),
      urlParams: new UrlParamParser(),
      queryKeyword: "",
      currentTag: "",
      currentTagData: {},
      errorMsg: ''
    }
  },
  created: function() {
    var tagQuery = this.urlParams.value('t')
    this.currentTagData = this.tagMap[tagQuery]
    if (this.currentTagData != undefined) {
      this.currentTag = tagQuery
    } else {
      this.currentTag = undefined
      this.currentTagData = {
        name: '找不到標籤',
        color: '#000',
        count: 0
      }
      this.errorMsg = '我們之間一定有什麼誤會。'
    }
    var urlQuery = this.urlParams.value('q')
    if (urlQuery != undefined) {
      this.queryKeyword = urlQuery
    }
    var tags = _.values(_.mapValues(this.tagMap, function(value, key){
      value['tag'] = key
      return value
    }))
    this.tags = _.sortBy(_.values(tags), ['name'])
  },
  computed: {
    currentTagName: function() {
      return ' — ' + this.currentTagData.name
    },
    relatedTags: function() {
      if (this.currentTag != undefined) {
        var subTags = this.currentTag.split('_')
        var tags = this.tags.filter(function(tag){
          var isFound = false
          for (var subTag of subTags) {
            if (tag.tag.toLowerCase().indexOf(subTag) > -1) {
              isFound = true
              break
            }
          }
          return isFound
        })
        return tags
      } else {
        return []
      }
    },
    sortedPosts: function() {
      if (this.currentTag != undefined) {
        var tag = this.currentTag
        var posts = _.values(this.posts).filter(function(post){
          var tagFound = post.tags.join(' ').toLowerCase().indexOf(tag.toLowerCase()) > -1
          return (post['draft'] != true && tagFound)
        })
        return _.sortBy(posts, ['datetime']).reverse()
      } else {
        return []
      }
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
