/**
 * Created by phuct on 11/16/2017.
 */
var status = [
    {
        former: 'Order Submitted',
        latter: 'Processing',
        msg: 'Order is in processing stage!',
        url: '/orders/processing/',
    },
    {
        former: 'Processing',
        latter: 'Confirmed',
        msg: "Order is confirmed!",
        url: '/orders/assigned/',
    },
    {
        former: 'Processing',
        latter: 'Cancelled',
        msg: "Order is cancelled!",
        url: '/orders/submitted',
    },

    {
        former: 'Assigned',
        latter: 'Picked',
        msg: 'Deliman picked the package!',
        url: '',
    },
    {
        former: 'Picked',
        latter: 'Delivered',
        msg: 'Order has been delivered!',
        url: '',
    },
];

module.exports = status;