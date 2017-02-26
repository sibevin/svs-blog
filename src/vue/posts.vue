<template lang="slm">
.posts
  .page-title
    .pt-icon
      .pt-icon-img.pts-icon
    h1.pt-text
      | 文章
  .pts-post-list
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
                a.tag-link v-bind:href="'/tag/' + tag"
                  | {{ tagMap[tag].name }}
  .pts-ctrl-panel
    .ctrl-panel
      .cp-trademark
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
        .cp-pg-col.cp-last
      .cp-search
        input type="text" v-model="queryKeyword"
</template>

<script>
import { Paginator } from 'modules/paginator.js'
const _ = require('lodash')
const MAX_POST_COUNT = 10
const MAX_TAG_COUNT = 10

export default {
  name: 'index',
  data() {
    return {
      posts: POSTS,
      tagMap: TAGS,
      tagMaxCount: _.maxBy(_.values(TAGS), 'count').count,
      paginator: new Paginator(_.keys(POSTS).length)
    }
  },
  computed: {
    sortedPosts: function() {
      return _.sortBy(this.posts, ['datetime']).reverse()
    },
    paginatedPosts: function() {
      return this.paginator.fetch(this.sortedPosts)
    }
    filiteredPosts: function() {
      return this.paginatedPosts
    }
  },
  methods: {
    switchPage: function(targetPage) {
      this.paginator.gotoPage(targetPage)
    }
  }
}
</script>

<style>

</style>
