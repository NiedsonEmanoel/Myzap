import { NotificationManager } from 'react-notifications';

const createNotification = (type, message, title, timeOut, callback, priority) => {
    if (!timeOut)
        timeOut = 3000;
    return () => {
        switch (type) {
            case 'info':
                NotificationManager.info(message);
                break;
            case 'success':
                NotificationManager.success(message, title, timeOut, callback, priority);
                break;
            case 'warning':
                NotificationManager.warning(message, title, timeOut, callback, priority);
                break;
            case 'error':
                NotificationManager.error(message, title, timeOut, callback, priority);
                break;
        }
    };
};


export default createNotification
