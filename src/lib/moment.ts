import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Manila');

const momentPH = (...args: Parameters<typeof moment>) => {
    return moment(...args).tz('Asia/Manila');
};

export default momentPH;
