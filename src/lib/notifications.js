import meowy from "../assets/meowy.svg";

export function requestPermission() {
    let notificationRequest = Notification.requestPermission();
}

export function newNotification(body, title) {
    const options = {
        body: body,
        icon: meowy
    };
    const notification = new Notification(title, options);
    return;
}