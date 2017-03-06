export class TabSwitcher {
  constructor(tab = null) {
    this.initTab = tab
    this.reset()
  }
  switch (tab) {
    if (this.currentTab === tab) {
      this.reset()
    } else {
      this.currentTab = tab
    }
  }
  isTab(tabs) {
    if (Array.isArray(tabs)) {
      return (tabs.indexOf(this.currentTab) > -1)
    } else {
      return (this.currentTab === tabs)
    }
  }
  setTab(tab) {
    this.currentTab = tab
  }
  reset(){
    this.currentTab = this.initTab
  }
}
