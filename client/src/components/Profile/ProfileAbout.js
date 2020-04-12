import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name }
  }
}) => {
  return (
    <div className="profile-about bg-light p-2">
      {bio && (
        <Fragment>
          <h2 className="text-primary">
            {name.trim().split(" ")[0]}'
            {name
              .trim()
              .split(" ")[0]
              .slice(-1) === "s"
              ? ""
              : "s"}{" "}
            Bio
          </h2>
          <p>{bio}</p>
        </Fragment>
      )}
      {skills && skills.slice(0, skills.length).length > 0 && (
        <Fragment>
          <div className="line"></div>
          <h2 className="text-primary">Skill Set</h2>
          <div className="skills">
            {skills.slice(0, skills.length).map((skill, index) => (
              <div key={index} className="p-1">
                <i className="fa fa-check"></i> {skill}
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
