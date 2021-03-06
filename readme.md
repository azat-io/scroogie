# Scroogie

![Deploy](https://github.com/azat-io/scroogie/workflows/Deploy/badge.svg)
![Test](https://github.com/azat-io/scroogie/workflows/Test/badge.svg)
[![GitHub issues](https://img.shields.io/github/issues/azat-io/scroogie?color=brightgreen)](https://github.com/azat-io/scroogie/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/azat-io/scroogie?color=brightgreen)](https://github.com/azat-io/scroogie/pulls)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/azat-io/scroogie?color=brightgreen)](https://github.com/azat-io/scroogie/blob/master/package.json)
[![License](https://img.shields.io/github/license/azat-io/scroogie?color=brightgreen)](https://github.com/azat-io/scroogie/blob/master/license)

<img src="https://user-images.githubusercontent.com/5698350/99881668-17897680-2c2c-11eb-8e9e-c0215bbbb973.jpg" align="right" width="300px" height="300px">

A telegram bot that helps to calculate the financial expenses of a family. Inspired by an article in [Tinkoff journal](https://journal.tinkoff.ru/spreadsheet/)

### Development

1. Install globally [localtunnel](https://github.com/localtunnel/localtunnel)

2. Run webhook server with `lt --port 4444 --subdomain scroogie-test`

3. Create PostgreSQL database for project

4. Create `.env` file at the root of the project with the following variables:

- `APP_URL` - url of the webserver, for example `https://scroogie-test.loca.lt`
- `APP_PORT` - port of webserver
- `DATABASE_HOST` - host of PostgreSQL database, for example `localhost`
- `DATABASE_NAME` - name of PostgreSQL database
- `DATABASE_USER` - user that has access to PostgreSQL database
- `DATABASE_PASSWORD` - password of the database
- `GIPHY_API_KEY` - API key for [Giphy](https://developers.giphy.com/docs/api/)
- `TELEGRAM_BOT_HELPER_TOKEN` - token of helper bot (for DB dumps)
- `TELEGRAM_BOT_HELPER_USER` - bot admin ID, for example `109470339`
- `TELEGRAM_BOT_TOKEN` - our bot token
- `TELEGRAM_USERS` - array of Telegram user ids

### Contributing

Pull requests are welcome.

### License

MIT © [Azat S.](https://azat.io)
