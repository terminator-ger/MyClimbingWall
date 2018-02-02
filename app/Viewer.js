/* eslint no-underscore-dangle: ["error", { "allow": ["_this"] }] */
/* eslint max-len: ["error", { "code": 140 }] */

import Hammer from 'hammerjs'

const Point = require('./Point.js')


module.exports = class Viewer {
  constructor(viewer) {
    this.ticking = false
    console.info(`viewer browser on: ${viewer}`)
    this.viewer = viewer
    this.viewer.style.position = 'relative'
    this.viewer.style.overflow = 'hidden'
    this.viewer.style.touchAction = 'none'
    this.viewer.style.backgroundColor = '#000000'
    this.viewer.style['-webkit-user-select'] = 'none'
    this.viewer.style['-webkit-user-drag'] = 'none'
    this.viewer.style['-webkit-tap-highlight-color'] = 'rgba(0, 0, 0, 0)'
    this.viewerContent = this.viewer.querySelector('.image')
    if (this.viewerContent == null) {
      this.viewerContent = document.createElement('img')
      this.viewerContent.className = 'image'
      this.viewer.appendChild(this.viewerContent)
    }
    this.viewerContent.style.position = 'absolute'
    this.viewerContent.style.transition = 'transform 100ms linear'
    console.info(`image width = ${this.viewer.clientWidth}x${this.viewer.clientHeight}`)
    this.transform = class Transform {
      constructor() {
        this.translate = new Point(0, 0)
        this.scale = 1
        this.angle = 0
      }
    }


    this.initializeHammerEvents()
    console.info(`viewer controller constructed: ${this.transform}`)
    this.setViewPortSize({ width: this.viewer.clientWidth, height: this.viewer.clientHeight })
  }

  initializeHammerEvents() {
    const _this = this
    this.gestureManager = new Hammer.Manager(this.viewer, {
      touchAction: 'pan-x pan-y',
    })
    this.gestureManager.add(new Hammer.Pinch({
      threshold: 0,
    }))
    this.gestureManager.on('pinchstart pinchmove', (event) => { _this.onPinch(event) })
    this.viewerContent.addEventListener('click', (event) => {
      _this.onImageClick(event)
    })
  }
  enableGestures() {
    this.initializeHammerEvents()
    this.viewer.style.pointerEvents = 'auto'
  }
  disableGestures() {
    this.viewer.style.pointerEvents = 'none'
    this.gestureManager.off('panstart panmove rotatestart rotatemove pinchstart pinchmove pinchend rotateend press doubletap')
  }
  setViewPortSize(size) {
    this.viewer.style.width = `${size.width}px`
    this.viewer.style.height = `${size.height}px`
    this.adjustZoom()
  }
  getViewPortSize() {
    return {
      width: this.viewer.clientWidth,
      height: this.viewer.clientHeight,
    }
  }
  getDocumentSize() {
    return {
      width: this.viewerContent.clientWidth,
      height: this.viewerContent.clientHeight,
    }
  }

  setSource(source) {
    const _this = this
    this.viewerContent.src = source
    this.viewerContent.onload = function () {
      console.info('image loaded')
      _this.adjustZoom()
    }
  }
  adjustZoom() {
    const size = this.getViewPortSize()
    const documentSize = this.getDocumentSize()
    console.info(`adjust zoom, documentSize: ${documentSize.width}x${documentSize.height}`)
    console.info(`adjust zoom, viewPortSize: ${size.width}x${size.height}`)
    this.minScale = 100 / documentSize.width
    console.info(`minScale=${this.minScale}`)
    const widthScale = size.width / documentSize.width
    const heightScale = size.height / documentSize.height
    const scale = Math.min(widthScale, heightScale)
    const left = (size.width - documentSize.width) / 2
    const top = (size.height - documentSize.height) / 2
    console.log(`setting content to : left => ${left}  , top => ${top}`, ', scale => ', scale)
    this.viewerContent.style.left = `${left}px`
    this.viewerContent.style.top = `${top}px`
    this.transform.scale = scale
    this.updateElementTransform()
  }
  onPinch(ev) {
    const pinchCenter = new Point(ev.center.x - this.viewer.offsetLeft, ev.center.y - this.viewer.offsetTop)
    console.info(`pinch - center=${pinchCenter} scale=${ev.scale}`)
    if (ev.type === 'pinchstart') {
      this.pinchInitialScale = this.transform.scale || 1
    }
    let targetScale = this.pinchInitialScale * ev.scale
    if (targetScale <= this.minScale) {
      targetScale = this.minScale
    }
    if (Math.abs(this.transform.scale - this.minScale) < 1e-10
              && Math.abs(targetScale - this.minScale) < 1e-10) {
      console.debug('already at min scale')
      this.requestElementUpdate()
      return
    }
    this.zoomTo(new Point(ev.center.x, ev.center.y), targetScale)
  }
  onImageClick(event) {
    console.info('click')
    const zoomCenter = new Point(event.pageX - this.viewer.offsetLeft, event.pageY - this.viewer.offsetTop)
    const scaleFactor = event.shiftKey || event.ctrlKey ? 0.75 : 1.25
    this.zoomTo(zoomCenter, scaleFactor * this.transform.scale)
  }
  zoomTo(zoomCenter, newScale) {
    const viewPortSize = this.getViewPortSize()
    const viewPortCenter = new Point(viewPortSize.width / 2, viewPortSize.height / 2)
    const zoomRelativeCenter = new Point(zoomCenter.x - viewPortCenter.x, zoomCenter.y - viewPortCenter.y)
    console.debug(`clicked at ${zoomRelativeCenter} (relative to center)`)
    const oldScale = this.transform.scale
    // calculate translate difference
    // 1. center on new coordinates
    let zoomDx = -(zoomRelativeCenter.x) / oldScale
    let zoomDy = -(zoomRelativeCenter.y) / oldScale
    // 2. translate from center to clicked point with new zoom
    zoomDx += (zoomRelativeCenter.x) / newScale
    zoomDy += (zoomRelativeCenter.y) / newScale
    console.debug(`dx=${zoomDx} dy=${zoomDy} oldScale=${oldScale}`)
    // / move to the difference
    this.transform.translate.x += zoomDx
    this.transform.translate.y += zoomDy
    this.transform.scale = newScale
    console.debug(`applied zoom: scale= ${this.transform.scale} translate=${this.transform.translate}`)
    this.requestElementUpdate()
  }
  requestElementUpdate() {
    const _this = this
    if (!this.ticking) {
      window.requestAnimationFrame(() => { _this.updateElementTransform() })
      this.ticking = true
    }
  }
  updateElementTransform() {
    const value = [
      `rotate(${this.transform.angle}deg)`,
      `scale(${this.transform.scale}, ${this.transform.scale})`,
      `translate3d(${this.transform.translate.x}px, ${this.transform.translate.y}px, 0px)`,
    ]
    const stringValue = value.join(' ')
    console.debug(`transform = ${stringValue}`)
    this.viewerContent.style.transform = stringValue
    this.viewerContent.style.webkitTransform = stringValue
    this.viewerContent.style.MozTransform = stringValue
    this.viewerContent.style.msTransform = stringValue
    this.viewerContent.style.OTransform = stringValue
    this.ticking = false
  }
}
