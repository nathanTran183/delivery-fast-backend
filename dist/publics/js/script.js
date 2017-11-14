'use strict';

$.validator.addMethod("greaterThan", function (value, element, params) {

    if (!/Invalid|NaN/.test(new Date(value))) {
        return new Date(value) > new Date($(params).val());
    }

    return isNaN(value) && isNaN($(params).val()) || Number(value) > Number($(params).val());
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
    $("#tableListSubmittedOrders").DataTable();
    var tableListStores = $('#tableListStores').DataTable({
        "drawCallback": function drawCallback() {
            loadManyMaps();
        }
    });

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
        showMeridian: false
    });

    $('#panel-insert-store #closing_time').timepicker({
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false
    });

    $("#panel-insert-store #image_url").change(function () {
        if ($(this).val() != '') {
            readURL(this);
            $('#imageUpload').parent().removeClass('hidden');
        } else {
            $('#imageUpload').parent().addClass('hidden');
        }
    });

    $("#panel-update-store #image_url").change(function () {
        if ($(this).val() != '') {
            readURL(this);
            $('#imageUpload').parent().removeClass('hidden');
        } else {
            $('#imageUpload').parent().addClass('hidden');
        }
    });

    $("#panel-insert-product #image_url").change(function () {
        if ($(this).val() != '') {
            readURL(this);
            $('#imageUpload').parent().removeClass('hidden');
        } else {
            $('#imageUpload').parent().addClass('hidden');
        }
    });

    $("#panel-update-product #image_url").change(function () {
        if ($(this).val() != '') {
            readURL(this);
            $('#imageUpload').parent().removeClass('hidden');
        } else {
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
                $('.update-form #imageUpload').prop('src', $('.update-form #imageUpload').prop('alt'));
            }
            $('#panel-update-store #store_type').val(storetype).trigger('change');
        }
        $('.update-form #saveBtn').attr('disabled', true);
    });

    var storetype = $('#panel-update-store #store_type').val();

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
        } else {
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
        var addonVal = $(this).data('addon');
        $('#form-edit-productAddon #addon_id').val(addonVal).change();
        $('#form-edit-productAddon').attr('action', $('#form-edit-productAddon').attr('action') + $(this).data('id'));
        $('#confirm-edit-productAddon').modal();
    });

    $('#panel-insert-discount #getCode').click(function (e) {
        $.ajax({
            url: "/discounts/generateCode",
            success: function success(result) {
                $('#panel-insert-discount #code').val(result);
            }
        });
    });

    $('.confirmDelDiscount').click(function (event) {
        $('#form-delete-discount').attr('action', "/discounts/" + $(this).data('id'));
        $('#confirm-del-discount').modal();
    });
});

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageUpload').attr('src', e.target.result);
        };

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