import _ from 'lodash';

export const filterSelectedFields = (data = {}, selectedFields = []) => {
  return _.map(selectedFields, (key) => (
    { [key]: data[key] }
  )).reduce((prev, cur) => _.merge(prev, cur), {});
};
