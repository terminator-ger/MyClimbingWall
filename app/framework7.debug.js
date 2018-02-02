/* framework7.debug.js */

let debugEnabled = true

window.debugPlugin = {
  name: 'debugger',
  // extend app params with debugger params
  params: {
    debugger: false,
  },
  create() {
    const app = this
    // extend app methods with debugger methods when app instance just created
    app.debugger = {
      enable() {
        debugEnabled = true
      },
      disable() {
        debugEnabled = false
      },
    }
  },
  on: {
    init() {
      const app = this
      if (app.params.debugger) debugEnabled = true
      if (debugEnabled) console.log('app init')
    },
    pageBeforeIn(page) {
      if (debugEnabled) console.log('pageBeforeIn', page)
    },
    pageAfterIn(page) {
      if (debugEnabled) console.log('pageAfterIn', page)
    },
    pageBeforeOut(page) {
      if (debugEnabled) console.log('pageBeforeOut', page)
    },
    pageAfterOut(page) {
      if (debugEnabled) console.log('pageAfterOut', page)
    },
    pageInit(page) {
      if (debugEnabled) console.log('pageInit', page)
    },
    pageBeforeRemove(page) {
      if (debugEnabled) console.log('pageBeforeRemove', page)
    },
  },
}
