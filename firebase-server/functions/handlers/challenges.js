const { db, admin } = require('../util/admin.js');
const { validateGoals, validateNewValue } = require('../util/validators');

//Get all challenges
exports.getAllChallenges = (req, res) => {
    db.collection('challenges').orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let challenges = [];
            data.forEach((doc) => {
                challenges.push({
                    challengeId: doc.id,
                    name: doc.data().name,
                    goal: doc.data().goal,
                    description: doc.data().description,
                    participants: doc.data().participants,
                    participantList: doc.data().participantList,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(challenges);
        })
        .catch(err => console.error(err));
}

//Post one challenge
exports.postOneChallenge = (req, res) => {
    const newChallenge = {
        name: req.body.name,
        goal: req.body.goal,
        description: req.body.description,
        participants: req.body.participants,
        participantList: req.body.participantList,
        createdAt: new Date().toISOString()
    };

    const { valid, errors } = validateGoals(newChallenge);

    if (!valid) return res.status(400).json(errors);

    db
        .collection('challenges')
        .add(newChallenge)
        .then((doc) => {
            const resChallenge = newChallenge;
            resChallenge.challengeId = doc.id;
            res.json(resChallenge);
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        })
}

//Get one challenge
exports.getChallenge = (req, res) => {
    let challengeData = {};
    db.doc(`/challenges/${req.params.challengeId}`).get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Challenge not found' })
            }
            challengeData = doc.data();
            challengeData.challengeId = doc.id;
            return res.json(challengeData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

//Update challenge
exports.updateChallenge = (req, res) => {
    var uid = req.body.uid;
    var newValue = req.body.newValue;
    var inputValue = req.body.inputValue;

    const { valid, errors } = validateNewValue(newValue, inputValue);

    if (!valid) return res.status(400).json(errors);

    var currentUpdate = {};
    currentUpdate[`participants.${uid}.current`] = newValue;
    currentUpdate[`participants.${uid}.total`] = admin.firestore.FieldValue.increment(inputValue);
    db.collection('challenges').doc(req.params.challengeId).update(currentUpdate)
        .then(() => {
            return res.json(currentUpdate)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err.code });
        })
}

//Update star count
exports.updateStar = (req, res) => {
    var uid = req.body.uid;
    var currentUpdate = {};
    currentUpdate[`participants.${uid}.completed`] = admin.firestore.FieldValue.increment(1);
    db.collection('challenges').doc(req.params.challengeId).update(currentUpdate)
        .then(() => {
            return res.json(currentUpdate)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err.code });
        })
}

//Update time
exports.updateTime = (req, res) => {
    var uid = req.body.uid;
    var time = req.body.time;
    var currentUpdate = {};
    currentUpdate[`participants.${uid}.lastUpdate`] = time;
    db.collection('challenges').doc(req.params.challengeId).update(currentUpdate)
        .then(() => {
            return res.json(currentUpdate)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err.code });
        })
}