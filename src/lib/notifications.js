import meowy from "../assets/meowy.svg";

export function newNotification(body, title) {
    const options = {
        body: body,
        icon: meowy
    };
    const notification = new Notification(title, options);
    return;
}