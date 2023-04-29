self.addEventListener('push', function (e) {
    var body;

    if (e.data) {
        body = JSON.parse(e.data.text());
    } else {
        body = 'Push message no payload';
    }

    var options = {
        body: body.body,
        icon: 'images/logo512.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
            postid: body.postid || null
        },
        actions: []
    };

    // switch (body.type) {
    //     case "newvolunteer":
    //         options.actions.push({
    //             action: 'openpost', title: 'Open Post',
    //             icon: 'images/posts.png'
    //         })
    //         break;
    // }

    options.actions.push({
        action: 'close', title: 'Clear',
        icon: 'images/close.png'
    })
    e.waitUntil(
        self.registration.showNotification(body.title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    switch (event.action) {
        case 'close':
            break;
        default:
            break;
    }
}, false);