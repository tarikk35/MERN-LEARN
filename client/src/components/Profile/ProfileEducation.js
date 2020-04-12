import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileEducation = ({
  education: { school, from, to, degree, description, current, fieldofstudy }
}) => {
  return (
    <div>
      <h3 className="text-dark">{school}</h3>
      <p>
        <Moment format="DD/MM/YYYY" date={from} /> -{" "}
        {current || !to ? "Current" : <Moment format="DD/MM/YYYY" date={to} />}
      </p>
      <p>
        <strong>Degree </strong>
        {degree} - {fieldofstudy}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired
};

export default ProfileEducation;
