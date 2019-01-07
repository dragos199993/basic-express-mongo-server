import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { fetchSingleProfile, resetSingleProfile } from '../../../store/actions/profiles';
import {
    Card, Button, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap';
import { withRouter, Link } from 'react-router-dom';
import './SingleUserPage.scss';
class UsersPage extends PureComponent {

    componentDidMount() {
        this.props.fetchSingleProfile(this.props.match.params.user);
    }
    componentWillUnmount() {
        this.props.resetSingleProfile();
    }
    render() {
        let { profile } = this.props;
        if (profile && profile.user) {
            return (
                <div className="row">
                    <div className="mt-5 col-sm-8 offset-sm-2 single-user-page">
                        <Card>
                            <CardHeader>{profile.user.name} <Link to="/users"><Button>Go back</Button></Link></CardHeader>
                            <CardBody>
                                <CardTitle>{profile.company}</CardTitle>
                                <CardText>{profile.bio}</CardText>
                            </CardBody>
                            <CardFooter>From: <b>{profile.location}</b></CardFooter>
                        </Card>
                    </div>
                </div>
            )
        }
        return null
    }
}

const mapStateToProps = state => {
    return {
        profile: state.profilesReducer.currentProfile
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchSingleProfile: profile => dispatch(fetchSingleProfile(profile)),
        resetSingleProfile: () => dispatch(resetSingleProfile())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UsersPage));
