/*
This implementation is from:

SO - How to get the value from the GET parameters?
http://stackoverflow.com/a/979995
*/
export class UrlParamParser {
  constructor(givenSearchStr) {
    this.parse()
  }
  parse(){
    var params = {}
    var vars = window.location.search.substring(1).split("&")
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=")
      // If first entry with this name
      if (typeof params[pair[0]] === "undefined") {
        params[pair[0]] = decodeURIComponent(pair[1])
        // If second entry with this name
      } else if (typeof params[pair[0]] === "string") {
        var arr = [params[pair[0]], decodeURIComponent(pair[1])]
        params[pair[0]] = arr
        // If third or later entry with this name
      } else {
        params[pair[0]].push(decodeURIComponent(pair[1]))
      }
    }
    this._params = params
  }
  value(givenKey) {
    return this._params[givenKey]
  }
}
