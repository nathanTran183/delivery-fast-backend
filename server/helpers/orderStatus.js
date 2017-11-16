/**
 * Created by phuct on 11/16/2017.
 */
var status = [
    {
        former: 'Order Submitted',
        latter: 'Processing',
        url: '/order/submitted/',
    },
    {
        former: 'Processing',
        latter: 'Confirmed',
        url: '',
    },
    {
        former: 'Processing',
        latter: 'Cancelled',
        url: '',
    },
    {
        former: 'Confirmed',
        latter: 'Assigned',
        msg: '',
        url: '',
    },
    {
        former: 'Assigned',
        latter: 'Picked',
        msg: 'Deliman has picked the package!',
        url: '',
    },
    {
        former: 'Picked',
        latter: 'Delivered',
        msg: 'Order has been delivered!',
        url: '',
    },
]