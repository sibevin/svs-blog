import Vue from 'vue'
import { TabSwitcher } from '@/js/modules/tab_switcher.js'

new Vue({
  el: '#app',
  data: {
    tocTb: new TabSwitcher('off'),
    posts: POSTS,
    tagMap: TAGS,
    currentPost: POSTS[FILE]
  }
})
