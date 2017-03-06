<template lang="slm">
  .home
    .hm-page
      .hm-trademark
        .tm-icon
        .tm-title
          | 魔法師的手杖
        .tm-subtitle
          | Kait's Blog
      .hm-title
        .ht-text
          h1 近期文章
      .hm-post-list
        .post-list
          .pl-entry v-for="post in recentPosts"
            .pl-ca
              .category-icon
                a v-bind:href="'/category/' + post.category"
                  div v-bind:class="'ca-icon-' + post.category"
            .pl-content
              .pl-name
                a.pl-website v-bind:href="post.website" v-show="post.website" target="_blank"
                  img src="/images/list/weblink_24x.svg"
                a v-bind:href="'/post/' + post.file"
                  | {{ post.title }}
              .pl-time
                | {{ post.datetime }}
              .pl-tags
                .tag-area
                  .tag v-for="tag in post.tags" v-bind:style="{ background: tagMap[tag].color }"
                    a.tag-link v-bind:href="'/tag?t=' + tag"
                      | {{ tagMap[tag].name }}
      .hm-readmore
        a.hr-text href="/posts"
          | 所有文章
      .hm-title
        .ht-text
          h1 熱門標籤
      .hm-tag-list
        .tag-list
          .tl-entry v-for="tag in hotTags" v-bind:style="{ background: tag.color }"
            .tl-name
              a.tl-link v-bind:href="'/tag?t=' + tag.tag"
                | {{ tag.name }}
            .tl-bar v-bind:style="{ flex: barRatio((0.4 + tag.count / tagMaxCount)*5 - 1) + ' 0 auto' }"
            .tl-bar-left v-bind:style="{ color: tag.color, flex:  barRatio((1.6 - tag.count / tagMaxCount)*5 + 1) + ' 0 auto' }"
              | {{ tag.count }}
      .hm-readmore
        a.hr-text href="/tags"
          | 所有標籤
      .hm-title
        .ht-text
          h1 關於我
      .hm-about-me-area
        .ama-avatar
        .ama-name
        .ama-desc
        .ama-twitter
          a class="twitter-timeline" data-lang="zh-tw" data-height="600" href="https://twitter.com/sibevin"
    .hm-ctrl-panel
      .ctrl-panel
        .cp-menu
          .cp-first
          .cp-middle.cp-mu-btn
            a href="/posts"
              img src="/images/menu/paper_48x.svg"
          .cp-middle.cp-mu-btn
            a href="/tags"
              img src="/images/menu/tags_48x.svg"
          .cp-middle.cp-mu-btn
            a href="/categories"
              img src="/images/menu/category_48x.svg"
          .cp-middle.cp-mu-btn
            a href="/posts"
              img src="/images/menu/search_48x.svg"
          .cp-last
</template>

<script>
const _ = require('lodash')
const MAX_POST_COUNT = 10
const MAX_TAG_COUNT = 10

export default {
  name: 'index',
  data() {
    return {
      posts: POSTS,
      tagMap: TAGS,
      tagMaxCount: _.maxBy(_.values(TAGS), 'count').count
    }
  },
  computed: {
    hotTags: function() {
      var tags = _.values(_.mapValues(this.tagMap, function(value, key){
        value['tag'] = key
        return value
      }))
      return _.sortBy(_.values(tags), ['count']).reverse().slice(1, MAX_TAG_COUNT)
    },
    recentPosts: function() {
      return _.sortBy(this.posts, ['datetime']).reverse().slice(1, MAX_POST_COUNT)
    }
  },
  methods: {
    barRatio: function(value){
      return _.round(value, 2)
    }
  }
}
</script>

<style>

</style>
