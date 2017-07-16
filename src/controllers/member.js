import { respondResult, respondErrors } from '../utilities';
import Member from '../models/member';

export const result = async (req, res) => {
  try {
    const boys = await Member.find({ sex: 'ชาย' }).sort('-vote_count');
    const girls = await Member.find({ sex: 'หญิง' }).sort('-vote_count');
    const specials = await Member.find({}).sort('-vote_special');

    respondResult(res)({ boys, girls, specials });
  } catch (err) {
    respondErrors(res)(err);
  }
};

export const getVote = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error('id not found.');

    const member = await Member.findOne({ facebook: id });
    const { type } = req.params;

    if (type === 'boy' && member.voted_boy) throw new Error('already vote boy');
    if (type === 'girl' && member.voted_girl) throw new Error('already vote girl');

    let query = queryFromType(type);
    let sortQuery = sortQueryFromType(type);

    const members = await Member.find(query).sort(sortQuery);
    respondResult(res)(
      members.map(
        member => ({ facebook: member.facebook, nickName: member.nickName, picture: member.picture })
      )
    );
  } catch (err) {
    respondErrors(res)(err);
  }
};

export const postVoteBoy = async (req, res) => {
  try {
    const { voter_fb } = req.body;
    const voter = await Member.findOne({ facebook: voter_fb });
    const member = await Member.findOne({ facebook: req.body.facebook });

    if (!voter || !member) throw new Error('member not found');
    if (member.sex !== 'ชาย') throw new Error('this member is not a boy.');
    if (voter.voted_boy) throw new Error('already voted boy.');

    await voteMemberBoy(voter, member);

    respondResult(res)({ message: 'voted.' });
  } catch (err) {
    respondErrors(res)(err);
  }
};

export const postVoteGirl = async (req, res) => {
  try {
    const { voter_fb } = req.body;
    const voter = await Member.findOne({ facebook: voter_fb });
    const member = await Member.findOne({ facebook: req.body.facebook });

    if (!voter || !member) throw new Error('member not found');
    if (member.sex !== 'หญิง') throw new Error('this member is not a girl.');
    if (voter.voted_girl) throw new Error('already voted girl.');

    await voteMemberGirl(voter, member);

    respondResult(res)({ message: 'voted.' });
  } catch (err) {
    respondErrors(res)(err);
  }
};

export const postVoteSpecial = async (req, res) => {
  try {
    const { voter_fb } = req.body;
    const voter = await Member.findOne({ facebook: voter_fb });
    const member = await Member.findOne({ facebook: req.body.facebook });

    if (!voter || !member) throw new Error('member not found');
    if (voter.voted_special) throw new Error('already voted special.');
    await voteMemberSpecial(voter, member);

    respondResult(res)({ message: 'voted' });
  } catch (err) {
    respondErrors(res)(err);
  }
};

async function voteMemberBoy(voter, member) {
  voter.voted_boy = true;
  await voter.save();

  member.vote_count++;
  await member.save();
}

async function voteMemberGirl(voter, member) {
  voter.voted_girl = true;
  await voter.save();

  member.vote_count++;
  await member.save();
}

async function voteMemberSpecial(voter, member) {
  voter.voted_special = true;
  await voter.save();

  member.vote_special++;
  await member.save();
}

function queryFromType(type) {
  if (type === 'boy') return { sex: 'ชาย' };
  if (type === 'girl') return { sex: 'หญิง' };

  return {};
}

function sortQueryFromType(type) {
  if (type !== 'boy' && type !== 'girl') return '-vote_special';

  return '-vote_count';
}
