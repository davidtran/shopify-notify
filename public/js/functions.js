function getFormData(formName) {
  var formData = {};
  inputSelector = getInputFromForm(formName);
  $(inputSelector).each(function(index, field) {
    var name = $(field).attr('name');
    var type = $(field).attr('type');
    if (type == 'checkbox') {
      value = $(field).is(':checked') ? true : false;
    } else if (type == 'radio') {
      value = $('input[name="' + name + '"]:checked').val();
    } else {
      var value = $(field).val();
    }
    formData[name] = value;
  });
  return formData;
}


function template(tpl, data) {
  var re = /\{\{([^\}\}]+)?\}\}/g, match;
  while(match = re.exec(tpl)) {
    tpl = tpl.replace(match[0], data[match[1]])
  }
  return tpl;
}

function getInputFromForm(formName) {
  var formSelector = 'form[name="' + formName + '"] ';
  var inputSelector = formSelector + 'input, ' + formSelector + ' select,' + formSelector + ' textarea'
  return inputSelector;
}
