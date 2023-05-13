const morgan = require('morgan');
const { format } = require('date-fns');

const customFormat =
  ':remote-addr - :remote-user [:date[Asia/Seoul]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

morgan.token('date', (req, res, tz) => {
  return format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timezone: 'GMT-9' });
});

morgan.format('customFormat', customFormat);
