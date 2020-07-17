import React, { Component, Fragment } from 'react';
//Material UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


//Redux
import { connect } from 'react-redux';
import { addChallenge } from '../redux/actions/userActions';
import PropTypes from 'prop-types';

const styles = {
    mainDiv: {
        display: 'flex',
        flexDirection: 'column'
    },
    secondDiv: {
        position: 'relative',
        textAlign: 'center'
    },
    challengeHeader: {
        marginTop: '0px',
        marginBottom: '10px',
    },
    form: {
        width: '300px',
        margin: 'auto'
    },
    challengeText: {
        marginTop: '5px',

    },
    challengeButton: {
        margin: '25px',
    },
    addChallengersDiv: {
        margin: '10px',
        marginBottom: '15px',
        padding: '15px',
        boxSizing: 'border-block',
        backgroundColor: 'white',
        borderRadius: '5px',
        overflowX: 'hidden',
        overflowY: 'scroll',
        textAlign: 'center',
        maxHeight: '135px'
    },
    noFriends: {
        margin: 'auto'
    },
    addParticipants: {
        textAlign: 'center',
    },
    header: {
        marginTop: '20px',
        marginBottom: '0px'
    },
    friendRender: {
        height: '50px',
        position: 'relative',
        textAlign: 'left'
    },
    friendHandle: {
        marginTop: '-30px',
        paddingLeft: '60px',
    },
    check: {
        color: 'green',
        position: 'absolute',
        right: '0px',
        bottom: '6px',
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
};

export class create extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            goal: '',
            description: '',
            participants: {},
            participantList: [],
            errors: {}
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({ errors: nextProps.UI.errors });
        }
    };
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    addParticipant = (friendData) => {
        const { handle, uid, imageUrl, current } = friendData;
        this.state.participants[uid] = { handle, current, imageUrl };
        this.setState({
            participantList: [...this.state.participantList, handle]
        })
    }
    handleSubmit = (ownData) => {
        const { handle, uid, imageUrl, current } = ownData;
        this.state.participants[uid] = { handle, current, imageUrl };
        const userDetails = {
            name: this.state.name,
            goal: this.state.goal,
            description: this.state.description,
            participants: this.state.participants,
            participantList: [...this.state.participantList, handle],
        };
        this.props.addChallenge(userDetails, this.props.history);
        this.setState({
            name: '',
            goal: '',
            description: '',
            participants: {},
            participantList: []
        })
    }

    render() {
        const { handle, userId, imageUrl } = this.props.credentials;
        const { friends } = this.props.user;
        const { classes } = this.props;
        const { errors } = this.state;

        var ownData = {
            handle,
            uid: userId,
            imageUrl: imageUrl,
            current: 0
        }

        return (
            <Fragment>
                <div className={classes.mainDiv}>
                    <div className={classes.secondDiv}>
                        <h1 className={classes.challengeHeader}>Add a new challenge:</h1>

                        <Grid container direction={"column"} className={classes.form} spacing={1}>
                            <Grid item>
                                <TextField
                                    className={classes.challengeText}
                                    name="name"
                                    type="name"
                                    label="Challenge name"
                                    rows="1"
                                    placeholder="Pushups"
                                    variant="outlined"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                    fullWidth
                                    helperText={errors.name}
                                    error={errors.name}
                                >
                                </TextField>
                            </Grid>
                            <Grid item>
                                <TextField
                                    name="goal"
                                    type="goal"
                                    label="Goal"
                                    rows="1"
                                    placeholder="100"
                                    variant="outlined"
                                    value={this.state.goal}
                                    onChange={this.handleChange}
                                    fullWidth
                                    helperText={errors.goal}
                                    error={errors.goal}
                                >
                                </TextField>
                            </Grid>
                            <Grid item>
                                <TextField
                                    name="description"
                                    type="description"
                                    label="Description"
                                    multiline
                                    rows="2"
                                    placeholder="Do 100 pushups everyday!"
                                    variant="outlined"
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    fullWidth
                                    helperText={errors.description}
                                    error={errors.description}
                                >
                                </TextField>
                            </Grid>
                        </Grid>
                        <div className={classes.addParticipants}>
                            <h3 className={classes.header}>Add participants</h3>
                            <div className={classes.addChallengersDiv}>
                                {friends.length > 0 ?
                                    (friends ? (friends.map(friend => {
                                        const friendData = {
                                            handle: friend.handle,
                                            uid: friend.userId,
                                            imageUrl: friend.imageUrl,
                                            current: 0
                                        }
                                        return <div className={classes.friendRender}>
                                            <Avatar alt={friend.handle} src={friend.imageUrl} ></Avatar>
                                            <div className={classes.friendHandle}>{friend.handle}
                                                <Checkbox
                                                    onClick={event => { event.preventDefault(); this.addParticipant(friendData) }}
                                                    // value="checkedA"
                                                    // inputProps={{ 'aria-label': 'Checkbox A' }}
                                                    color='green'
                                                    className={classes.check}
                                                /></div>
                                        </div>
                                    }
                                    )) : <p>Loading...</p>) : (<p className={classes.noFriends}>No friends yet... &#128546;</p>)
                                }

                                {/* {friendsList} */}
                            </div>
                        </div>

                        <Button onClick={event => { event.preventDefault(); this.handleSubmit(ownData) }} variant="contained" color="secondary">
                            Create
                        </Button>
                    </div>
                </div>


            </Fragment>
        )
    }
}

create.propTypes = {
    addChallenge: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    credentials: state.user.credentials,
    user: state.user,
    UI: state.UI
});

export default connect(
    mapStateToProps,
    { addChallenge }
)(withStyles(styles)(create));

