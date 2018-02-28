import { User, Slip } from '../models'
import { respondResult, respondErrors, respondSuccess } from '../utilities'
import _ from 'lodash'

export const announce = async (req, res) => {
  try {
    let users = {
      content: [],
      design: [],
      marketing: [],
      programming: [],
    }

    const interviewUsers = await User.find({ status: 'interview1' })
      .populate('questions', 'major')
      .sort([['firstName', 1]])
      .select('no title firstName lastName questions')

    const moveUsers = []
    const noMove = ['CT021']
    interviewUsers.map(user => {
      if (_.includes(noMove, user.no)) {
        moveUsers.push(user)
      } else {
        users[user.questions.major].push({
          no: user.no,
          fullname: `${user.title}${user.firstName} ${user.lastName}`,
          major: user.questions.major,
        })
      }

      return user
    })

    moveUsers.map(user => {
      users[user.questions.major].push({
        no: user.no,
        fullname: `${user.title}${user.firstName} ${user.lastName}`,
        major: user.questions.major,
      })
      return user
    })

    users.content = users.content.filter((u, index) => {
      u.firstInAfternoon = isFirstInAfternoon(u.major, index)
      return u
    })

    users.design = users.design.filter((u, index) => {
      u.firstInAfternoon = isFirstInAfternoon(u.major, index)
      return u
    })

    users.marketing = users.marketing.filter((u, index) => {
      u.firstInAfternoon = isFirstInAfternoon(u.major, index)
      return u
    })

    users.programming = users.programming.filter((u, index) => {
      u.firstInAfternoon = isFirstInAfternoon(u.major, index)
      return u
    })

    respondResult(res)({ announce: users })
  } catch (err) {
    respondErrors(res)(err)
  }
}

function isFirstInAfternoon(major, index) {
  if (major === 'content' && index === 29) {
    return true
  } else if (major === 'design' && index === 25) {
    return true
  } else if (major === 'marketing' && index === 50) {
    return true
  } else if (major === 'programming' && index === 30) {
    return true
  }

  return false
}

export const confirm = async (req, res) => {
  try {
    const { major } = req.body
    const slip = new Slip()
    slip.major = major
    slip.name = (req.file || {}).path
    slip.status = 'waiting'
    slip.save()
    respondSuccess(res)()
  } catch (err) {
    respondErrors(res)(err)
  }
}
