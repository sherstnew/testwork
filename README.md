# testwork-frontend

## Очистка всех сессий

Команда удаляет все сессии из MongoDB, включая активные:

```sh
npm run sessions:clear
```

Для подключения используется `MONGODB_URI`. Если переменная не задана, используется `mongodb://localhost:27017/testwork`.
