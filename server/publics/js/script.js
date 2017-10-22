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
$(function () {
    
    $('ul li a').click(function(){
        $('li a').removeClass("active");
        $(this).addClass("active");
    });
    $("#gender").click(function (e) {
        if (this.checked) {
            $("#male").attr('disabled', false);
            $("#female").attr('disabled', false);
        } else {
            $("#male").attr('disabled', true);
            $("#female").attr('disabled', true);
        }
    });
    $("#ageRange").click(function () {
        if (this.checked) {
            $("#ageMin").attr('disabled', false);
            $("#ageMax").attr('disabled', false);
        } else {
            $("#ageMin").attr('disabled', true);
            $("#ageMax").attr('disabled', true);
        }
    });
    $("#educationLevel-box").multipleSelect({
        filter: true
    });
    $("#educationLevel").click(function () {
        if (this.checked) {
            $("#educationLevel-box").multipleSelect('enable');
            $("#educationLevel-box").attr('disabled', false);
        } else {
            $("#educationLevel-box").multipleSelect('disable');
            $("#educationLevel-box").attr('disabled', true);
        }
    });
    $("#occupation-box").multipleSelect({
        filter: true
    });
    $("#occupation").click(function () {
        if (this.checked) {
            $("#occupation-box").multipleSelect('enable');
            $("#occupation-box").attr('disabled', false);
        } else {
            $("#occupation-box").multipleSelect('disable');
            $("#occupation-box").attr('disabled', true);
        }
    });
    $("#interests-box").multipleSelect({
        filter: true
    });
    $("#interests").click(function () {
        if (this.checked) {
            $("#interests-box").multipleSelect('enable');
            $("#interests-box").attr('disabled', false);
        } else {
            $("#interests-box").multipleSelect('disable');
            $("#interests-box").attr('disabled', true);
        }
    });
    $("#deviceType-box").multipleSelect({
        filter: true
    });
    $("#deviceType").click(function () {
        if (this.checked) {
            $("#deviceType-box").multipleSelect('enable');
            $("#deviceType-box").attr('disabled', false);
        } else {
            $("#deviceType-box").multipleSelect('disable');
            $("#deviceType-box").attr('disabled', true);
        }
    });
    $(".taskMenuButton").click(function () {
        if (this.checked) {
            $(".taskMenuBox").show();
        } else {
            $(".taskMenuBox").hide();
        }
    });
    $("#targettingUserButton").click(function () {
        if (!this.checked) {
            $("#gender").attr('checked', false);
            $("#ageRange").attr('checked', false);
            $("#educationLevel").attr('checked', false);
            $("#occupation").attr('checked', false);
            $("#interests").attr('checked', false);
            $("#deviceType").attr('checked', false);
            $("#countries").attr('checked', false);
            $("#male").attr('disabled', true);
            $("#female").attr('disabled', true);
            $("#ageMin").attr('disabled', true);
            $("#ageMax").attr('disabled', true);
            $("#educationLevel-box").attr('disabled', true);
            $("#occupation-box").attr('disabled', true);
            $("#interests-box").attr('disabled', true);
            $("#deviceType-box").attr('disabled', true);
            $("#countries-box").multipleSelect('disable');
        }
    });
    
    $("#multiLocation").click(function () {
        if (this.checked) {
            $("#target-location-maps-box").hide();
            $("#target-location-box").show();
        }
    });
    
    $("#segmentByDetail").click(function () {
        if (this.checked) {
            $("#target-user-by-name-box").hide();
            $("#target-user-by-detail-box").show();
        }
    });
    $("#segmentByName").click(function () {
        if (this.checked) {
            $("#target-user-by-name-box").show();
            $("#gender").attr('checked', false);
            $("#ageRange").attr('checked', false);
            $("#educationLevel").attr('checked', false);
            $("#occupation").attr('checked', false);
            $("#interests").attr('checked', false);
            $("#deviceType").attr('checked', false);
            $("#countries").attr('checked', false);
            $("#male").attr('disabled', true);
            $("#female").attr('disabled', true);
            $("#ageMin").attr('disabled', true);
            $("#ageMax").attr('disabled', true);
            $("#educationLevel-box").attr('disabled', true);
            $("#occupation-box").attr('disabled', true);
            $("#interests-box").attr('disabled', true);
            $("#deviceType-box").attr('disabled', true);
            $("#countries-box").multipleSelect('disable');
            $("#target-user-by-detail-box").hide();
        }
    });
    $("#selectUserByName").multipleSelect({
        filter: true
    });
    $("#segmentByName").click(function () {
        if (this.checked) {
            $("#selectUserByName").multipleSelect('enable');
            $("#selectUserByName").prop('disabled', false);
            
        } else {
            $("#selectUserByName").multipleSelect('disable');
            $("#selectUserByName").prop('disabled', true);
        }
    });
    $("#countries-box").multipleSelect({
        filter: true
    });
    $("#countries").click(function () {
        if (this.checked) {
            $("#countries-box").multipleSelect('enable');
            $("#countries-box").prop('disabled', false);
        } else {
            $("#countries-box").multipleSelect('disable');
            $("#countries-box").prop('disabled', true);
        }
    });
    $("#publishDateNow").click(function () {
        $("#publishDate").val(getDate());
        $('#publishDate').parents(".form-group").removeClass("has-error");
        $('#publishDate-error').remove();
    });
    var getDate = function () {
        var now = new Date();
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        return (month) + "/" + (day) + "/" + now.getFullYear();
    };
    $('#button-confirm-export-user').click(function(){
        $('#confirmExportUser').modal('toggle');
    });
    var tablePaymentHistory = $('#tablePaymentHistory').DataTable({
        deferLoading: 0,
        lengthChange: false,
        paging: false,
        processing: true,
        serverSide: true,
        searching: false,
        ordering: false,
        info: false,
        autoWidth: true, 
        ajax: {
            url: '/user/paymentHistory/0',
            type: 'POST'
        },
        columns: [
        {'data': 'task_id.title'},
        {
            'data': 'submitted_at',
            "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return month + "/" + date.getDate() + "/" + date.getFullYear();
            }
        },
        {'data': 'money'},
        {
            'data': "status",
            'render': function(data){
                if(data==2){
                  return '<span class="label label-md label-success">Approved</span>';
              } else {
                  return '<span class="label label-md label-danger">Reject</span>';
              }
          }
        }
        ]
    });
    $('#overviewUser').DataTable({        
        lengthChange: false,
        pageLength: 50,
        processing: true,
        serverSide: true,
        searching: false,
        "scrollX": true,
        "info": false,
        "autoWidth": true, 
        ajax: {
            url: '/user/userList',
            type: 'POST'
        },
        initComplete: function(settings, json) {
            $('.totalAmount').click(function(event){
                event.preventDefault();
                var userId = $(this).attr('data-id');
                tablePaymentHistory.ajax.url('/user/paymentHistory/' + userId).load();
                
            });
        },
        columns: [
        {'data': 'normalUser.first_name'},
        {'data': 'normalUser.last_name'},
        {},
        {'data': 'normalUser.mobile'},
        {'data': "user.email"},
        {"data": "normalUser.gender"},
        {"data": "normalUser.occupation"},
        {"data": "normalUser.interests"},
        {},
        {},
        {}  
        ],
        'columnDefs': [{
            'targets': 2,
            "data": function(data){
                return data.normalUser.total_amount + ',' + data.user._id;
            },
            "render": function (data) {
                return '<a href="#" data-toggle="modal" data-target="#paymentHistory" class="totalAmount" data-id="' + data.split(',')[1] +'">$ '
                + data.split(',')[0] + '</a>';
            }
        },{
            'targets': 8,
            "data": "user.created_at",
            "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return month + "/" + date.getDate() + "/" + date.getFullYear();
            }
        },{
            'targets': 9,
            "data": "normalUser.last_login",
            "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return month + "/" + date.getDate() + "/" + date.getFullYear();
            }
        },{
            "targets" : 10,
            "data": "normalUser.last_response",
            "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return month + "/" + date.getDate() + "/" + date.getFullYear();
            }
        }]
    });
    

    $("#form-createNewTask").validate({
        rules: {
            title: {
                required: true,
                maxlength: 500
            },
            description: "required",
            publish_date: {
                required: true,
                date: true
            },
            expire_date: {
                required: true,
                date: true,
                greaterThan: "#publishDate"
            },
            max_response: {
                required: true
            },
            max_no_users: "required",
            payment: {
                required: true,
                minStrict: 0
            },
            latitude: "required",
            longitude: "required"
        },
        messages: {
            title: {
                required: "Please enter task title",
                maxlength: "Task title must consist of maximum 500 characters"
            },
            description: "Please enter task description",
            publish_date: {
                required: "Please enter publish date",
                date: "This type is not date"
            },
            expire_date: {
                required: "Please enter expire date",
                date: "This type is not date",
                greaterThan: "Expire date must greater than Publish date"
            },
            max_response: {
                required: "Please enter max number of response per person"
            },
            max_no_users: "Please enter max number of user",
            payment: {
                required: "Please enter payment amount per question",
                minStrict: "Payment amount per question must bigger than 0"
            },
            latitude: "Please enter latitude",
            longitude: "Please enter longitude"
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").removeClass("has-error");
        }
    });
    $("#message-body").spellCheckInDialog();
    
    $("#segmentUserToSendMessage").change(function () {
        var value = $("#segmentUserToSendMessage :selected").text();
        if (value === 'Individuals') {
            $("#allUser").hide();
            $("#segmentM").hide();
            $("#condition").hide();
            if ($("#individuals").hide()){
                $("#individuals").show();
                $("#userList-box").attr('disabled', false);
            }
        }
        if (value === "All users") {
            $("#individuals").hide();
            $("#userList-box").attr('disabled', true);
            $("#segmentM").hide();
            $("#condition").hide();
            if ($("#allUser").hide()){
                $("#allUser").show();
            }
        }
        if (value === "Segment") {
            $("#individuals").hide();
            $("#userList-box").attr('disabled', true);
            $("#allUser").hide();
            $("#condition").hide();
            if ($("#segmentM").hide()){
                $("#segmentM").show();
            }
        }
        if (value === "Condition") {
            $("#individuals").hide();
            $("#userList-box").attr('disabled', true);
            $("#allUser").hide();
            $("#segmentM").hide();
            if ($("#condition").hide()){
                $("#condition").show();
            }
        }
    });
    $("#countries-boxM").multipleSelect({
        filter: true
    });
    $("#countriesM").click(function () {
        if (this.checked) {
            $("#countries-boxM").multipleSelect('enable');
            $("#countries-boxM").prop('disabled', false);
            
        } else {
            $("#countries-boxM").multipleSelect('disable');
            $("#countries-boxM").prop('disabled', true);
        }
    });
    $("#genderM").click(function (e) {
        if (this.checked) {
            $("#maleM").attr('disabled', false);
            $("#femaleM").attr('disabled', false);
        } else {
            $("#maleM").attr('disabled', true);
            $("#femaleM").attr('disabled', true);
        }
    });
    $("#ageRangeM").click(function () {
        if (this.checked) {
            $("#ageMinM").attr('disabled', false);
            $("#ageMaxM").attr('disabled', false);
        } else {
            $("#ageMinM").attr('disabled', true);
            $("#ageMaxM").attr('disabled', true);
        }
    });
    $("#educationLevelM").click(function () {
        if (this.checked) {
            $("#educationLevel-boxM").attr('disabled', false);
        } else {
            $("#educationLevel-boxM").attr('disabled', true);
        }
    });
    $("#occupationM").click(function () {
        if (this.checked) {
            $("#occupation-boxM").attr('disabled', false);
        } else {
            $("#occupation-boxM").attr('disabled', true);
        }
    });
    $("#interestsM").click(function () {
        if (this.checked) {
            $("#interests-boxM").attr('disabled', false);
        } else {
            $("#interests-boxM").attr('disabled', true);
        }
    });
    $("#deviceTypeM").click(function () {
        if (this.checked) {
            $("#deviceType-boxM").attr('disabled', false);
        } else {
            $("#deviceType-boxM").attr('disabled', true);
        }
    });
    $("#form-create-new-message").validate({
        rules: {
            message_body: "required",
            userListBox: "required",
            "hiddenRecaptcha": {
                required: function() {
                    if(grecaptcha.getResponse() == '') {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        messages: {
            messageBody: "Please enter message body",
            userListBox: "Please choose at least one user from user list",
            hiddenRecaptcha: 'You must complete the antispam verification'
        },  
        ignore: ':hidden:not("#userList-box, #hiddenRecaptcha")',
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").removeClass("has-error");
        }
    });
    
    $('#userList-box').multipleSelect({
        filter: true
    });
    $('#refreshButton').click(function(){
        location.reload(true);
    });
    $("#selectAll").click(function(){
        $(".checkbox-mail").each(function(){
            this.checked = true;
        });
    });
    $("#unselectAll").click(function(){
        $(".checkbox-mail").each(function(){
            this.checked = false;
        });
    });
    $('#selectUnreadMess').click(function(){
        $('.unread').each(function(){
            this.checked = true;
        });
        $('.read').each(function(){
            this.checked = false;
        });
    });
    $('#selectReadMess').click(function(){
        $('.read').each(function(){
            this.checked = true;
        });
        $('.unread').each(function(){
            this.checked = false;
        });
    });
    $("#inboxList").DataTable({        
        lengthChange: false,
        pageLength: 50,
        searching: true,
        processing: true,
        serverSide: true,
        info: false,
        autoWidth: true, 
        ajax: {
            url: '/inbox_table',
            type: 'POST'
        },
        columns: [
            {},
            {
                'data': function(data){
                    return data.read_at + ',' + data.from;
                },
                render: function(data){
                    console.log(data.split(',')[0])
                    if (data.split(',')[0] != 'null') {
                        return data.split(',')[1];
                    } else {
                        return '<b>' + data.split(',')[1] + '</b>';
                    }
                }
            },
            {},
            {}
            ],
        'columnDefs': [{
            'data': function(data){
                return data._id + ',' + data.read_at;
            },
            'targets': 0,
            'render': function (data){
                if (data.split(',')[1] != 'null'){
                    return '<input type="checkbox" name="id[]" class="checkbox-mail read" data-id="'+data.split(',')[0]+'">';
                } else {
                    return '<input type="checkbox" name="id[]" class="checkbox-mail unread" data-id="'+data.split(',')[0]+'">';
                }
            }
        },
        {
            'targets': 2,
            'data': function(data){
                if (data.message_header) {
                    return data.read_at + ',' + data.message_header + ',' + data.message_body;
                } else {
                    return data.read_at + ',' + ',' + data.message_body;
                }
            },
            'render': function(data) {
                if (data.split(',')[0] != 'null'){
                    if (data.split(',')[1]) {
                        return data.split(',')[1] + ' - <span style="color: #BDBDBD">' + data.split(',')[2] + '</span>'; 
                    } else {
                        return '(No subject) - <span style="color: #BDBDBD">' + data.split(',')[2] + '</span>';
                    }
                } else {
                    if (data.split(',')[1]) {
                        return '<b>' + data.split(',')[1] + ' - <span style="color: #BDBDBD">' + data.split(',')[2] + '</span><b>'; 
                    } else {
                        return '<b>(No subject) - <span style="color: #BDBDBD">' + data.split(',')[2] + '</span><b>';
                    }
                }
            }
        },
        {
            "targets" : 3,
            "data": "created_at",
            "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return (month) + "/" + date.getDate() + "/" + date.getFullYear();
            }
        }],
    });
    $("#outboxList").DataTable({
        lengthChange: false,
        pageLength: 50,
        searching: true,
        processing: true,
        serverSide: true,
        info: false,
        autoWidth: true, 
        ajax: {
            url: '/message/table',
            type: 'POST'
        },
        columns: [
            {},
            {'data': 'from'},
            {},
            {}
            ],
        'columnDefs': [{
            'data': '_id',
            'targets': 0,
            'render': function (data){
                return '<input type="checkbox" name="id[]" class="checkbox-mail" data-id="'+data+'">';
            }
        },
        {
            'targets': 2,
            'data': function(data){
                if (data.message_header) {
                    return data.message_header + ',' + data.message_body;
                } else {
                    return ',' + data.message_body;
                }
            },
            'render': function(data) {
                if (data.split(',')[0]) {
                    return data.split(',')[0] + ' - <span style="color: #BDBDBD">' + data.split(',')[1] + '</span>'; 
                } else {
                    return '(No subject) - <span style="color: #BDBDBD">' + data.split(',')[1] + '</span>';
                }
            }
        },
        {
            "targets" : 3,
            "data": "created_at",
            "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return (month) + "/" + date.getDate() + "/" + date.getFullYear();
            }
        }]
    });
    $('#outboxList').on('click','tbody tr', function (evt) {
        var $cell=$(evt.target).closest('td');
        var id = $(this).children().children().data('id');
        if ($cell.index()>0){
            $('#messageId').val(id);
            $('#getMessageId_form').submit();
        }
    });
    $('#inboxList').on('click','tbody tr', function (evt) {
        var $cell=$(evt.target).closest('td');
        var id = $(this).children().children().data('id');
        if ($cell.index()>0){
            $('#messageId').val(id);
            $('#getMessageIdInbox_form').submit();
        }
    });
    $("#deleteMail-button").click(function(){
        var b =0;
        $(".checkbox-mail").each(function(){
            if (this.checked){
                b++;
            }
        });
        if (b===0){
            $(this).attr('data-target',"#deleteMail-box2");
        }
        else{
            $(this).attr('data-target',"#deleteMail-box1");
            var d =0;
            $('.checkbox-mail').each(function(){
                if (this.checked){
                    var id = $(this).data('id');
                    $('#listMessageId').val($('#listMessageId').val()+id+';');
                    d++;
                }
            });
            $('#countMessage').val(d); 
            
        }
    });
    $('#buttonCancelDeleteMail1').click(function(){
        $('#listMessageId').val('');
    });
    $(".replyButton").click(function(){
        if ($("#replyBox").hide()){
            $("#replyBox").show();
        }
    });
    $("#cancelReply").click(function(){
        $("#replyBox").hide();
    });
    
    /** author: Phuc
     * setup datatable
     * add html for search user
     **/
     var tablePendingHistory = $('#tablePendingHistory').DataTable({
        "deferLoading": 0,
        "lengthChange": false,
        "paging": false,
        "processing": true,
        "serverSide": true,
        "searching": false,
        "ordering": false,      
        "ajax": {            
            url: '/payment/pendingPaymentHistory/0',
            type: 'POST'            
        },
        "columns": [
        {'data': 'task_id.title'},
        {
            'data': 'submitted_at',
            "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return month + "/" + date.getDate() + "/" + date.getFullYear();
            }
        },
        {'data': 'money'},
        ],
    });

     var tablePendingPayments = $('#tablePendingPayments').DataTable({
        "lengthMenu": [[10, 25, 50], [10, 25, 50]],
        "lengthChange": true,
        "processing": true,
        "serverSide": true,
        "pagingType": "full_numbers",
        "scrollX": true,
        "info": false,
        "autoWidth": true, 
        "ajax": {
            url: '/payment/getPending',
            type: 'POST'
        },        
        "columns": [
        {
            'orderable': false,
            'target': 0,
            'data': 'payment._id',
            "render": function(data){
                return '<a href="#" data-toggle="modal" data-id="'+data+'" title="Delete" class="btn btn-success confirmPaid">Paid</span></a>'
            }
        },
        {'data': 'payment._id'},        
        {
            'data': 'payment.total_amount',
            'render': function(data){
                return  '<a href="#" class="totalAmountPayment" data-toggle="modal" data-target="#pendingPaymentHistory">$ '+data+'</a>';
            },
        },        
        {
            "data": function(data){
                return data.info.first_name + ' ' + data.info.last_name;
            },
            'render': function(data){
                return data;
            }
        },
        {'data': 'info.mobile'}
        ],
        drawCallback: function(settings, json) {
            $('.confirmPaid').click(function(event){
                $('#paymentId').val($(this).data('id'));
                $('#confirm-Paid').modal();
            });
            $('.totalAmountPayment').click(function(event){
                event.preventDefault();
                //var paymentId = $(this).attr('data-id');                
                var paymentId = $(this).closest('tr').find('.confirmPaid').attr('data-id');
                tablePendingHistory.ajax.url('/payment/pendingPaymentHistory/'+paymentId).draw();
            });
        },
    });    
     $('#buttonPaymentSearch').click(function(){                
        var dateFrom = $('#paymentDateMin').val();
        var dateTo = $('#paymentDateMax').val();
        if(dateFrom==""&&dateTo==""){
            console.log("both null");
            tablePendingPayments.ajax.url('payment/getPending/').load();
        } else {
            dateFrom = dateFrom.replace(/\//g,"-");
            if(dateFrom!="") dateFrom = dateFrom.substr(6,4) +"-"+ dateFrom.substr(0,5);
            dateTo = dateTo.replace(/\//g,"-");
            if(dateTo!="") dateTo = dateTo.substr(6,4) +"-"+ dateTo.substr(0,5);
            tablePendingPayments.ajax.url('payment/getPending?dateFrom='+dateFrom+'&dateTo='+dateTo).load();    
        }
    });
     $('#buttonPaymentReset').click(function(){
        $('#paymentDateMin,#paymentDateMax').val('');
        tablePendingPayments.ajax.url('payment/getPending/').load();
    });


     $('#button-confirm-export-payment').click(function(){
        $('#confirmExportPayment').modal('toggle');
    });

    var tableArchivedPayments = $('#tableArchivedPayments').DataTable({
        "lengthChange": true,
        "processing": true,
        "serverSide": true,
        "pagingType": "full_numbers",
        "ajax": {
            url: '/payment/getArchived',
            type: 'POST'            
        },
        "columns": [        
        {
            "data": "payment.archived_date",            
            "render": function (data) {
                return new Date(data).toLocaleDateString();
            }
        },        
        {            
            'data': 'payment',
            'render': function(data){
                return  '<a href="#" class="totalAmountPayment" data-id="'+data._id+'" data-toggle="modal" data-target="#pendingPaymentHistory">$ '+data.total_amount+'</a>';
            },
        },
        {
            "data": function(data){
                return data.info.first_name + ' ' + data.info.last_name;
            },
            'render': function(data){
                return data;
            }
        },        
        {'data': 'payment._id'}
        ],
        "scrollX": true,
        "info": false,
        "autoWidth": true, 
        drawCallback: function(settings, json) {            
            $('.totalAmountPayment').click(function(event){
                event.preventDefault();
                var paymentId = $(this).attr('data-id');
                tablePendingHistory.ajax.url('/payment/pendingPaymentHistory/'+paymentId).draw();
            });
        },
    });   
    $('#buttonArchivedPaymentSearch').click(function(){              
        var dateFrom = $('#paymentDateMin').val();
        var dateTo = $('#paymentDateMax').val();
        if(dateFrom==""&&dateTo==""){
            console.log("both null");
            tableArchivedPayments.ajax.url('payment/getArchived/').load();
        } else {
            console.log('zô đây rồi');
            dateFrom = dateFrom.replace(/\//g,"-");
            if(dateFrom!="") dateFrom = dateFrom.substr(6,4) +"-"+ dateFrom.substr(0,5);
            dateTo = dateTo.replace(/\//g,"-");
            if(dateTo!="") dateTo = dateTo.substr(6,4) +"-"+ dateTo.substr(0,5);
            tableArchivedPayments.ajax.url('payment/getArchived?dateFrom='+dateFrom+'&dateTo='+dateTo).load();    
        }
    });
     $('#buttonArchivedPaymentReset').click(function(){
        $('#paymentDateMin,#paymentDateMax').val('');
        tableArchivedPayments.ajax.url('payment/getArchived/').load();
    });     
     var tableListAccounts = $('#tableListAccounts').DataTable({
        "lengthMenu": [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
        "lengthChange": true,
        "processing": true,
        "pagingType": "full_numbers",
        "serverSide": true,
        "ajax": {
            url: '/account/getAccountDatatable',
            type: 'POST'
        },
        "columns": [        
        {'data': 'user.username'},
        {'data': 'user.email'},
        {
            'orderable': false,
            'data': 'privilege.active',
            'render': function (data) {
                if(data==1)
                    return '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span><input class="active" type="checkbox" checked="checked">';                
                if(data==0)
                    return "<span class='glyphicon glyphicon-ok hidden' aria-hidden='true'></span><input type='checkbox' class='active'>";
            }
        },
        {
            'orderable': false,
            'data': 'privilege.create_edit_tasks',
            'render': function (data) {
                if(data==1)
                    return '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span><input class="create_edit_tasks" type="checkbox" checked="checked">';                
                if(data==0)
                    return "<span class='glyphicon glyphicon-ok hidden' aria-hidden='true'></span><input type='checkbox' class='create_edit_tasks'>";
            }
        },
        {
            'orderable': false,
            'data': 'privilege.review_tasks',
            'render': function (data) {
                if(data==1)
                    return '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span><input class="review_tasks" type="checkbox" checked="checked">';                
                if(data==0)
                    return "<span class='glyphicon glyphicon-ok hidden' aria-hidden='true'></span><input type='checkbox' class='review_tasks'>";
            }
        },
        {
            'orderable': false,
            'data': 'privilege.review_payments',
            'render': function (data) {
                if(data==1)
                    return '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span><input class="review_payments" type="checkbox" checked="checked">';                
                if(data==0)
                    return "<span class='glyphicon glyphicon-ok hidden' aria-hidden='true'></span><input type='checkbox' class='review_payments'>";
            }
        },
        {
            'orderable': false,
            'data': 'privilege.delete_tasks',
            'render': function (data) {
                if(data==1)
                    return '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span><input class="delete_tasks" type="checkbox" checked="checked">';                
                if(data==0)
                    return "<span class='glyphicon glyphicon-ok hidden' aria-hidden='true'></span><input type='checkbox' class='delete_tasks'>";
            }
        },
        {
            'orderable': false,
            'data': 'privilege.message_users',
            'render': function (data) {
                if(data==1)
                    return '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span><input class="message_users" type="checkbox" checked="checked">';                
                if(data==0)
                    return "<span class='glyphicon glyphicon-ok hidden' aria-hidden='true'></span><input type='checkbox' class='message_users'>";
            }
        }, 
        {
            'orderable': false,
            'data': 'privilege.user_info',
            'render': function (data) {
                if(data==1)
                    return '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span><input class="user_info" type="checkbox" checked="checked">';                
                if(data==0)
                    return "<span class='glyphicon glyphicon-ok hidden' aria-hidden='true'></span><input type='checkbox' class='user_info'>";
            }
        },
        {
            "orderable": false, 
            "targets": 9,
            'data': 'privilege._id',
            'render': function(data){
                return '<input type="text" id="id" value="'+data+'" hidden>'
                +'<a href="#" title="Edit" class="button-edit"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'
                +'<a href="#" title="Save" class="button-save"><span class="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span></a>'
            }
        },
        {
            "orderable": false,
            "targets": 10,
            'data': "user._id",
            'render': function(data){
                return '<a href="#" data-toggle="modal" data-id="'+data+'" title="Delete" class="button-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>'            
                +'<a href="#" title="Cancel" class="button-cancel"><span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span></a>'            
            }
        }],
        "scrollX": true,
        "info": true,
        "autoWidth": false,        
        "drawCallback": function(settings, json) {
            var id, active, create_edit_tasks, review_tasks, review_payments, delete_tasks, message_users, user_info;
        /** author: Quang
         * handle click Event of Edit Admin Account button
         **/
         $('#tableListAccounts tr .button-edit').click(function(){
            $(this).closest('tr').addClass('in-edit');
            //save current data
            id = $(this).parent().parent().find('#id').val();            
            active = $(this).parent().parent().find('.active').prop('checked');
            create_edit_tasks = $(this).parent().parent().find('.create_edit_tasks').prop('checked');
            review_tasks = $(this).parent().parent().find('.review_tasks').prop('checked');
            review_payments = $(this).parent().parent().find('.review_payments').prop('checked');
            delete_tasks = $(this).parent().parent().find('.delete_tasks').prop('checked');
            message_users = $(this).parent().parent().find('.message_users').prop('checked');
            user_info = $(this).parent().parent().find('.user_info').prop('checked');
            //disable another button
            $(this).parent().parent().parent().find('.button-edit').addClass('hidden');
            $(this).parent().parent().parent().find('.button-delete').addClass('hidden');            
        });
        /** author: Phuc
         * handle click Event of Cancel Admin Account button
         **/
         $('#tableListAccounts tr .button-cancel').click(function () {            
            callReload();
        });

        /** author: Phuc
         * handle click Event of Delete Admin Account button
         **/
         $('#tableListAccounts tr .button-delete').click(function () {
            id = $(this).parent().parent().find('#id').val();   
            $('#accountId').val($(this).data('id'));
            $('#confirm-delete-account').modal();
        });
        /** author: Phuc
         * handle click Event of Save Admin Account button
         **/
         $('#tableListAccounts tr .button-save').click(function () {   
            var data= {
                '_id': $(this).parent().parent().find('#id').val(),
                'active': $(this).parent().parent().find('.active').prop('checked'),
                'create_edit_tasks': $(this).parent().parent().find('.create_edit_tasks').prop('checked'),
                'review_tasks': $(this).parent().parent().find('.review_tasks').prop('checked'),
                'review_payments': $(this).parent().parent().find('.review_payments').prop('checked'),
                'delete_tasks': $(this).parent().parent().find('.delete_tasks').prop('checked'),
                'message_users': $(this).parent().parent().find('.message_users').prop('checked'),
                'user_info': $(this).parent().parent().find('.user_info').prop('checked')
            }          
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',         
                url: '/account/edit_account',
                success: function(data) {                
                    console.log(JSON.stringify(data));
                    callReload('Account Saved!');//reload table without reload page and message panel                                                
                    //window.location.reload();     //reload the whole page within message panel  
                },
                error: function(error) {
                    console.log("some error in fetching the notifications");
                }
            });
        });
     }
 });
var callReload = function(message){
    $('.alert').remove();    
    if(message!=null)
        $('.content-header').prepend('<div class="alert alert-info"><a href="#" class="close" data-dismiss="alert"'+ 
            'aria-label="close">&times;</a>'+message+'!</div>');
    
    $('.ui-tooltip').hide();
    tableListAccounts.ajax.reload();
}
    /** author: Quang
     * form create new admin validation
     **/
     $("#form-create-admin-account").validate({
        rules: {
            username: {
                required: true
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 48
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            username: {
                required: "Please enter username"
            },
            password: {
                required: "Please enter password",
                minlength: "Password length must have 6 characters min",
                maxlength: "Password length cannot exceed 48 characters"
            },
            email: {
                required: "Please enter email",
                email: "Email incorrect"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").removeClass("has-error");
        }
    });
     
    /** author: Phuc
     * form forgot password validation
     **/
     $("#formForgotPassword").validate({
        rules: {            
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            email: {
                required: "Please enter email",
                email: "Email incorrect"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").removeClass("has-error");
        }
    });

    /** author: Phuc
     * form reset password validation
     **/
     $("#formResetPassword").validate({
        rules: {
            password: {
                required: true,
                minlength: 6,
                maxlength: 48
            },
            confirmPassword: {
                required: true,
                equalTo: "#password"
            }
        },
        messages: {
            password: {
                required: "Please enter password",
                minlength: "Password length must have 6 characters min",
                maxlength: "Password length cannot exceed 48 characters"
            },
            confirmPassword: {
                required: "Please enter Retype-Password",
                equalTo: "Retype-Password must match with password!"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").removeClass("has-error");
        }
    });      

    /** author: Phuc
     * config library for search by date range
     * filter table by date (from...to...)     
     **/
     $(".datepicker").datepicker({
        changeMonth: true,
        changeYear: true
    });

	/** author: Quang
	 * feature drag-drop questions
	 **/
     $(".createNewTask .questions-container").sortable({
      cursor: "move",
      cancel: "button"
  });
     $(".createNewTask .questions-container").disableSelection();

	/** author: Quang
	 * add datatable to table overviewTask
	 **/
     $('#tableListTasks').DataTable({
        "pageLength": 50,
        "ordering": true,
        "stateSave": false,
        "pagingType": "full_numbers",
        "lengthMenu": [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
        "columnDefs": [
        {"orderable": false, "targets": 9},
        {"orderable": false, "targets": 4}
        ],
        "order": [[0, "asc"]],
        "scrollX": true,
        "info": false,
        "autoWidth": true, 
        "serverSide": true,
        "ajax": {
            url: '/getListTasksJSON',
            type: 'POST'
        },
        "columns": [
        {
            "data": "task",
            "render": function(data) {
                return '<a href="/taskDetail?task_id=' + data._id + '" title="Click to show detail and delete/edit this task">'+data.title+'</a>';
            }
        },
        {
            "data": "task.created_at",
            "render": function(data) {
                return new Date(data).toLocaleString();
            }
        },
        {
            "data": "task.publish_date",
            "render": function(data) {
                return new Date(data).toLocaleDateString();
            }
        },
        {
            "data": "task.expire_date",
            "render": function(data) {
                return new Date(data).toLocaleDateString();
            }
        },
        {"data": "task.countries"},
        {"data": "task.earnings"},
        {"data": "task.questions"},
        {"data": "task.attempted"},
        {"data": "task.completed"},
        {
            "data": "task._id",
            "render": function(data) {
                return '<a href="/reviewedResponses?taskId=' + data + '" title="Go to Responses"><span class="glyphicon glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
            }
        }
        ]
    });

	/** author: Quang + Phuc
	 * add datatable to table pendingTask
	 **/
     $('#tablePendingTask').DataTable({
        "dom": '<"panelTableHeading clearfix"i><"clear">tp',
        "pageLength": 50,
        "ordering": true,
        "stateSave": false,
        "pagingType": "full_numbers",
        "lengthMenu": [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],        
        "serverSide": true,
        "scrollX": true,
        "info": false,
        "autoWidth": true, 
        "ajax": {
            url: '/getPendingTasks',
            type: 'POST'
        },
        "columns": [
        {'data': 'task.title'},
        {
            "data": "task.created_at",
            "render": function(data) {
                return new Date(data).toLocaleString();
            }
        },
        {
            "data": "task.expire_date",
            "render": function(data) {
                return new Date(data).toLocaleDateString();
            }
        },
        {
        	"orderable": false,
        	"data": "task.countries"
        },
        {"data": "task.payment"},
        {"data": "task.questions"},
        {"data": "task.pending_response"},
        {
        	"orderable": false,
            "data": "task._id",
            "render": function(data) {
                return '<a href="/pendingResponses?taskId='+data+'" title="View pending responses"><span class="glyphicon glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
            }
        }
        ]
    });	
 });

$(".confirmApprove").click(function (ev) {
    $("#confirm-Approve").modal();
});
$(".confirmReject").click(function (ev) {
    $("#confirm-Reject").modal();
});
/** author: Phuc
 * display textaria when checkbox Other is checked
 **/
 $("#cbxEmail").click(function () {
    if (this.checked) {
        $("#textariaTaskReject").attr('disabled', false);
    } else {
        $("#textariaTaskReject").attr('disabled', true);
    }
})


/** author: Quang
 * a box new-question-creation will show up inside the right panel
 * hide button "New Question"
 * hide button "delete option" because of having only 1 option
 * change data-target and id of modal in branching-logic in this new question
 **/
 function newQuestion() {
    var questionID = 'question-' + $.now();
    $('#new-question').html('<div id="' + questionID + '" class="question single-choice clearfix">' + $('#question-single-choice').html() + '</div>');
    $('#button-new-question').addClass('hidden');
    $('.createNewTask .questions-container').css('width', '45%');
    $('.createNewTask .questions-function').css('width', '54%');
    $('#new-question #' + questionID + ' .question-body .option:not(.option-add) button').addClass('hidden');
    $('#new-question #' + questionID + ' .branching-logic').children('button').attr('data-target', '#modal-' + questionID);
    $('#new-question #' + questionID + ' .branching-logic').children('.modal').attr('id', 'modal-' + questionID);
}
;
/** author: Quang
 * change question-body content and change class of question when change type of question
 * hide button "delete option" because of having only 1 option if new type is single-choice or multiple-choice
 * change data-target and id of modal in branching-logic in this question if new type is single-choice or multiple-choice
 **/
 function changeQuestionBody(target) {
    // find the old question type
    var stringListClassOfQuestion = target.closest('.question').attr("class");
    var oldQuestionType = 'not-choice';
    if (stringListClassOfQuestion.includes('single-choice') || stringListClassOfQuestion.includes('multiple-choice')) {
        oldQuestionType = 'choice';
    }
    // get new question type and replace old question type by new question type
    var questionType = target.children(':selected').attr('value'); //or target.val();
    target.closest('.question').removeClass('single-choice multiple-choice photo free-text numerical star-ratings in-app-browser').addClass(questionType);
    
    // if: switch between single choice and multiple choice 
    if (oldQuestionType == 'choice' && (questionType == 'single-choice' || questionType == 'multiple-choice')) {
        if (questionType == 'single-choice') {
            target.closest('.question').children('.question-body').children('.option').children('img').attr('src', '/images/radio-off-20.png');
            target.closest('.question').children('.question-body').children('.option').children('img').attr('alt', 'radio-off-20.png');
        } else if (questionType == 'multiple-choice') {
            target.closest('.question').children('.question-body').children('.option').children('img').attr('src', '/images/checkbox-off-20.png');
            target.closest('.question').children('.question-body').children('.option').children('img').attr('alt', 'checkbox-off-20.png');
        }
    } else { // else: other cases
        target.closest('.question').children('.question-body').html($('.question-template.' + questionType).children('.question-body').html());
        if (questionType == 'single-choice' || questionType == 'multiple-choice') {
            target.closest('.question').find('.question-body .option:not(.option-add) button').addClass('hidden');
            var questionID = target.closest('.question').attr('id');
            $('#new-question .question#' + questionID + ' .branching-logic').children('button').attr('data-target', '#modal-' + questionID);
            $('#new-question .question#' + questionID + ' .branching-logic').children('.modal').attr('id', 'modal-' + questionID);
        }
    }
}
;
/** author: Quang
 * disappear the box new-question-creation
 * show the button "New Question"
 **/
 function cancelQuestion() {
    $('#new-question').html('');
    $('#button-new-question').removeClass('hidden');
    $('.createNewTask .questions-container').css('width', '54%');
    $('.createNewTask .questions-function').css('width', '45%');
}
;
/** author: Quang
 * check validation first
 * add question into sidebar
 * copy all data
 * copy all data of branching logic if type of question is single-choice/multiple-choice
 * add this new question to all branching-logic combobox
 * disappear the box new-question-creation
 * show the button "New Question"
 * set readonly/disabled for everything in the question in the panel left
 **/
 function addQuestion() {
    if ($('#new-question .question-header input').val() === '') {
        alert('Please enter the title of question!');
        $('#new-question .question-header input').focus();
        return;
    } else if ($('#new-question .question-body input[type="number"]').val() === '') {
        alert('Please enter number of photos (between 1 and 100)!');
        $('#new-question .question-body input[type="number"]').focus();
        return;
    } else if ($('#new-question .in-app-browser .question-body input[type="text"]').val() === '') {
        alert('Please enter the link!');
        $('#new-question .question-body input[type="text"]').focus();
        return;
    }
    var numValid = true;
    $('#new-question .question-body .option:not(.option-other) input[type="text"]').each(function () {
        if ($(this).val() === '') {
            alert('Please enter option of question!');
            $(this).focus();
            numValid = false;
            return false;
        } else {
            return true;
        }
    });
    if (!numValid) {
        return;
    }
    $('#new-question .question-header input').attr('value', function () {
        return $(this).val();
    });
    $('#new-question .question-body input').attr('value', function () {
        return $(this).val();
    });
    $('.questions-container #none-question').addClass('hidden');
    $('.questions-container').append($('#new-question').html());
    var questionType = $('#new-question :selected').attr('value');
    var questionID = $('#new-question .question').attr('id');
    $('.questions-container #' + questionID + ' select.type-question-selection').val(questionType);
    $('.questions-container #' + questionID + ' .question-footer input').prop('checked', $('#new-question .question-footer input').prop('checked'));
    $('.questions-container #' + questionID + ' .question-body .main-display textarea.first-label').val($('#new-question .question-body .main-display textarea.first-label').val());
    $('.questions-container #' + questionID + ' .question-body .main-display textarea.last-label').val($('#new-question .question-body .main-display textarea.last-label').val());
    $('.questions-container #' + questionID + ' .question-body .main-setting select.level-begin').val($('#new-question .question-body .main-setting select.level-begin').val());
    $('.questions-container #' + questionID + ' .question-body .main-setting select.level-end').val($('#new-question .question-body .main-setting select.level-end').val());
    $('.questions-container #' + questionID + ' .branching-logic .branch-body select.branching-combobox').val(function () {
        var branchBodyID = $(this).closest('.branch-body').attr('id');
        return $('#new-question .branching-logic .branch-body#' + branchBodyID + ' select.branching-combobox').val();
    });
    $('.branching-logic select.branching-combobox option#end-of-all').before('<option id="' + questionID + '" value="' + questionID + '">' + $('#new-question .question-header input').val() + '</option>');
    $('#new-question').html('');
    $('#button-new-question').removeClass('hidden');
    $('.createNewTask .questions-container').css('width', '54%');
    $('.createNewTask .questions-function').css('width', '45%');
    $('.questions-container #' + questionID + ' .question-header input').prop('disabled', true);
    $('.questions-container #' + questionID + ' .question-header select.type-question-selection').prop('disabled', true);
    $('.questions-container #' + questionID + ' .question-body .option:not(.option-other) input[type="text"]').prop('disabled', true);
    $('.questions-container #' + questionID + ' .question-body input[type="number"]').prop('disabled', true);
    
    // convert the JavaScript object into a string
    var question = {
        'question_id': questionID,
        'title': $('.questions-container #' + questionID + ' .question-header input').val(),
        'type': questionType,
        'required': $('.questions-container #' + questionID + ' .question-footer input').prop('checked')
    };
    
    if (question.type === 'photo') {
        var question_photo = {
            'question_id': questionID,
            'num_photos': $('.questions-container #' + questionID + ' .question-body input[type="number"]').val()
        };
        
        $('.questions-container #' + questionID + ' #list_questions').attr('value', JSON.stringify({'question': question, 'question_photo': question_photo}));
    } else if (question.type === 'star-ratings'){
        var question_star_ratings = {
            'question_id': questionID,
            'num_min': $('.questions-container #' + questionID + ' .question-body .main-setting select.level-begin').val(),
            'num_max': $('.questions-container #' + questionID + ' .question-body .main-setting select.level-end').val(),
            'label_min': $('.questions-container #' + questionID + ' .question-body .main-display textarea.first-label').val(),
            'label_max': $('.questions-container #' + questionID + ' .question-body .main-display textarea.last-label').val()
        };
        
        $('.questions-container #' + questionID + ' #list_questions').attr('value', JSON.stringify({'question': question, 'question_star_ratings': question_star_ratings}));
    } else if (question.type === 'single-choice' || question.type === 'multiple-choice'){
        var question_choice = {
            'question_id': questionID,
            'has_other': false,
            'option': []
        };
        
        if ($('.questions-container #' + questionID + ' .question-body .option.option-other').length > 0) {
            question_choice.has_other = true;
        }
        
        $('.questions-container #' + questionID + ' .question-body .option input[type="text"]').each(function () {
            var option_id = $(this).closest('.option').attr('id');
            var option_title = $(this).val();
            var dest_question_id = $('.questions-container #' + questionID + ' .branching-logic .branch-body#' + option_id + ' select.branching-combobox').val();
            question_choice.option.push({
                'option_id': option_id,
                'option_title': option_title,
                'dest_question_id': dest_question_id
            });
        });
        
        $('.questions-container #' + questionID + ' #list_questions').attr('value', JSON.stringify({'question': question, 'question_choice': question_choice}));
    } else if (question.type === 'in-app-browser'){
        var question_in_app_browser = {
            'question_id': questionID,
            'link': $('.questions-container #' + questionID + ' .question-body input[type="text"]').val()
        };
        
        $('.questions-container #' + questionID + ' #list_questions').attr('value', JSON.stringify({'question': question, 'question_in_app_browser': question_in_app_browser}));
    } else if (question.type === 'numerical' || question.type ==='free-text'){
        $('.questions-container #' + questionID + ' #list_questions').attr('value', JSON.stringify({'question': question}));
    }
    
    $('.questions-container #' + questionID + ' #list_questions').attr('disabled', false);
}
;
/** author: Quang
 * show all button "delete option" when having only 1 option before adding
 * add an new option at last but before option "other"
 * add this option to branching-logic in parent question (before option "other")
 **/
 function addNewOption(target) {
    if (target.closest('.question-body').children('.option:not(.option-add)').length == 1) {
        target.closest('.question-body').find('.option:not(.option-add) button').removeClass('hidden');
    }
    var questionType = target.closest('.question').find(':selected').attr('value');
    var optionID = 'option-' + $.now();
    if (target.closest('.question-body').find('.option.option-other').length == 1) {
        target.closest('.question-body').find('.option.option-other').before('<div id="' + optionID + '" class="option clearfix">' + $('.createNewTask .question-template.' + questionType + ' .option:not(option-add)').html() + '</div>');
        target.closest('.question-body').find('.branching-logic .branch-body').last().before(function () {
            return '<div id="' + optionID + '" class="branch-body row-fluid clearfix"">' + $(this).html() + '</option>';
        });
        target.closest('.question-body').find('.branching-logic .branch-body#' + optionID + ' .option-name').html('[blank option name]');
    } else {
        target.closest('.option').before('<div id="' + optionID + '" class="option clearfix">' + $('.createNewTask .question-template.' + questionType + ' .option:not(option-add)').html() + '</div>');
        target.closest('.question-body').find('.branching-logic .branch-body').last().after(function () {
            return '<div id="' + optionID + '" class="branch-body row-fluid clearfix"">' + $(this).html() + '</option>';
        });
        target.closest('.question-body').find('.branching-logic .branch-body#' + optionID + ' .option-name').html('[blank option name]');
    }
}
;
/** author: Quang
 * delete the target option
 * hide button "delete option" when having only 1 option after deleting
 * remove target option in branching-logic in parent question
 **/
 function deleteTargetOption(target) {
    if (target.closest('.question-body').children('.option:not(.option-add)').length <= 2) {
        target.closest('.question-body').find('.option:not(.option-add) button').addClass('hidden');
    }
    target.closest('.question-body').find('.branching-logic .branch-body#' + target.closest('.option').attr('id')).remove();
    target.closest('.option').remove();
}
;
/** author: Quang
 * show all button "delete option" when having only 1 option before adding
 * add option "other"
 * add option "other" to branching-logic in parent question
 **/
 function addOptionOther(target) {
    if (target.closest('.question-body').children('.option:not(.option-add)').length == 1) {
        target.closest('.question-body').find('.option:not(.option-add) button').removeClass('hidden');
    }
    target.closest('.question-body').find('.option.option-add .add-other-container').addClass('hidden');
    var questionType = target.closest('.question').find(':selected').attr('value');
    var optionID = 'option-' + $.now();
    target.closest('.option').before('<div id="' + optionID + '" class="option option-other clearfix">' + $('.createNewTask #option-other-template.' + questionType).html() + '</div>');
    target.closest('.question-body').find('.branching-logic .branch-body').last().after(function () {
        return '<div id="' + optionID + '" class="branch-body row-fluid clearfix"">' + $(this).html() + '</option>';
    });
    target.closest('.question-body').find('.branching-logic .branch-body#' + optionID + ' .option-name').html('<i>Other</i>');
}
;
/** author: Quang
 * delete the target option "other"
 * hide button "delete option other" when having only 1 option after deleting
 * remove option "other" in branching-logic in parent question
 **/
 function deleteOptionOther(target) {
    if (target.closest('.question-body').children('.option:not(.option-add)').length <= 2) {
        target.closest('.question-body').find('.option:not(.option-add) button').addClass('hidden');
    }
    target.closest('.question-body').find('.option.option-add .add-other-container').removeClass('hidden');
    target.closest('.question-body').find('.branching-logic .branch-body#' + target.closest('.option').attr('id')).remove();
    target.closest('.option').remove();
}
;
/** author: Quang
 * change textarea begin-label when input level-begin level-text are changed
 **/
 function changeLevelBeginText(target) {
    target.closest('.question-body').find('textarea.star-label.first-label').val(target.val());
}
/** author: Quang
 * change textarea end-label when input level-end level-text are changed
 **/
 function changeLevelEndText(target) {
    target.closest('.question-body').find('textarea.star-label.last-label').val(target.val());
}
/** author: Quang
 * change first level number and show/hide some star-level when select-start-level level-begin are changed
 **/
 function changeFirstLevel(target) {
    target.closest('.question-body').find('.option-setting .level-begin input.level-number').val(target.val());
    target.closest('.question-body').find('.main-display .star-level.level-zero').toggleClass('hidden');
    var width = 71.61 / (target.closest('.main-setting').find('.select-star-level.level-end').val() - target.val() + 1);
    target.closest('.question-body').find('.main-display .star-level').css('width', width + '%');
}
/** author: Quang
 * change last level number and show/hide some star-level when select-start-level level-end are changed
 **/
 function changeLastLevel(target) {
    target.closest('.question-body').find('.option-setting .level-end input.level-number').val(target.val());
    var targetCurrent = target.closest('.question-body').find('.main-display .star-level.level-two');
    for (i = 3; i <= 10; i++) {
        targetCurrent = targetCurrent.next();
        if (i <= target.val()) {
            targetCurrent.removeClass('hidden');
        } else {
            targetCurrent.addClass('hidden');
        }
    }
    var width = 71.61 / (target.val() - target.closest('.main-setting').find('.select-star-level.level-begin').val() + 1);
    target.closest('.question-body').find('.main-display .star-level').css('width', width + '%');
}
/** author: Quang
 * change question title in all branching-logic combobox when target question title is changed
 **/
 function changeQuestionTitle(target) {
    if (target.val() != '') {
        $('.branching-logic select.branching-combobox option#' + target.closest('.question').attr('id')).html(target.val());
    } else {
        $('.branching-logic select.branching-combobox option#' + target.closest('.question').attr('id')).html('[blank question]');
    }
}
/** author: Quang
 * change option name in branching-logic combobox in parent question when target option name is changed
 **/
 function changeOptionName(target) {
    if (target.val() != '') {
        target.closest('.question-body').find('.branching-logic .branch-body#' + target.closest('.option').attr('id') + ' .option-name').html(target.val());
    } else {
        target.closest('.question-body').find('.branching-logic .branch-body#' + target.closest('.option').attr('id') + ' .option-name').html('[blank option name]');
    }
}
/** author: Quang
 * remove this target question in all branching-logic combobox before deleting
 * delete the target question
 * if there is no question after deleting, show the message "No question have been created!"
 **/
 function deleteQuestion(target) {
    if (confirm("Do you really wanna delete this question?") == true) {
        var questionID = target.closest('.question').attr('id');
        $('.branching-logic select.branching-combobox option#' + questionID).remove();
        $('.questions-container .question#' + questionID).remove();
        $('#new-question .question#' + questionID).remove();
        if ($('.questions-container .question').length == 0) {
            $('.questions-container #none-question').removeClass('hidden');
        }
    }
}
/** author: Quang
 * copy target question and paste into panel right
 * copy all data
 * copy all data of branching logic if type of question is single-choice/multiple-choice
 * change data-target and id of modal in branching-logic in this copy question
 * set enabled for everything in the question in the panel right
 **/
 function copyQuestion(target) {
    var targetQuestion = target.closest('.question');
    var questionID = 'question-' + $.now();
    var questionType = targetQuestion.find(':selected').attr('value');
    $('#new-question').html('<div id="' + questionID + '" class="question ' + questionType + ' clearfix">' + targetQuestion.html() + '</div>');
    $('#new-question #' + questionID + ' select.type-question-selection').val(questionType);
    $('#new-question #' + questionID + ' .question-footer input').prop('checked', targetQuestion.find('.question-footer input').prop('checked'));
    $('#new-question #' + questionID + ' .question-body .main-display textarea.first-label').val(targetQuestion.find('.question-body .main-display textarea.first-label').val());
    $('#new-question #' + questionID + ' .question-body .main-display textarea.last-label').val(targetQuestion.find('.question-body .main-display textarea.last-label').val());
    $('#new-question #' + questionID + ' .question-body .main-setting select.level-begin').val(targetQuestion.find('.question-body .main-setting select.level-begin').val());
    $('#new-question #' + questionID + ' .question-body .main-setting select.level-end').val(targetQuestion.find('.question-body .main-setting select.level-end').val());
    $('#new-question #' + questionID + ' .branching-logic .branch-body select.branching-combobox').val(function () {
        var branchBodyID = $(this).closest('.branch-body').attr('id');
        return targetQuestion.find('.branching-logic .branch-body#' + branchBodyID + ' select.branching-combobox').val();
    });
    $('#button-new-question').addClass('hidden');
    $('.createNewTask .questions-container').css('width', '45%');
    $('.createNewTask .questions-function').css('width', '54%');
    $('#new-question #' + questionID + ' .branching-logic').children('button').attr('data-target', '#modal-' + questionID);
    $('#new-question #' + questionID + ' .branching-logic').children('.modal').attr('id', 'modal-' + questionID);
    $('#new-question #' + questionID + ' .question-header input').prop('disabled', false);
    $('#new-question #' + questionID + ' .question-header select.type-question-selection').prop('disabled', false);
    $('#new-question #' + questionID + ' .question-body .option:not(.option-other) input[type="text"]').prop('disabled', false);
    $('#new-question #' + questionID + ' .question-body input[type="number"]').prop('disabled', false);
}
/** author: Quang
 * edit target question by bring it into panel right
 * copy all data
 * copy all data of branching logic if type of question is single-choice/multiple-choice
 * change data-target and id of modal in branching-logic in this copy question
 * set enabled for everything in the question in the panel right
 **/
 function editQuestion(target) {
    var targetQuestion = target.closest('.question');
    var questionID = targetQuestion.attr('id');
    var questionType = targetQuestion.find(':selected').attr('value');
    $('#new-question').html('<div id="' + questionID + '" class="question edit-question ' + questionType + ' clearfix">' + targetQuestion.html() + '</div>');
    $('#new-question #' + questionID + ' select.type-question-selection').val(questionType);
    $('#new-question #' + questionID + ' .question-footer input').prop('checked', targetQuestion.find('.question-footer input').prop('checked'));
    $('#new-question #' + questionID + ' .question-body .main-display textarea.first-label').val(targetQuestion.find('.question-body .main-display textarea.first-label').val());
    $('#new-question #' + questionID + ' .question-body .main-display textarea.last-label').val(targetQuestion.find('.question-body .main-display textarea.last-label').val());
    $('#new-question #' + questionID + ' .question-body .main-setting select.level-begin').val(targetQuestion.find('.question-body .main-setting select.level-begin').val());
    $('#new-question #' + questionID + ' .question-body .main-setting select.level-end').val(targetQuestion.find('.question-body .main-setting select.level-end').val());
    $('#new-question #' + questionID + ' .branching-logic .branch-body select.branching-combobox').val(function () {
        var branchBodyID = $(this).closest('.branch-body').attr('id');
        return targetQuestion.find('.branching-logic .branch-body#' + branchBodyID + ' select.branching-combobox').val();
    });
    $('#button-new-question').addClass('hidden');
    $('.createNewTask .questions-container').css('width', '45%');
    $('.createNewTask .questions-function').css('width', '54%');
    $('#new-question #' + questionID + ' .branching-logic').children('button').attr('data-target', '#modal-edit-' + questionID);
    $('#new-question #' + questionID + ' .branching-logic').children('.modal').attr('id', 'modal-edit-' + questionID);
    $('#new-question #' + questionID + ' .question-header input').prop('disabled', false);
    $('#new-question #' + questionID + ' .question-header select.type-question-selection').prop('disabled', false);
    $('#new-question #' + questionID + ' .question-body .option:not(.option-other) input[type="text"]').prop('disabled', false);
    $('#new-question #' + questionID + ' .question-body input[type="number"]').prop('disabled', false);
    
    $('#new-question #' + questionID + ' #list_questions').attr('disabled', true);
}
/** author: Quang
 * check validation first
 * update question
 * copy all data
 * copy all data of branching logic if type of question is single-choice/multiple-choice
 * change data-target and id of modal in branching-logic in the base question
 * set readonly/disabled for everything in the base question in the sidebar
 **/
 function updateQuestion() {
    if ($('#new-question .question-header input').val() === '') {
        alert('Please enter the title of question!');
        $('#new-question .question-header input').focus();
        return;
    } else if ($('#new-question .question-body input[type="number"]').val() === '') {
        alert('Please enter number of photos (between 1 and 100)!');
        $('#new-question .question-body input[type="number"]').focus();
        return;
    } else if ($('#new-question .in-app-browser .question-body input[type="text"]').val() === '') {
        alert('Please enter the link!');
        $('#new-question .question-body input[type="text"]').focus();
        return;
    }
    var numValid = true;
    $('#new-question .question-body .option:not(.option-other) input[type="text"]').each(function () {
        if ($(this).val() == '') {
            alert('Please enter option of question!');
            $(this).focus();
            numValid = false;
            return false;
        } else {
            return true;
        }
    });
    if (!numValid) {
        return;
    }
    $('#new-question .question-header input').attr('value', function () {
        return $(this).val()
    });
    $('#new-question .question-body input').attr('value', function () {
        return $(this).val()
    });
    var questionID = $('#new-question .question').attr('id');
    $('.questions-container .question#' + questionID).html($('#new-question .question').html());
    var questionType = $('#new-question :selected').attr('value');
    $('.questions-container .question#' + questionID).removeClass('single-choice multiple-choice photo free-text numerical star-ratings in-app-browser edit-question').addClass(questionType);
    $('.questions-container #' + questionID + ' select.type-question-selection').val(questionType);
    $('.questions-container #' + questionID + ' .question-footer input').prop('checked', $('#new-question .question-footer input').prop('checked'));
    $('.questions-container #' + questionID + ' .question-body .main-display textarea.first-label').val($('#new-question .question-body .main-display textarea.first-label').val());
    $('.questions-container #' + questionID + ' .question-body .main-display textarea.last-label').val($('#new-question .question-body .main-display textarea.last-label').val());
    $('.questions-container #' + questionID + ' .question-body .main-setting select.level-begin').val($('#new-question .question-body .main-setting select.level-begin').val());
    $('.questions-container #' + questionID + ' .question-body .main-setting select.level-end').val($('#new-question .question-body .main-setting select.level-end').val());
    $('.questions-container #' + questionID + ' .branching-logic .branch-body select.branching-combobox').val(function () {
        var branchBodyID = $(this).closest('.branch-body').attr('id');
        return $('#new-question .branching-logic .branch-body#' + branchBodyID + ' select.branching-combobox').val();
    });
    $('#new-question').html('');
    $('#button-new-question').removeClass('hidden');
    $('.createNewTask .questions-container').css('width', '54%');
    $('.createNewTask .questions-function').css('width', '45%');
    $('.questions-container #' + questionID + ' .branching-logic').children('button').attr('data-target', '#modal-' + questionID);
    $('.questions-container #' + questionID + ' .branching-logic').children('.modal').attr('id', 'modal-' + questionID);
    $('.questions-container #' + questionID + ' .question-header input').prop('disabled', true);
    $('.questions-container #' + questionID + ' .question-header select.type-question-selection').prop('disabled', true);
    $('.questions-container #' + questionID + ' .question-body .option:not(.option-other) input[type="text"]').prop('disabled', true);
    $('.questions-container #' + questionID + ' .question-body input[type="number"]').prop('disabled', true);
    
    // convert the JavaScript object into a string
    var question = {
        'question_id': questionID,
        'title': $('.questions-container #' + questionID + ' .question-header input').val(),
        'type': questionType,
        'required': $('.questions-container #' + questionID + ' .question-footer input').prop('checked')
    };
    
    if (question.type === 'photo') {
        var question_photo = {
            'question_id': questionID,
            'num_photos': $('.questions-container #' + questionID + ' .question-body input[type="number"]').val()
        };
        
        $('.questions-container #' + questionID + ' #list_questions').attr('value', JSON.stringify({'question': question, 'question_photo': question_photo}));
    } else if (question.type === 'star-ratings'){
        var question_star_ratings = {
            'question_id': questionID,
            'num_min': $('.questions-container #' + questionID + ' .question-body .main-setting select.level-begin').val(),
            'num_max': $('.questions-container #' + questionID + ' .question-body .main-setting select.level-end').val(),
            'label_min': $('.questions-container #' + questionID + ' .question-body .main-display textarea.first-label').val(),
            'label_max': $('.questions-container #' + questionID + ' .question-body .main-display textarea.last-label').val()
        };
        
        $('.questions-container #' + questionID + ' #list_questions').attr('value', JSON.stringify({'question': question, 'question_star_ratings': question_star_ratings}));
    } else if (question.type === 'single-choice' || question.type === 'multiple-choice'){
        var question_choice = {
            'question_id': questionID,
            'has_other': false,
            'option': []
        };
        
        if ($('.questions-container #' + questionID + ' .question-body .option.option-other').length > 0) {
            question_choice.has_other = true;
        }
        
        $('.questions-container #' + questionID + ' .question-body .option input[type="text"]').each(function () {
            var option_id = $(this).closest('.option').attr('id');
            var option_title = $(this).val();
            var dest_question_id = $('.questions-container #' + questionID + ' .branching-logic .branch-body#' + option_id + ' select.branching-combobox').val();
            question_choice.option.push({
                'option_id': option_id,
                'option_title': option_title,
                'dest_question_id': dest_question_id
            });
        });
        
        $('.questions-container #' + questionID + ' #list_questions').attr('value', JSON.stringify({'question': question, 'question_choice': question_choice}));
    } else if (question.type === 'in-app-browser'){
        var question_in_app_browser = {
            'question_id': questionID,
            'link': $('.questions-container #' + questionID + ' .question-body input[type="text"]').val()
        };
        
        $('.questions-container #' + questionID + ' #list_questions').attr('value', JSON.stringify({'question': question, 'question_in_app_browser': question_in_app_browser}));
    } else if (question.type === 'numerical' || question.type ==='free-text'){
        $('.questions-container #' + questionID + ' #list_questions').attr('value', JSON.stringify({'question': question}));
    }
    
    $('.questions-container #' + questionID + ' #list_questions').attr('disabled', false);
}
/** author: Quang
 * clear all branch of option
 **/
 function clearAllBranch(target) {
    target.closest('.branch-container').find('.branch-body select').val('no-choice');
}
/** author: Quang
 * clear branch of target option
 **/
 function clearBranch(target) {
    target.closest('.branch-body').find('select').val('no-choice');
}
