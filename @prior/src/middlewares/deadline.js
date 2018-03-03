import moment from 'moment'

export const closeAfterDeadline = (req, res, next) => {
  if (moment().isAfter('2018-11-13T00:00:00')) {
    return res.error({message: 'Registration is now closed'})
  }

  return next()
}
