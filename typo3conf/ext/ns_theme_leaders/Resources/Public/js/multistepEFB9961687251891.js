const initConsentPanel = () => {
    document.querySelectorAll("form .custom-checkbox input[type='checkbox']").forEach(checkbox => {
        let revealArea = checkbox.closest("form").querySelector(".collapse.custom-checkbox__reveal");

        if(revealArea) {
            $(revealArea).on("shown.bs.collapse", function () {
                revealArea.dataset.shown = "true";

                let toggleLink = revealArea.parentNode.querySelector(".custom-checkbox__desc > a");
                if(toggleLink && toggleLink.hasAttribute("data-text-expanded")) {
                    toggleLink.innerText = toggleLink.getAttribute("data-text-expanded");
                }
            });

            $(revealArea).on("hide.bs.collapse", function () {
                let toggleLink = revealArea.parentNode.querySelector(".custom-checkbox__desc > a");
                if(toggleLink && toggleLink.hasAttribute("data-text-collapsed")) {
                    toggleLink.innerText = toggleLink.getAttribute("data-text-collapsed");
                }
            });

            checkbox.addEventListener("click", event => { 
                if(event.target.checked) {
                    if(revealArea.classList.contains("show")) {
                        $(revealArea).collapse("hide");
                    } else {
                        if(revealArea.dataset.shown !== "true") {
                            $(revealArea).collapse("show");
                        }
                    }  
                } 
            });
        }
    });
}

//Call a similar method when the document is ready
$(document).ready(function() {

    var page = $('.tabs-pane').attr('id');
    var page_add = '#' + page;
    var list_page = $("li .nav-link").attr('href');
    //alert(page);
    var id = $('.tabs-pane').attr('role');
    var prev = id - 1;

    if ($('li .nav-link').hasClass('done')) {
        $("li .nav-link[href='#page-" + prev + "']").addClass('done');
    }

    // For phone number validation
    $(".isNumber").on("keyup change", function() {
        if ($(this).inputmask('unmaskedvalue').trim().charAt(0) == "1"){
            $(this).inputmask("9 (999) 999-9999");}
        else{
            $(this).inputmask("(999) 999-9999");}
    });
    $(".isNumber").inputmask({
        showMaskOnHover: false,
        mask: '(999) 999-9999'}
    );

    // Custom consent checkbox
    initConsentPanel();

    document.addEventListener("click", function(e) {

            //1. Perform here client-side validation of the form…

            //Refresh recaptcha
            if ((typeof(grecaptcha) !== "undefined") && (e.target.id == "submitForm" && $("#recaptcha-render").length > 0))
            {
                var response = grecaptcha.getResponse();
                if (!response) {
                    $('#error_recaptcha').text('reCaptcha not verified');
                    e.preventDefault();
                }
            }

            //2. If the action is form submit or prev/next button click on the form – the ids used are the ids of the Next/Prev/Submit buttons in the HTML

            if (e.target && (e.target.id == "nextForm" || e.target.id == "previousForm")) {

                e.preventDefault();

                e.stopPropagation();

                var formdata = $(".ajaxform").serialize();

                var currentPageName = e.target.name;

                var currentPage = e.target.value;

                var back_value = $('#previousForm').val();
                var next_value = $('#nextForm').val();

                formdata += "&" + encodeURIComponent(currentPageName) + "=" + currentPage;

                //3. The AJAX request

                $.ajax({

                    url: $(".ajaxform").attr("action"),

                    type: "POST",

                    data: formdata,

                    enctype: "multipart/form-data",

                    success: function(data) {

                        //Replace the form html content with the new one from the server

                        $(".ajaxform").empty();

                        var content = $(".ajaxform", data).html();
                        //alert(content);

                        $(".ajaxform").html(content);

                        // For phone number validation
                        $(".isNumber").on("keyup change", function() {
                            if ($(this).inputmask('unmaskedvalue').trim().charAt(0) == "1"){
                                $(this).inputmask("9 (999) 999-9999");}
                            else{
                                $(this).inputmask("(999) 999-9999");}
                        });
                        $(".isNumber").inputmask({
                            showMaskOnHover: false,
                            mask: '(999) 999-9999'}
                        );

                        // Custom consent checkbox
                        initConsentPanel();

                        // Always hide first text-box row from "summary step"
                        $('.table-responsive tr:first-child').hide();
                    },

                    complete: function() {

                    }

                });

            }


    });

});
