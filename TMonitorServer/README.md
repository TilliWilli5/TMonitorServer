# TMonitorServer
HOWTO
1. git clone https://github.com/TilliWilli5/TMonitorServer.git
2. cd TMonitorServer/TMonitorServer
3. npm install
4. Edit file _Static/JS/devmonitor.js line var sse = new EventSource("http://127.0.0.1/devmonitor/messages"); replace ip address to real server address

TODO

1. Affix with SIgnout option
2. При новой авторизации инфа о старой сессии должна удаляться из баззы
3. Сейчас не работает usid per session
4. Попробовать добавить еще одну инсталяцию в telemetry.json
5. При нажатии enter в последнем поле ввода на странице аутентификации необходимо делать валидацию

DONE
1. Кнопка Logout делает своё дело
2. Можно выбирать дату с помощью datepicker. Дефолтная дата выбрана сегодняшнейc
3. Показывается статистика в виде списков
4. На фронтенде все ()=> переписанны на function(){} - для поддежки аппл
5. К проекту прилепленны HighCharts и работают

IMPORTANT
1. Не использовать arrow functions на фронт-енде потому что сранный Аппл не поддерживает
