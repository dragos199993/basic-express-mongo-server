import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchProfiles } from '../../store/actions/profiles';
import {
  Card, Button, CardHeader, CardFooter, CardBody,
  CardTitle, CardText
} from 'reactstrap';
import { Link } from 'react-router-dom';

class UsersPage extends Component {

  componentDidMount() {
    this.props.fetchProfiles();
  }



  render() {
    let profiles = null;
    if (this.props.profiles) {
      profiles = this.props.profiles.map(profile =>
        <div className="col-sm-4 mt-3"  key={profile._id}>
          <Card>
            <CardHeader>{profile.user.name}</CardHeader>
            <CardBody>
              <CardTitle>{profile.company}</CardTitle>
              <CardText>{profile.bio}</CardText>
              <Link to={`/profile/${profile.handle}`}><Button>Visit profile</Button></Link>
            </CardBody>
            <CardFooter>From: <b>{profile.location}</b></CardFooter>
          </Card>
        </div>
      )
    }
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="row">
            {profiles}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    profiles: state.profilesReducer.profiles
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchProfiles: () => dispatch(fetchProfiles())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
