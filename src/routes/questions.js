import { Router } from 'express'
import { User } from '../models'
import { requireRoles, requireMatchedMajor, permissions } from '../middlewares'
import {
  respondResult,
  respondErrors,
  filterSelectedFields,
} from '../utilities'
import _ from 'lodash'

const router = Router()

router.get('/', requireMatchedMajor, async (req, res) => {
  try {
    let major = req.query.major
    let status = req.query.status

    const users = await User.find(status === 'all' ? {} : { status }).populate(
      'questions',
    )
    const filterUsers = await users.filter(
      user =>
        user !== null && major === 'all'
          ? true
          : user.questions.major === major,
    )

    const filterQuestions = filterUsers.map(filterUser =>
      filterSelectedFields(filterUser, [
        'questions',
        'status',
        '_id',
        'firstName',
        'lastName',
        'academicYear',
        'no',
      ]),
    )
    respondResult(res)(filterQuestions)
  } catch (err) {
    respondErrors(res)(err)
  }
})

router.get(
  '/:id',
  requireRoles(
    'SuperAdmin',
    'Supporter',
    'JudgeDev',
    'JudgeMarketing',
    'JudgeContent',
    'JudgeDesign',
  ),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('questions')
      if (_.includes(permissions[req.admin.role], user.questions.major)) {
        const filterUser = filterSelectedFields(user, [
          'no',
          'facebook',
          'questions',
          'status',
          'event',
          'portfolio',
          'prominentPoint',
          'whyJoinYwc',
          'academicYear',
          'firstName',
          'lastName',
          '_id',
          'university',
        ])
        respondResult(res)(filterUser)
      } else {
        respondErrors(res)({ message: 'Forbidden' }, 403)
      }
    } catch (err) {
      respondErrors(res)(err)
    }
  },
)

router.put(
  '/:id',
  requireRoles(
    'SuperAdmin',
    'Supporter',
    'JudgeDev',
    'JudgeMarketing',
    'JudgeContent',
    'JudgeDesign',
  ),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('questions')
      if (_.includes(permissions[req.admin.role], user.questions.major)) {
        // const updatedQuestion = _.merge(user.toObject(), req.body);
        // const result = await Question.findByIdAndUpdate(req.params.id, updatedQuestion);
        // const user = await User.findOne({ questions: req.params.id });
        user.status = req.body.status
        await user.save()
        respondResult(res)(user)
      } else {
        respondErrors(res)({ message: 'Forbidden' }, 403)
      }
    } catch (err) {
      respondErrors(res)(err)
    }
  },
)

export default router
