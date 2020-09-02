/**
 *? Generate a "Ghost" block while content is loading
 * @property {ShadowRoot} root
 */
export default class Skeleton extends window.HTMLElement {
  constructor () {
    super()
    this.root = this.attachShadow({ mode: 'open' })
  }

  /**
  *? generate dimension by adding unit if necessary
  * @param {string} size
  * @param {boolean} fallbackTo100
  * @return {string}
  */
  createSize (size, fallbackTo100) {
    if (size) {
      if (size.match(/^[0-9]+$/)) {
        size = size + 'px'
      }
      return size
    } else if (fallbackTo100) {
      return '100%'
    }
    return 'auto'
  }

  connectedCallback () {
    const space = '\\00a0'
    const circle = this.hasAttribute('circle')
    const placeholder = this.getAttribute('placeholder') || space
    const width = this.createSize(this.getAttribute('width'), placeholder === space)
    let height = this.createSize(this.getAttribute('height'))
    if (circle) {
      height = width
    }
    const borderRadius = this.getAttribute('borderRadius')
    const rounded = this.hasAttribute('rounded')
    const lines = parseInt(this.getAttribute('lines') || 0, 10)

    let spans = '<span></span>'

    if (lines > 1) {
      for (let i = 1; i < lines; i++) {
        spans += '<span></span>'
      }
    }

    this.root.innerHTML = /* html */`
      <style>
        :host {
          display: block;
        }
        div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        span {
          position: relative;
          width: ${width};
          height: ${height};
          display: block;
          background-color: var(--skeleton, #0000001c);
          border-radius: ${borderRadius === null ? (rounded ? '10px' : (circle ? '50%' : '0px')) : borderRadius};
          overflow: hidden;
          transform: ${placeholder !== space || lines > 0 ? 'scale(1, .6)' : 'none'};
        }
        span::before {
          content: '${placeholder}';
          opacity: 0;
        }
        span::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          animation: waves 1.6s linear .5s infinite;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, var(--skeleton-wave, rgba(0,0,0,0.04)), transparent);
        }
        @keyframes waves {
          0% {
            transform: translateX(-100%);
          }
          60% {
            transform: translateX(100%);
          }
          100% {
            transform: translate(100%);
          }
        }
      </style>
      <div>
        ${spans}
      </div>
    `
  }
}
