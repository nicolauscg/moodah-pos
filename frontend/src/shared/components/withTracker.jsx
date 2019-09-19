import ReactGA from 'react-ga'
import { lifecycle } from 'recompose'

const trackPage = (page, options) => {
  ReactGA.set({ page, ...options })
  ReactGA.pageview(page)
}

export default lifecycle({
  componentDidMount() {
    const page = this.props.location.pathname
    trackPage(page, this.props.trackOptions)
  },
})
