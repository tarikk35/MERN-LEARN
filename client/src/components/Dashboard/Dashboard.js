import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import { getMyProfile } from "../../actions/profile";
import DashboardActions from "./DashboardActions";

const Dashboard = ({
  getMyProfile,
  auth: { user },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getMyProfile();
  }, []);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i>Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <DashboardActions />
      ) : (
        <Fragment>
          <p>You haven't created a profile yet.</p>
          <Link className="btn btn-primary my-1" to="/create-profile">
            Create one
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getMyProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getMyProfile })(Dashboard);
