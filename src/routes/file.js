import { Router } from 'express';
import pdf from 'html-pdf';

import { User } from '../models';
import { adminAuthen } from '../middlewares/authenticator';
import { majorAsText } from '../utilities/helpers';

const router = Router();

const pdfOption = {
  format: 'A4'
};

const generatePdf = user => `
<html>
<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.0/css/bulma.min.css" />
  <link href="https://fonts.googleapis.com/css?family=Trirong:400,700" rel="stylesheet">
</head>
<body>
  <div>
    <img class="user-img" src="https://api.ywc15.ywc.in.th/${user.picture}" />
    <h1>${user.title}${user.firstName} ${user.lastName} (น้อง${user.nickname})</h1>
    <h2><b>สาขา:</b> ${majorAsText(user.major)}</h2>
  </div>
  <div>
    <h1 class="title">การศึกษา</h1>
    <p><b>ชั้นปี:</b> ${user.academicYear}</p>
    <p><b>คณะ:</b> ${user.faculty}</p>
    <p><b>สาขาวิชา:</b> ${user.department}</p>
    <p><b>สถาบัน:</b> ${user.university}</p>
  </div>
  <style>
    body {
      font-family: 'Trirong', serif !important;
      padding: 30px 20px;
      font-size: 12px;
    }
    .user-img { width: 200px; }
    .title { font-size: 16px; margin-bottom: 7px !important; }
  </style>
</body>
</html>
  
`;

router.get('/interview/:id', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      status: 'completed',
      isPassStageOne: true,
      isPassStageTwo: true,
      isPassStageThree: true
    })
    .populate('questions');
    if (!user) return res.error('Not an interview member or User not found');
    pdf.create(generatePdf(user), pdfOption).toStream((err, stream) => {
      if (err) return res.error(err);
      res.attachment('test.pdf');
      return stream.pipe(res);
      // return res.download(buffer);
    });
  } catch (e) {
    return res.error(e);
  }
});

export default router;
