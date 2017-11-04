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
    var tableListStores = $('#tableListStores').DataTable({
        "drawCallback": function(){
            loadManyMaps();
        }
    });


    $('.confirmChangeUserStatus').click(function(event){
        $('#form-change-user-status').attr('action', '/users/' + $(this).data('id'));
        $('#confirm-deactive').modal();
    });

    $('.confirmChangeEmployeeStatus').click(function(event){
        $('#form-change-employee-status').attr('action', '/employees/changeStatus/' + $(this).data('id'));
        $('#confirm-deactive').modal();
    });

    $('.confirmDelStoreType').click(function(event){
        $('#form-delete-storeType').attr('action', '/storeTypes/delete/' + $(this).data('id'));
        $('#confirm-del-storeType').modal();
    });

    $('.confirmEditStoreType').click(function(event){
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



    $("#panel-insert-store #image_url").change(function() {
        if($(this).val()!=''){
            readURL(this);
            $('#imageUpload').parent().removeClass('hidden');
        }
        else {
            $('#imageUpload').parent().addClass('hidden');
        }

    });

    $('.select2').select2();

    $(".update-form input").keyup(function() {
        $('.update-form #saveBtn').removeAttr('disabled');
        $('.update-form #resetBtn').removeAttr('disabled');
    });
    $(".update-form input").change(function() {
        $('.update-form #saveBtn').removeAttr('disabled');
        $('.update-form #resetBtn').removeAttr('disabled');
    });
    $(".update-form #resetBtn").click(function() {
        $('.update-form')[0].reset();
        $('.update-form #saveBtn').attr('disabled', true);
        $('.update-form #resetBtn').attr('disabled', true);
        checkRole();
    });

    checkRole();



    $('#panel-update-employee input[type=radio][name=role]').change(function() {
        if(this.value == "Staff"){
            $('#panel-update-employee #radioBusy').parent().hide();
        }
        if(this.value == "DeliMan"){
            $('#panel-update-employee #radioBusy').parent().show();

        }
    });


});

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#imageUpload').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function checkRole() {
    if($('#panel-update-employee input[type=radio][name=role]').val() == "Staff"){
        $('#panel-update-employee #radioBusy').parent().hide();
    } else $('#panel-update-employee #radioBusy').parent().show();
}