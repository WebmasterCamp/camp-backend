import {Router} from 'express'
import {authen} from '../middlewares/authenticator'
import {
  validateRegistrationStep,
  majorQuestionValidator,
} from '../middlewares/validator'
import {User, Question} from '../models'
import {singleUpload} from '../middlewares'
import {closeAfterDeadline} from '../middlewares/deadline'

const updateRegisterStep = async (id, step) => {
  const user = await User.findOne({_id: id})
  user.completed[step - 1] = true
  user.markModified('completed')
  return user.save()
}

const router = Router()

// HACK: Forgive me for my sins
const _id = '5a9a35bd6f40105594487d1b'

// STEP 1: Personal Info
router.put(
  '/step1',
  closeAfterDeadline,
  authen('in progress'),
  singleUpload('profilePic', 'jpg', 'png', 'jpeg'),
  validateRegistrationStep[0],
  async (req, res) => {
    try {
      // const _id = '5a9a35bd6f40105594487d1b'
      // const {_id} = req.user
      const user = await User.findOne({_id})
      const fields = [
        'title',
        'firstName',
        'lastName',
        'firstNameEN',
        'lastNameEN',
        'nickname',
        'faculty',
        'department',
        'academicYear',
        'university',
        'sex',
        'birthdate',
        'religion',
        'blood',
      ]
      fields.forEach(field => {
        user[field] = req.body[field]
      })
      if (req.file) {
        user.picture = req.file.path
      } else if (!req.file && !user.picture) {
        return res.status(400).send({code: 400, message: 'require file'})
      }
      // user.picture = (req.file || {}).path;
      await Promise.all([user.save(), updateRegisterStep(_id, 1)])
      return res.send({success: true})
    } catch (e) {
      return res.error(e)
    }
  },
)

// STEP 2: Contact Info and etc.
router.put(
  '/step2',
  closeAfterDeadline,
  authen('in progress'),
  validateRegistrationStep[1],
  async (req, res) => {
    try {
      // const _id = '5a9a35bd6f40105594487d1b'
      // const {_id} = req.user
      const user = await User.findOne({_id})
      const fields = [
        'address',
        'province',
        'postalCode',
        'email',
        'phone',
        'emergencyPhone',
        'emergencyPhoneRelated',
        'emergencyName',
        'shirtSize',
        'food',
        'disease',
        'med',
        'foodAllergy',
        'medAllergy',
        'skype',
      ]
      fields.forEach(field => {
        user[field] = req.body[field]
      })
      await Promise.all([user.save(), updateRegisterStep(_id, 2)])
      return res.send({success: true})
    } catch (e) {
      return res.error(e)
    }
  },
)

// STEP 3: Portfolio and How did you know YWC?
router.put(
  '/step3',
  closeAfterDeadline,
  authen('in progress'),
  validateRegistrationStep[2],
  async (req, res) => {
    try {
      // HACK: Experimenting with Backend
      // const _id = '5a9a35bd6f40105594487d1b'
      // const {_id} = req.user
      const user = await User.findOne({_id})
      const fields = ['knowCamp', 'activities']
      fields.forEach(field => {
        user[field] = req.body[field]
      })
      await Promise.all([user.save(), updateRegisterStep(_id, 3)])
      return res.send({success: true})
    } catch (e) {
      return res.error(e)
    }
  },
)

// STEP 4: General Question
router.put(
  '/step4',
  closeAfterDeadline,
  authen('in progress'),
  validateRegistrationStep[3],
  async (req, res) => {
    try {
      // TO CHECK: If role as affect on general question -> check role
      const {answers} = req.body
      // const {_id} = req.user
      const user = await User.findOne({_id}).select('questions')
      console.log('User', user)

      const questions = await Question.findOne({_id: user.questions})
      console.log('Questions', questions)

      questions.generalQuestions = answers.map(answer => ({answer}))
      await Promise.all([questions.save(), updateRegisterStep(_id, 4)])
      return res.send({success: true})
    } catch (e) {
      return res.error(e)
    }
  },
)

// STEP 5: Major Question
router.put(
  '/step5',
  closeAfterDeadline,
  authen('in progress'),
  singleUpload('file', 'pdf'),
  validateRegistrationStep[4],
  majorQuestionValidator,
  async (req, res) => {
    try {
      const {answers, major} = req.body
      // const {_id} = req.user
      const user = await User.findOne({_id}).select('questions')
      const question = await Question.findOne({_id: user.questions})
      if (major === 'design') {
        question.specialQuestions[major] = [
          {answer: answers[0]},
          {answer: answers[1]},
          {answer: answers[2]},
        ]
        if (req.file) {
          user.designPortfolio = req.file.path
        }
      } else {
        question.specialQuestions[major] = answers.map(answer => ({answer}))
      }
      if (question.completedMajor.indexOf(major) === -1) {
        question.completedMajor.push(major)
      }
      await Promise.all([
        question.save(),
        user.save(),
        updateRegisterStep(_id, 5),
      ])
      return res.send({success: true})
    } catch (e) {
      return res.error(e)
    }
  },
)

router.post(
  '/confirm',
  closeAfterDeadline,
  authen('in progress'),
  async (req, res) => {
    try {
      // const {_id} = req.user
      const user = await User.findOne({_id}).populate('questions')
      if (user.completed.filter(isDone => !isDone).length !== 0) {
        return res.error('Non completed registration form.')
      }
      const {major} = req.body
      if (user.questions.completedMajor.indexOf(major) === -1) {
        return res.error('You did not completed major questions yet.')
      }
      const majorSpecialQuestions = user.questions.specialQuestions[major]
      const question = await Question.findOne({_id: user.questions._id})
      question.specialQuestions = {
        [major]: majorSpecialQuestions,
      }
      question.confirmedMajor = major
      user.status = 'completed'
      user.major = req.body.major
      user.completed_at = new Date()
      await Promise.all([user.save(), question.save()])
      return res.send({success: true})
    } catch (e) {
      return res.error(e)
    }
  },
)

export default router
