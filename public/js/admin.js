$(function() {
  $('#btnTest').click(function(e) {
    e.preventDefault();
    var formData = getFormData('messageForm');

    var content = template(formData.content, {
      count: Math.floor(Math.random() * 50)
    });

    var $n = noty({
      text: content,
      layout: formData.position,
      type:'success',
      theme:'relax',
      timeout: formData.displayTime * 1000
    });
    return false;
  });

  $('#btnSave').click(function(e) {
    e.preventDefault();
    saveFormData();
    return false;
  })
  function saveFormData() {
    var formData = getFormData('messageForm');
    $.ajax({
      url: '/admin',
      data: formData,
      type: 'post',
      success: function() {
        noty({
          text: 'Your settings have been saved',
          layout: 'bottomRight',
          type: 'success',
          theme:'relax',
          timeout: 1000
        });
      },
      error: function(err) {
        noty({
          text: err.responseText,
          layout: 'bottomRight',
          type: 'alert',
          theme:'relax',
          timeout: 1000
        });
      }
    })
  }

  $('.position-container .btn[data-position="#{form.position}"]').addClass('active');

  $('.position-container .btn').click(function(e) {
    e.preventDefault();
    var position = $(this).data('position');
    $('input[name="position"]').val(position);
    $('.position-container .btn').removeClass('active');
    $(this).addClass('active');
    return false;
  });
});

