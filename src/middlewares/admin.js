import { respondErrors } from '../utilities'
import _ from 'lodash'

export const requireRoles = (...roles) => (req, res, next) => {
  const role = req.get('role')
  const username = req.get('username')
  if (_.includes(roles, role)) {
    req.admin = {
      username: username,
      role: role,
    }
    next()
  } else {
    respondErrors(res)({ code: 403, message: 'Forbidden' })
  }
}

export const permissions = {
  SuperAdmin: ['programming', 'marketing', 'content', 'design', 'all'],
  Supporter: 'NOT ALLOW',
  JudgeDev: 'programming',
  JudgeMarketing: 'marketing',
  JudgeContent: 'content',
  JudgeDesign: 'design',
}
export const requireMatchedMajor = (req, res, next) => {
  const role = req.get('role')
  if (_.includes(_.castArray(permissions[role]), req.query.major)) {
    next()
  } else {
    respondErrors(res)({ code: 403, message: 'Forbidden' })
  }
}

export const adminAuthorize = (req, res, next) => {
  const role = req.get('role')
  const username = req.get('username')
  req.admin = {
    username: username,
    role: role,
  }
  next()
}
