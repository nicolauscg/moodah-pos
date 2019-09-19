import { connect } from 'react-redux'
import { compose, withHandlers } from 'recompose'
import { withCookies } from 'react-cookie'
import { propOr } from 'ramda'

export default compose(
  withCookies,
  connect(state => ({
    userState: state.auth.userState,
  })),
  withHandlers({
    getUserId: ({ userState }) => () => propOr('', 'userId', userState),
  }),
  withHandlers({
    getUserTourCookie: ({ getUserId, cookies }) => () => {
      const userTourCookie = cookies.get(getUserId())

      return userTourCookie ? userTourCookie : {}
    },
  })
)
