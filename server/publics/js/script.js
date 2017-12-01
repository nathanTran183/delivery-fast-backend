$.validator.addMethod("greaterThan",
    function (value, element, params) {

        if (!/Invalid|NaN/.test(new Date(value))) {
            return new Date(value) > new Date($(params).val());
        }

        return isNaN(value) && isNaN($(params).val())
            || (Number(value) > Number($(params).val()));
    }, 'Must be greater than {0}.');
$.validator.addMethod('minStrict', function (value, el, param) {
    return value > param;
});
$(document).ready(function () {
    $(".datepicker").datepicker({
        changeMonth: true,
        changeYear: true
    });

    var tableListUsers = $('#tableListUsers').DataTable();
    var tableListStoreTypes = $('#tableListStoreTypes').DataTable();
    $('#tableListProducts').DataTable();
    $("#tableListProductAddons").DataTable();
    $("#tableListAddons").DataTable();
    $("#tableListDiscounts").DataTable();
    var tableListSubmittedOrders = $("#tableListSubmittedOrders").DataTable({
        "order": [],
        "ajax": {
            url: '/orders/submittedJSON',
            type: 'GET',
            dataSrc: 'data.orders'
        },
        "columns": [
            {'data': 'id', 'orderable': false},
            {'data': 'user_name'},
            {'data': 'user_phone'},
            {'data': 'user_address'},
            {
                "data": "order_date",
                "render": function (data) {
                    let date = new Date(data);
                    return date.toLocaleString()
                }
            },
            {
                "data": "delivery_date",
                "render": function (data) {
                    let date = new Date(data);
                    return date.toLocaleString()
                }
            },
            {'data': 'ship_fee'},
            {'data': 'total_amount'},
            {
                'data': 'id',
                'orderable': false,
                'render': function (data) {
                    return "<a href='#' data-toggle='modal' data-id='" + data + "' title='Process' class='confirmProcessOrder btn btn-primary btn-flat'><span class='fa fa-edit' aria-hidden='true'></span></a>";
                },
            },
        ],
        "drawCallback": function (settings, json) {
            $('.confirmProcessOrder').click(function (event) {
                $('#form-process-order').attr('action', "/orders/" + $(this).data('id'));
                $('#confirm-process-order').modal();
            });
        }
    });
    $('#tableListOrderHistory').DataTable({
        "ajax": {
            url: '/orders/historyJSON',
            type: 'GET',
            dataSrc: 'data.orders'
        },
        "order": [],
        "columns": [
            {'data': 'id', 'orderable': false},
            {'data': 'user_name'},
            {
                'data': 'deliMan',
                'render': function (data) {
                    if (data == "" || data == null) {
                        return "";
                    }
                    else return data.first_name + " " + data.last_name;
                }
            },
            {
                "data": "order_date",
                "render": function (data) {
                    let date = new Date(data);
                    return date.toLocaleString()
                }
            },
            {
                "data": "delivery_date",
                "render": function (data) {
                    let date = new Date(data);
                    return date.toLocaleString()
                }
            },
            {'data': 'ship_fee'},
            {'data': 'total_amount'},
            {
                'orderable': false,
                'data': 'status',
                'render': function (data) {
                    switch (data) {
                        case "Cancelled":
                            return '<span class="label label-danger">' + data + '</span>';
                        // break;
                        case "Delivered":
                            return '<span class="label label-success">' + data + '</span>';
                        // break;
                        case "Picked":
                            return '<span class="label label-info">' + data + '</span>';
                        // break;
                        case "Assigned":
                            return '<span class="label label-warning">' + data + '</span>';
                        // break;
                    }
                }
            },
            {
                'data': 'id',
                'orderable': false,
                'render': function (data) {
                    return "<a href='/orders/" + data + "' title='View Detail' class='btn btn-primary btn-flat'><span class='fa fa-search' aria-hidden='true'></span></a>";
                },
            },
        ],
    });

    var tableListProcessingOrders = $('#tableListProcessingOrders').DataTable({
        "ajax": {
            url: '/orders/processingJSON',
            type: 'GET',
            dataSrc: 'data.orders'
        },
        "order": [],
        "columns": [
            {'data': 'id', 'orderable': false},
            {'data': 'user_name'},
            {'data': 'user_phone'},
            {'data': 'user_address'},
            {
                "data": "order_date",
                "render": function (data) {
                    let date = new Date(data);
                    return date.toLocaleString()
                }
            },
            {
                "data": "delivery_date",
                "render": function (data) {
                    let date = new Date(data);
                    return date.toLocaleString()
                }
            },
            {'data': 'ship_fee'},
            {'data': 'total_amount'},
            {
                'orderable': false,
                'data': 'status',
                'render': function (data) {
                    switch (data) {
                        case "Processing":
                            return '<span class="label label-warning">' + data + '</span>';
                        // break;
                        case "Confirmed":
                            return '<span class="label label-danger">' + data + '</span>';
                        // break;
                    }
                }
            },
            {
                'data': function (data) {
                    return data;
                },
                'orderable': false,
                'render': function (data) {
                    if (data.status == "Processing") {
                        return '<a href="/orders/processing/' + data.id + '" title="Continue processing" class="btn btn-warning btn-flat">' +
                            '<span class="fa fa-edit" aria-hidden="true"></span></a>'
                    } else if (data.status == "Confirmed") {
                        if (data.deliMan_id == null || data.deliMan_id == "") {
                            return '<a href="/orders/' + data.id + '" title="View Detail" class="btn btn-primary btn-flat">' +
                                '<span class="fa fa-search" aria-hidden="true"></span></a> <a href="/orders/assigned/' + data.id + '" title="Assign DeliMan" class="btn btn-warning btn-flat">' +
                                '<span class="fa fa-user" aria-hidden="true"></span></a>'
                        }
                        else {
                            return '<a href="/orders/' + data.id + '" title="View Detail" class="btn btn-primary btn-flat">' +
                                '<span class="fa fa-search" aria-hidden="true"></span></a>';
                        }
                    }
                },
            },
        ],
    });

    var tableListDeliMans = $("#tableListDeliMans").DataTable({
        "ordering": false,
        "ajax": {
            url: '/employees/deliMansJSON',
            type: 'GET',
            dataSrc: 'data.deliMans'
        },
        "columns": [
            {'data': 'id'},
            {
                'data': function (data) {
                    return data.last_name + ' ' + data.first_name;
                },
                'render': function (data) {
                    return data;
                }
            },
            {'data': 'phone_number'},
            {
                'data': 'id',
                'render': function (data) {
                    return "<a href='#' data-toggle='modal' data-id='" + data + "' title='Process' class='confirmAssignOrder btn btn-primary btn-flat'><span class='fa fa-edit' aria-hidden='true'></span></a>";
                },
            },
        ],
        "drawCallback": function (settings, json) {
            $('.confirmAssignOrder').click(function (event) {
                $('#form-assign-order #deliMan_id').val($(this).data('id'));
                $('#confirm-assign-order').modal();
            });
        }
    });

    var tableListStatisticsOrders = $("#tableListStatisticsOrders").DataTable({
        "ajax": {
            url: '/orders/statisticsJSON',
            type: 'GET',
            dataSrc: 'data.orders'
        },
        "order": [],
        "columns": [
            {'data': 'id', 'orderable': false},
            {'data': 'user_name'},
            {'data': 'user_address'},
            {
                "data": "order_date",
                "render": function (data) {
                    let date = new Date(data);
                    return date.toLocaleString()
                }
            },
            {
                "data": "delivery_date",
                "render": function (data) {
                    let date = new Date(data);
                    return date.toLocaleString()
                }
            },
            {'data': 'ship_fee'},
            {'data': 'total_amount'},
            {
                'data': 'id',
                'orderable': false,
                'render': function (data) {
                    return "<a href='/orders/" + data + "' title='View Detail' class='btn btn-primary btn-flat'><span class='fa fa-search' aria-hidden='true'></span></a>";
                },
            },
        ],
    });
    $('#reservation').daterangepicker({
            locale: {
                format: 'YYYY/MM/DD'
            },
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString()
        },
        function (start, end, label) {
        console.log('aaa')
            tableListStatisticsOrders.ajax.url('/orders/statisticsJSON?startDate='+start.format('YYYY-MM-DD')+'&endDate='+end.format('YYYY-MM-DD')).load();
        }
    );


    var tableListStores = $('#tableListStores').DataTable({
        "drawCallback": function () {
            loadManyMaps();
        }
    });

    // Handling modal
    $('.confirmChangeUserStatus').click(function (event) {
        $('#form-change-user-status').attr('action', '/users/' + $(this).data('id'));
        $('#confirm-deactive').modal();
    });

    $('.confirmChangeEmployeeStatus').click(function (event) {
        $('#form-change-employee-status').attr('action', '/employees/changeStatus/' + $(this).data('id'));
        $('#confirm-deactive').modal();
    });

    $('.confirmDelStoreType').click(function (event) {
        $('#form-delete-storeType').attr('action', '/storeTypes/delete/' + $(this).data('id'));
        $('#confirm-del-storeType').modal();
    });

    $('.confirmEditStoreType').click(function (event) {
        $('#form-edit-storeType #type').val($(this).data('type'));
        $('#form-edit-storeType').attr('action', '/storeTypes/' + $(this).data('id'));
        $('#confirm-edit-storeType').modal();
    });

    $('#panel-insert-store #opening_time').timepicker({
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false,
    });

    $('#panel-insert-store #closing_time').timepicker({
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false,
    });

    $("#panel-insert-store #image_url").change(function () {
        if ($(this).val() != '') {
            readURL(this);
            $('#imageUpload').parent().removeClass('hidden');
        }
        else {
            $('#imageUpload').parent().addClass('hidden');
        }
    });

    $("#panel-update-store #image_url").change(function () {
        if ($(this).val() != '') {
            readURL(this);
            $('#imageUpload').parent().removeClass('hidden');
        }
        else {
            $('#imageUpload').parent().addClass('hidden');
        }
    });

    $("#panel-insert-product #image_url").change(function () {
        if ($(this).val() != '') {
            readURL(this);
            $('#imageUpload').parent().removeClass('hidden');
        }
        else {
            $('#imageUpload').parent().addClass('hidden');
        }
    });

    $("#panel-update-product #image_url").change(function () {
        if ($(this).val() != '') {
            readURL(this);
            $('#imageUpload').parent().removeClass('hidden');
        }
        else {
            $('#imageUpload').parent().addClass('hidden');
        }
    });

    $('.select2').select2();


    $(".update-form input").keyup(function () {
        $('.update-form #saveBtn').removeAttr('disabled');
        $('.update-form #resetBtn').removeAttr('disabled');
    });
    $(".update-form input,select").change(function () {
        $('.update-form #saveBtn').removeAttr('disabled');
        $('.update-form #resetBtn').removeAttr('disabled');
    });
    $(".update-form #resetBtn").click(function () {
        $('.update-form')[0].reset();
        checkRole();
        if ($("#panel-update-store #resetBtn") != undefined) {
            if ($('.update-form #imageUpload') != undefined || $('.update-form #imageUpload') != null) {
                $('.update-form #imageUpload').prop('src', $('.update-form #imageUpload').prop('alt'))
            }
            $('#panel-update-store #store_type').val(storetype).trigger('change');
        }
        $('.update-form #saveBtn').attr('disabled', true);

    });

    let storetype = $('#panel-update-store #store_type').val();

    checkRole();

    $('#panel-update-employee input[type=radio][name=role]').change(function () {
        if (this.value == "Staff") {
            $('#panel-update-employee #radioBusy').parent().hide();
        }
        if (this.value == "DeliMan") {
            $('#panel-update-employee #radioBusy').parent().show();

        }
    });

    $('.confirmDelCategory').click(function (event) {
        $('#form-delete-category').attr('action', $('#form-delete-category').attr('action') + "delete/" + $(this).data('id'));
        $('#confirm-del-category').modal();
    });

    $('.confirmEditCategory').click(function (event) {
        $('#form-edit-category #name').val($(this).data('type'));
        $('#form-edit-category').attr('action', $('#form-edit-category').attr('action') + $(this).data('id'));
        $('#confirm-edit-category').modal();
    });

    $('.confirmDelProduct').click(function (event) {
        $('#form-delete-product').attr('action', $('#form-delete-product').attr('action') + "delete/" + $(this).data('id'));
        $('#confirm-del-product').modal();
    });

    $('.confirmEditProduct').click(function (event) {
        $('#form-edit-product #name').val($(this).data('name'));
        $('#form-edit-product #price').val($(this).data('price'));
        $('#form-edit-product #imageUpload').prop('src', $(this).data('img'));
        $('#form-edit-product').attr('action', $('#form-edit-product').attr('action') + $(this).data('id'));
        $('#confirm-edit-product').modal();
    });

    $("#confirm-del-product #image_url").change(function () {
        if ($(this).val() != '') {
            readURL(this);
            $('#imageUpload').parent().removeClass('hidden');
        }
        else {
            $('#imageUpload').parent().addClass('hidden');
        }
    });

    $('.confirmDelAddon').click(function (event) {
        $('#form-delete-addon').attr('action', $('#form-delete-addon').attr('action') + "delete/" + $(this).data('id'));
        $('#confirm-del-addon').modal();
    });

    $('.confirmEditAddon').click(function (event) {
        $('#form-edit-addon #name').val($(this).data('name'));
        $('#form-edit-addon #role').val($(this).data('role'));
        $('#form-edit-addon').attr('action', $('#form-edit-addon').attr('action') + $(this).data('id'));
        $('#confirm-edit-addon').modal();
    });

    $('.confirmDelProductAddon').click(function (event) {
        $('#form-delete-productAddon').attr('action', $('#form-delete-productAddon').attr('action') + "delete/" + $(this).data('id'));
        $('#confirm-del-productAddon').modal();
    });


    $('.confirmEditProductAddon').click(function (event) {
        $('#form-edit-productAddon #name').val($(this).data('name'));
        $('#form-edit-productAddon #price').val($(this).data('price'));
        let addonVal = $(this).data('addon');
        $('#form-edit-productAddon #addon_id').val(addonVal).change();
        $('#form-edit-productAddon').attr('action', $('#form-edit-productAddon').attr('action') + $(this).data('id'));
        $('#confirm-edit-productAddon').modal();
    });

    $('#panel-insert-discount #getCode').click(function (e) {
        $.ajax({
            url: "/discounts/generateCode",
            success: function (result) {
                $('#panel-insert-discount #code').val(result);
            }
        });
    });

    $('.confirmDelDiscount').click(function (event) {
        $('#confirm-del-discount').modal();
    });

    $('.confirmConfirmOrder').click(function (event) {
        $('#confirm-confirm-order').modal();
    });

    $('.confirmCancelOrder').click(function (event) {
        $('#form-cancel-order').attr('action', "/orders/" + $(this).data('id'));
        $('#confirm-cancel-order').modal();
    });

    // socket function
    var socket = io($(location).attr('host') + '/delivery');

    socket.on('connect', function () {
        console.log('Client connected');
    });

    socket.on('error', function (data) {
        console.log(data || 'error');
    });

    socket.on('reloadActiveDeliMan', function (data) {
        tableListDeliMans.ajax.reload();
    });

    socket.on('reloadSubmittedOrder', function (data) {
        tableListSubmittedOrders.ajax.reload();
    });

    socket.on('reloadPendingOrder', function (data) {
        alert(data.msg);
        tableListProcessingOrders.ajax.reload();
    });
});

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageUpload').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function checkRole() {
    if ($('#panel-update-employee #radioStaff').prop('checked')) {
        $('#panel-update-employee #radioBusy').parent().hide();
    } else {
        $('#panel-update-employee #radioBusy').parent().show();
    }
}