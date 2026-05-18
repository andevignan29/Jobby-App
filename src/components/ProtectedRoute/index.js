import {Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = props => {
  const {component: Component, render, ...rest} = props
  const token = Cookies.get('jwt_token')

  if (!token) return <Redirect to="/login" />

  if (render) return <Route {...rest} render={render} />

  return <Route {...rest} render={p => <Component {...p} />} />
}

export default ProtectedRoute
