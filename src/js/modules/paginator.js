const DEFAULT_PER_PAGE = 30

export class Paginator {
  constructor(totalCount = 0, perPageCount = DEFAULT_PER_PAGE) {
    this.reset(totalCount, perPageCount)
  }
  reset(totalCount, perPageCount = DEFAULT_PER_PAGE) {
    this._currentPage = 1
    this._totalCount = totalCount
    this._perPageCount = perPageCount
    this._totalPage = Math.ceil(totalCount / perPageCount)
  }
  hasPrev() {
    return (this._currentPage != 1)
  }
  hasNext() {
    if (this._totalPage === 0) {
      return false
    }
    return (this._currentPage != this._totalPage)
  }
  isFirst2() {
    return (!this.hasPrev() || this._currentPage == 2)
  }
  isLast2(){
    return (!this.hasNext() || this._currentPage == this._totalPage - 1)
  }
  get prevPage() {
    if (this.hasPrev()) {
      return (this._currentPage - 1)
    } else {
      return null
    }
  }
  get nextPage() {
    if (this.hasNext()) {
      return (this._currentPage + 1)
    } else {
      return null
    }
  }
  get lastPage(){
    if (this._totalPage === 0) {
      return 1
    } else {
      return this._totalPage
    }
  }
  get currentPage() {
    return this._currentPage;
  }
  gotoPage(givenPage) {
    if (givenPage === null || givenPage === undefined) {
      return false
    } else if (givenPage < 1 || givenPage > this._totalPage || givenPage === this._currentPage) {
      return false
    } else {
      this._currentPage = givenPage
    }
  }
  fetch(data) {
    var pageFirstCount, pageLastCount
    if (this._currentPage === 1) {
      pageFirstCount = 0
    } else {
      pageFirstCount = this._perPageCount * (this._currentPage - 1)
    }
    if (this._currentPage === this._totalPage) {
      pageLastCount = this._totalCount - 1
    } else {
      pageLastCount = this._perPageCount * (this._currentPage) - 1
    }
    return data.slice(pageFirstCount, pageLastCount + 1)
  }
}
