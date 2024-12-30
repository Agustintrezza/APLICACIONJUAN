import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PropTypes from 'prop-types';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);

  return isAuthenticated ? <Navigate to="/" /> : children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
