# testwork-frontend

---

## Очистка просроченных сессий (cron)

Для автоматической очистки просроченных сессий из БД используйте скрипт:

```
node scripts/cleanupSessions.ts
```

Запланируйте выполнение команды раз в день через планировщик задач (cron/Task Scheduler), например:

**Linux cron:**
```
0 1 * * * cd /path/to/project && /usr/bin/node scripts/cleanupSessions.ts >> cronlog.txt 2>&1
```

**Windows (Task Scheduler):**
- Создайте задачу, которая ежедневно вызывает: `node C:\path\to\project\scripts\cleanupSessions.ts`