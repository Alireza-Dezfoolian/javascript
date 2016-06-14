//by Alireza Dezfoolian - www.dezfoolian.com
"use strict";
(function($) {
  	$(function() {
    var formInputs = $("form").find("input"),
    getAttr,
    filledForm = {
      "fname": "Alireza",
      "lname": "Dezfoolian",
      "suburb": "Sydney",
      "state": "NSW",
      "postcode": "2000",
      "mobile": "0 406 340 642",
      "email": "dezfoolian@gmail.com"
    }

    function fillForm() {
      $.each(formInputs, function(i, e) {
        getAttr = testAttr(i, "id");
        if (getAttr < 0) { getAttr = testAttr(i, "name");}
        if (getAttr => 0) {$(e).val(filledForm[Object.keys(filledForm)[getAttr]]);}
      });
    };

    function clearForm() {
      $.each(formInputs, function(i, e) {
        $(e).val("");
      });
    }

    function testAttr(i, attr) {
      return Object.keys(filledForm).indexOf($(formInputs[i]).attr(attr));
    }
   
    $("#clear-form").on("click", function() { clearForm();});
    $("#fill-form").on("click", function() {fillForm();});

    fillForm();
  });
})(jQuery);