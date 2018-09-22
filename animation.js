///////////\
// Anatema  \_______________
//                          \.
// Sulle rive di uno stagno  |_.
// passò un satiro e la vide,  |
// Reginella sempre bella      |
// è la Musica di Euclide.     |.
//                               \
// È all'Identità, il riflesso    |
// ciò a cui diede movimento.     |
// Ben tre sassi egli lanciò     /
// distribuendoli nel vento.     |
//                                \.
// Poi nell'onda nacque un fiore,  |
// tre fu il fischio della voce. _/
/////////////////////////////////

const initialState = {
  nextId: 0,
  circle: {}
}

function distance (a, b) {
  console.log(a, b)
  return Math.round(Math.sqrt((a.cx - b.cx) * (a.cx - b.cx) + (a.cy - b.cy) * (a.cy - b.cy)))
}

const circle1 = {
  cx: 100 + Math.floor(Math.random() * 100),
  cy: 100 + Math.floor(Math.random() * 100),
  r: 50 + Math.floor(Math.random() * 40)
}

const circle2 = {
  cx: 250 + Math.floor(Math.random() * 100),
  cy: 250 + Math.floor(Math.random() * 100)
}

const timeline = [
  {
    type: 'CREATE_CIRCLE',
    begin: 1,
    circle: circle1
  },
  {
    type: 'CREATE_CIRCLE',
    begin: 2,
    circle: Object.assign(circle2, { r: distance(circle1, circle2) - circle1.r })
  }
]

class Component {
  constructor (container, dispatch) {
    this.container = container
    this.dispatch = dispatch

    this.component = {}
  }
}

class Circle extends Component {
  constructor (container, dispatch) {
    super(container, dispatch)
  }

  render (state, dispatch) {
    const { container } = this

    const { begin, r, cx, cy } = state

    if (r !== this.r) {
      this.r = r
      container.innerHTML = `<animate attributeName="r" from="0" to="${r}" begin="${begin}s" dur="1s" fill="freeze" />`
    }

    if (cx !== this.cx) {
      this.cx = cx
      container.setAttribute('cx', cx)
    }

    if (cy !== this.cy) {
      this.cy = cy
      container.setAttribute('cy', cy)
    }
  }
}

class Root extends Component {
  createCircle (circle) {
    const { id } = circle

    const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    element.setAttribute('id', id)
    this.container.appendChild(element)

    const component = new Circle(element, this.dispatch)

    component.render(circle)

    this.component[id] = component
  }

  render (state, dispatch) {
    Object.keys(state.circle).forEach(id => {
      const component = this.component[id]
      const circle = state.circle[id]

      if (component) {
        component.render(circle)
      } else {
        this.createCircle(circle)
      }
    })
  }
}

function reducer (previousState, action) {
  const state = Object.assign({}, previousState)

  switch (action.type) {
    case 'CREATE_CIRCLE':
      const  nextId = state.nextId + 1
      state.circle[nextId] = Object.assign({ id: nextId }, { begin: action.begin }, action.circle)
      state.nextId = nextId

      break

    case 'INVERT':

      break
  }

  return state
}

function app (state) {
  return function () {
    let render = Function.prototype

    function dispatch (action) {
      state = reducer(state, action)
      render(state, dispatch)
    }

    const root = new Root(document.querySelector('svg.background'), dispatch)

    render = root.render.bind(root)

    timeline.forEach(action => {
      setTimeout(() => {
        dispatch(action)
      }, action.begin * 1000)
    })
  }
}

window.addEventListener('load', app(initialState))
