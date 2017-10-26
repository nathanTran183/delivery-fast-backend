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

    $('.confirmChangeUserStatus').click(function(event){
        // $('#userId').val($(this).data('id'));
        $('#form-change-user-status').attr('action', '/users/' + $(this).data('id'));
        $('#confirm-deactive').modal();
        console.log('why')
    });

});


