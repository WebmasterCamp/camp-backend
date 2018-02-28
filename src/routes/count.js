import { Router } from 'express'
import { User } from '../models'
import { respondResult } from '../utilities'
import moment from 'moment'

function compare(a, b) {
  if (a.date < b.date) {
    return -1
  }
  if (a.date > b.date) {
    return 1
  }
  return 0
}

const router = Router()
router.get('/', (req, res) => {
  console.log('============')
  res.send('countttt')
})

router.get('/completed', async (req, res) => {
  const users = await User.find({ status: { $nin: ['in progress', ''] } })
  const userDate = users.reduce((prev, cur) => {
    const date = moment(cur.updated_at).format('DD/MM/YYYY')
    if (cur.updated_at) {
      const isDateUpdated = prev.filter(d => d.date === date).length
      if (isDateUpdated === 0) {
        prev.push({
          date: date,
          count: 1,
        })
      } else {
        prev = prev.map(a => {
          if (a.date === date) {
            a.count++
          }
          return a
        })
      }
    }
    return prev
  }, [])
  respondResult(res)(userDate.sort(compare))
})
router.get('/facebook', async (req, res) => {
  const users = await User.find({})
  const wrongFacebook = []
  users.reduce((prev, curr) => {
    if (prev.filter(f => f === curr.facebook).length > 0) {
      wrongFacebook.push(curr.facebook)
    } else {
      prev.push(curr.facebook)
    }
    return prev
  }, [])

  respondResult(res)(wrongFacebook)
})

export default router
