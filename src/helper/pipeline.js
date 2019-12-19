const events = require('events')

const Pipeline = function (response) {
  events.EventEmitter.apply(this, arguments)
  this.on('next', this.next)
  this.on('force_end', this.forceEnd)
  this.eventQueue = []
  this.response = response
  this.input = {}
  this.output = {
    status: 200,
    content: {}
  }
}

Pipeline.prototype = Object.create(events.EventEmitter.prototype, {
  'constructor': Pipeline
})

Pipeline.prototype.add = function (name, callback) {
  this.eventQueue.push(name)
  this.on(name, callback)
}

Pipeline.prototype.next = function () {
  if (this.eventQueue.length > 0) {
    const name = this.eventQueue.shift()
    this.emit(name)
  } else {
    this.forceEnd()
  }
}

Pipeline.prototype.forceEnd = function () {
  this.response.status(this.output.status).json(this.output.content).end()
  return
}

module.exports = Pipeline
