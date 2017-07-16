export const respondErrors = (res) => (err, code) => {
  console.log(err);
  res.status(code || err.code || 500).send(err || { message: 'Internal Error' });
};

export const respondResult = (res) => (result) => (
  res.status(200).send(result)
);

export const respondSuccess = (res) => () => (
  res.status(200).send({ message: 'Success' })
);
