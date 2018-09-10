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

const a = document.querySelector('circle#a')
const b = document.querySelector('circle#b')
const c = document.querySelector('circle#c')

const initialState = {
  circles: [
    {
      id: 'a',
      x: a.getAttribute('cx'),
      y: a.getAttribute('cy')
    },
    {
      id: 'b',
      x: b.getAttribute('cx'),
      y: b.getAttribute('cy')
    },
    {
      id: 'c',
      x: c.getAttribute('cx'),
      y: c.getAttribute('cy')
    }
  ]
}

class Component {
  constructor (container, dispatch) {
    this.container = container
    this.dispatch = dispatch

    this.component = {}
  }
}

class Circle extends Component {
  distanceFrom (p) {
    const c = this.getCenter()

    return Math.round(Math.sqrt((p.x - c.x) * (p.x - c.x) + (p.y - c.y) * (p.y - c.y)))
  }

  getCenter () {
    return {
      x: parseInt(this.container.getAttribute('cx')),
      y: parseInt(this.container.getAttribute('cy'))
    }
  }

  getRay () {
    return parseInt(this.container.getAttribute('r'))
  }

  render (state, dispatch) {
    const {
      animate,
      container
    } = this

    const id = this.container.id

    let firstOtherCircleFound

    state.circles.forEach((circle) => {
      if (id !== circle.id) {
        if (firstOtherCircleFound) return

        firstOtherCircleFound = circle
      }
    })

    let currentRay = this.getRay()

    const desiredRay = Math.round(this.distanceFrom(firstOtherCircleFound) / 2)

    if (desiredRay !== currentRay) {
      this.container.innerHTML='<animate attributeName="r" from="0" to="32" dur="2s" fill="freeze" />'
    }
  }
}

class Root extends Component {
  constructor (container, dispatch) {
    super(container, dispatch)

    this.component.a = new Circle(a, dispatch)
    this.component.b = new Circle(b, dispatch)
    this.component.c = new Circle(c, dispatch)
  }

  render (state, dispatch) {
    const { component } = this

    Object.keys(component).forEach(key => {
      component[key].render(state, dispatch)
    })
  }
}

function reducer (previousState, action) {
  const state = Object.assign({}, previousState)

  switch (action.type) {
    case 'EXPAND_CIRCLE':
      state.circles.forEach((circle, index) => {
        if (circle.id === action.id) {
          state.circles[index].r = action.r
        }
      })

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

    const root = new Root(document.querySelector('svg#background'), dispatch)

    render = root.render.bind(root)

    dispatch({ type: 'INIT' })
  }

}

window.addEventListener('load', app(initialState))
