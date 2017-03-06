export class CheckboxSwitcher {
  constructor(initTabs = []) {
    this.initTabs = initTabs
    this.reset()
  }
  switch(tab) {
    var tabIndex = this.selectedTabs.indexOf(tab)
    if (tabIndex > -1) {
      this.selectedTabs.splice(tabIndex, 1)
    } else {
      this.selectedTabs.push(tab)
    }
  }
  isTab(tabs) {
    if (Array.isArray(tabs)) {
      var isAllIncluded = true
      for (var tab in tabs) {
        if (this.selectedTabs.indexOf(tab) < 0) {
          isAllIncluded = false
          break
        }
      }
      return isAllIncluded
    } else {
      return (this.selectedTabs.indexOf(tabs) > -1)
    }
  }
  setTab(tab) {
    var tabIndex = this.selectedTabs.indexOf(tab)
    if (tabIndex < 0) {
      this.selectedTabs.push(tab)
    }
  }
  reset(){
    this.selectedTabs = this.initTabs
  }
}
