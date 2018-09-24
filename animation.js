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
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
}

function normalize (vector) {
  const norm = distance(vector, { x : 0, y: 0 })

  return {
    x: vector.x / norm,
    y: vector.y / norm
  }
}

function invert (inversionCircle, inputCircle) {
  // Draw a line that pass through the centers of inversionCircle and inputCircle.
  // Get the points of inputCircle that intersect the line, say them `a` and `b`.

  const vector = normalize({ x: inputCircle.x - inversionCircle.x, y: inputCircle.y - inversionCircle.y })

  const a = {
    x: inputCircle.x + inputCircle.r * vector.x,
    y: inputCircle.y + inputCircle.r * vector.y
  }

  const b = {
    x: inputCircle.x - inputCircle.r * vector.x,
    y: inputCircle.y - inputCircle.r * vector.y
  }

  // Compute distances from inversionCircle center then invert them.
  const distanceA = distance(inversionCircle, a)
  const distanceB = distance(inversionCircle, b)

  const invertedDistanceA = inputCircle.r * inputCircle.r / distanceA
  const invertedDistanceB = inputCircle.r * inputCircle.r / distanceB

  // Now it can be calculated the ray and its distance from inversionCircle.
  const r = Math.abs(invertedDistanceB - invertedDistanceA) / 2
  const distanceC = Math.min(distanceA, distanceB) + r

  const outputCircle = {
    x: inversionCircle.x + distanceC * vector.x,
    y: inversionCircle.y + distanceC * vector.y,
    r
  }

  return outputCircle
}

const circle1 = {
  x: 100 + Math.floor(Math.random() * 100),
  y: 100 + Math.floor(Math.random() * 100),
  r: 50  + Math.floor(Math.random() * 40)
}

const circle2 = {
  x: 250 + Math.floor(Math.random() * 100),
  y: 250 + Math.floor(Math.random() * 100)
}

circle2.r = distance(circle1, circle2) - circle1.r

// This vector goes from center of circle1 to center of circle2.
const vector = normalize({ x: circle2.x - circle1.x, y: circle2.y - circle1.y })

// This is the tangent point of circle1 and circle2.
const tangentPoint = {
  x: circle1.x + circle1.r * vector.x,
  y: circle1.y + circle1.r * vector.y
}

// Draw a circle centered at the `tangentPoint` and with radius equal the
// minimum radius among circle1 and circle2. Draw the two parallel lines that
// pass through the intersection of this circle and circles 1 and 2.
//
// Those two parallel lines are the image circle1 and circle2 if we invert
// respect of the circle we draw. Any circle inscribed in that strip is the
// image, respect of the inversion above, of a circle3 tangent to circle1 and circle2.
//
// To get a center of such a circle we can move perpendicular to vector.
//
// It is used the minimum radius to avoid tangent circle3 containing circle1 and circle2.
//
// Note that the inversion circle forms a Vescica Piscis with one of the first two circles created.

// Given a circle with ray R adnd a circle with center on its circumference and with ray r,
// consider the triangle that joins the centers and one of the tangent points.
// As usual, consider R >= r.
// Draw the segment that joins the tangent points.
// The distance of that segment to the center of the smaller circle is x.
// Since there is an isosceles triangle, after drawing its minor height which cut
// the side R on x, using Pitagora's theorem it result that
//
//     R^2 - (R - x)^2 = r^2 - x^2
//
// which implies that
//
//     x = r^2 / (2 * R)
//
// Note that when r = R, then x = r/2
//
// So the strip of parallel lines that are the image of the two circles inverted
// on the circle that has center in their tangent points and ray equal to the
// smallest circle, has height equal x plus r/2. A circle in that strip is the
// image of a circle tanget to both given circles. Hence the ray of that inverted
// circle is half of that strip, that is
//
//     (r^2/2R + r/2)/2 = r(1 + R)/4R

const minR = Math.min(circle1.r, circle2.r)
const maxR = Math.max(circle1.r, circle2.r)

const invertedCircle3 = {
  x: tangentPoint.x - vector.y * minR,
  y: tangentPoint.y + vector.x * minR,
  r: minR * (1 + maxR) / (4 * maxR)
}

const inversionCircle = {
  x: tangentPoint.x,
  y: tangentPoint.y,
  r: minR
}

const circle3 = invert(inversionCircle, invertedCircle3)

const timeline = [
  {
    type: 'CREATE_CIRCLE',
    begin: 1,
    circle: circle1
  },
  {
    type: 'CREATE_CIRCLE',
    begin: 2,
    circle: circle2
  },
  {
    type: 'CREATE_CIRCLE',
    begin: 3,
    circle: inversionCircle
  },
  {
    type: 'CREATE_CIRCLE',
    begin: 3,
    circle: invertedCircle3
  },
  {
    type: 'CREATE_CIRCLE',
    begin: 3,
    circle: circle3
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

    const { begin, r, x, y } = state

    if (r !== this.r) {
      this.r = r
      container.innerHTML = `<animate attributeName="r" from="0" to="${r}" begin="${begin}s" dur="1s" fill="freeze" />`
    }

    if (x !== this.x) {
      this.x = x
      container.setAttribute('cx', x)
    }

    if (y !== this.y) {
      this.y = y
      container.setAttribute('cy', y)
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
