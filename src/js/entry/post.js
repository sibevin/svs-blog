import Vue from 'vue'

new Vue({
  el: '#app',
  data: {
    posts: POSTS,
    tagMap: TAGS,
    currentPost: POSTS[FILE]
  }
})
